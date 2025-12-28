import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { expenses } from "@/drizzle.schema";
import { eq, and } from "drizzle-orm";
import { getSignedReceiptUrl } from "@/lib/s3";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const expenseId = parseInt(id, 10);
    if (isNaN(expenseId)) {
      return NextResponse.json({ error: "Invalid expense ID" }, { status: 400 });
    }

    // Get expense and verify ownership
    const [expense] = await db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.id, expenseId),
          eq(expenses.userId, user.id)
        )
      )
      .limit(1);

    if (!expense || !expense.receiptFileKey) {
      return NextResponse.json(
        { error: "Receipt not found" },
        { status: 404 }
      );
    }

    const signedUrl = await getSignedReceiptUrl(expense.receiptFileKey);

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Receipt URL error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
