import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { uploadReceiptToS3 } from "@/lib/s3";
import { db } from "@/lib/db";
import { receipts } from "@/drizzle.schema";
import { processReceiptWithAI } from "@/lib/receipt-processor";
import { eq, and, gte } from "drizzle-orm";
export const runtime = "nodejs";

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
    const fileSize = fileBuffer.length;

    // Check for duplicate upload (same name and size for this user in the last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [existingReceipt] = await db
      .select()
      .from(receipts)
      .where(
        and(
          eq(receipts.userId, user.id),
          eq(receipts.fileName, fileName),
          eq(receipts.fileSize, fileSize),
          gte(receipts.createdAt, oneDayAgo)
        )
      )
      .limit(1);

    if (existingReceipt) {
      return NextResponse.json(
        { 
          error: "Duplicate upload detected", 
          message: "You already uploaded this file recently.",
          receiptId: existingReceipt.id,
          status: existingReceipt.status
        },
        { status: 409 }
      );
    }

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
