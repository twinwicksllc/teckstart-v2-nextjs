import { db } from "@/lib/db";
import { receipts, expenses } from "@/drizzle.schema";
import { parseReceiptWithBedrock, parseReceiptWithHaiku, ParsedReceipt } from "@/lib/bedrock";
import { eq } from "drizzle-orm";

export interface ProcessReceiptOptions {
  receiptId: number;
  s3Key: string;
  imageBase64: string;
  imageMediaType: string;
  fileName: string;
  userId: number;
}

const MAX_RETRIES = 3;

/**
 * Process receipt with AI parsing (with retry logic)
 */
export async function processReceiptWithAI(options: ProcessReceiptOptions): Promise<void> {
  const { receiptId, s3Key, imageBase64, imageMediaType, fileName } = options;

  try {
    // Get current retry count
    const [receipt] = await db
      .select()
      .from(receipts)
      .where(eq(receipts.id, receiptId))
      .limit(1);

    if (!receipt) {
      throw new Error("Receipt not found");
    }

    // Check retry limit
    if (receipt.retryCount >= MAX_RETRIES) {
      await db
        .update(receipts)
        .set({
          status: "failed",
          lastError: "Max retries exceeded",
          updatedAt: new Date(),
        })
        .where(eq(receipts.id, receiptId));
      return;
    }

    // Update status to processing
    await db
      .update(receipts)
      .set({
        status: "processing",
        updatedAt: new Date(),
      })
      .where(eq(receipts.id, receiptId));

    // Check for similar receipts from this user to potentially skip AI or improve accuracy
    // (e.g., same filename or same vendor if we had it)
    // Note: Logic for using similar receipts is currently not implemented, so we skip the query.

    // Try Sonnet first for best quality
    let parsedData: ParsedReceipt;
    try {
      parsedData = await parseReceiptWithBedrock(imageBase64, imageMediaType);
    } catch (sonnetError) {
      console.warn("Sonnet parsing failed, falling back to Haiku:", sonnetError);
      // Fallback to Haiku (cheaper)
      try {
        parsedData = await parseReceiptWithHaiku(imageBase64, imageMediaType);
      } catch (haikuError) {
        throw new Error(`All parsing models failed. Sonnet: ${sonnetError}. Haiku: ${haikuError}`);
      }
    }

    // Validate parsed data has at least merchant and total
    if (!parsedData.merchantName || !parsedData.total) {
      throw new Error("Unable to extract critical fields (merchant name or total amount)");
    }

    // Calculate confidence score
    const confidenceFactors = [
      parsedData.merchantName ? 1 : 0,
      parsedData.date ? 1 : 0,
      parsedData.total ? 1 : 0,
      parsedData.tax ? 1 : 0,
      parsedData.lineItems && parsedData.lineItems.length > 0 ? 1 : 0,
    ];
    const confidenceScore = (confidenceFactors.reduce((a, b) => a + b, 0) / confidenceFactors.length) * 100;

    // Create or update expense record
    let expenseId: number;

    if (receipt.expenseId) {
      // Update existing expense
      await db
        .update(expenses)
        .set({
          vendor: parsedData.merchantName,
          amount: parsedData.total.toString(),
          taxAmount: parsedData.tax?.toString(),
          expenseDate: parsedData.date ? new Date(parsedData.date) : new Date(),
          lineItems: parsedData.lineItems,
          aiParsed: true,
          aiConfidence: confidenceScore.toString(),
          updatedAt: new Date(),
        })
        .where(eq(expenses.id, receipt.expenseId));

      expenseId = receipt.expenseId;
    } else {
      // Create new expense
      const [newExpense] = await db
        .insert(expenses)
        .values({
          userId: receipt.userId,
          projectId: receipt.projectId,
          vendor: parsedData.merchantName,
          amount: parsedData.total.toString(),
          taxAmount: parsedData.tax?.toString(),
          expenseDate: parsedData.date ? new Date(parsedData.date) : new Date(),
          receiptFileKey: s3Key,
          receiptFileName: fileName,
          lineItems: parsedData.lineItems,
          aiParsed: true,
          aiConfidence: confidenceScore.toString(),
          source: "receipt_upload",
        })
        .returning();

      expenseId = newExpense.id;
    }

    // Update receipt with parsed data
    await db
      .update(receipts)
      .set({
        expenseId,
        status: "completed",
        rawParsedData: parsedData.rawResponse,
        normalizedData: {
          merchantName: parsedData.merchantName,
          date: parsedData.date,
          total: parsedData.total,
          tax: parsedData.tax,
          currency: parsedData.currency,
          category: parsedData.category,
          isTaxable: parsedData.isTaxable,
          lineItems: parsedData.lineItems,
        },
        merchantName: parsedData.merchantName,
        vendorName: parsedData.merchantName,
        confidenceScore: confidenceScore.toString(),
        processedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(receipts.id, receiptId));
  } catch (error) {
    console.error("Receipt processing error:", error);

    // Increment retry count
    const [current] = await db
      .select()
      .from(receipts)
      .where(eq(receipts.id, receiptId))
      .limit(1);

    const newRetryCount = (current?.retryCount ?? 0) + 1;

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (newRetryCount >= MAX_RETRIES) {
      await db
        .update(receipts)
        .set({
          status: "failed",
          retryCount: newRetryCount,
          lastError: `Max retries exceeded. Last error: ${errorMessage}`,
          updatedAt: new Date(),
        })
        .where(eq(receipts.id, receiptId));
    } else {
      await db
        .update(receipts)
        .set({
          status: "failed", // Set to failed so UI knows it's not processing
          retryCount: newRetryCount,
          lastError: errorMessage,
          updatedAt: new Date(),
        })
        .where(eq(receipts.id, receiptId));
    }
  }
}

/**
 * Get receipt by ID
 */
export async function getReceiptById(receiptId: number) {
  const [receipt] = await db
    .select()
    .from(receipts)
    .where(eq(receipts.id, receiptId))
    .limit(1);

  return receipt;
}

/**
 * List receipts for a user
 */
export async function listReceiptsByUser(userId: number, limit = 50, offset = 0) {
  return db
    .select()
    .from(receipts)
    .where(eq(receipts.userId, userId))
    .orderBy((receipts) => receipts.createdAt)
    .limit(limit)
    .offset(offset);
}
