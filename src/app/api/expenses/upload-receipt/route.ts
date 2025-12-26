import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { uploadReceiptToS3 } from "@/lib/s3";
import { db } from "@/lib/db";
import { receipts } from "@/drizzle.schema";
import { processReceiptWithAI } from "@/lib/receipt-processor";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectIdStr = formData.get("projectId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const projectId = projectIdStr ? parseInt(projectIdStr, 10) : undefined;

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;
    const fileName = file.name;

    // Upload to S3 with compression
    const uploadResult = await uploadReceiptToS3({
      userId: user.id,
      projectId,
      fileName,
      fileBuffer,
      fileType,
    });

    // Create receipt record
    const [newReceipt] = await db
      .insert(receipts)
      .values({
        userId: user.id,
        projectId,
        filePath: fileName,
        fileName,
        fileSize: fileBuffer.length,
        fileType,
        s3Key: uploadResult.s3Key,
        status: "pending",
      })
      .returning();

    // Start AI processing asynchronously (fire and forget for MVP)
    // In production, this would be queued to SQS/Lambda
    processReceiptWithAI({
      receiptId: newReceipt.id,
      s3Key: uploadResult.s3Key,
      imageBase64: fileBuffer.toString("base64"),
      imageMediaType: fileType,
      fileName,
      userId: user.id,
    }).catch((error) => {
      console.error("Background receipt processing failed:", error);
    });

    return NextResponse.json({
      success: true,
      receiptId: newReceipt.id,
      message: "Receipt uploaded and processing started. You can check the status shortly.",
      originalSize: uploadResult.originalSize,
      compressedSize: uploadResult.compressedSize,
      compressionRatio: ((1 - uploadResult.compressedSize / uploadResult.originalSize) * 100).toFixed(1),
    });
  } catch (error) {
    console.error("Upload error:", error);

    const errorMessage = error instanceof Error ? error.message : "Upload failed";

    // Return user-friendly error message
    if (errorMessage.includes("size exceeds")) {
      return NextResponse.json({ error: errorMessage }, { status: 413 });
    } else if (errorMessage.includes("not supported") || errorMessage.includes("Unsupported")) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    } else if (errorMessage.includes("Failed")) {
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    return NextResponse.json(
      { error: errorMessage || "Internal server error" },
      { status: 500 }
    );
  }
}
