import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { receipts } from "@/drizzle.schema";
import { eq, and } from "drizzle-orm";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const receiptId = parseInt(params.id, 10);

    if (isNaN(receiptId)) {
      return NextResponse.json(
        { error: "Invalid receipt ID" },
        { status: 400 }
      );
    }

    // Get receipt and verify ownership
    const [receipt] = await db
      .select()
      .from(receipts)
      .where(
        and(
          eq(receipts.id, receiptId),
          eq(receipts.userId, user.id)
        )
      )
      .limit(1);

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt not found" },
        { status: 404 }
      );
    }

    // Map receipt status to user-friendly response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = {
      id: receipt.id,
      expenseId: receipt.expenseId,
      status: receipt.status,
      fileName: receipt.fileName,
      uploadedAt: receipt.uploadedAt,
      processedAt: receipt.processedAt,
    };

    if (receipt.status === "pending" || receipt.status === "processing") {
      response.message = "Your receipt is being analyzed. This usually takes 5-15 seconds.";
    } else if (receipt.status === "completed") {
      response.message = "Receipt parsed successfully";
      response.data = {
        merchantName: receipt.merchantName || receipt.normalizedData?.merchantName,
        total: receipt.normalizedData?.total,
        date: receipt.normalizedData?.date,
        category: receipt.normalizedData?.category,
        confidenceScore: receipt.confidenceScore,
        normalizedData: receipt.normalizedData,
      };
    } else if (receipt.status === "failed") {
      response.message = "Receipt parsing failed";
      response.error = receipt.lastError;
      response.retryCount = receipt.retryCount;
      if (receipt.retryCount < 3) {
        response.canRetry = true;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
