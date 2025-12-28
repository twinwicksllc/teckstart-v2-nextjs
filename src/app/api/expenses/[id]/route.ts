import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { expenses } from "@/drizzle.schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const { vendor, description, amount, taxAmount, expenseDate, projectId, categoryId, isDeductible } = body;

    const [updatedExpense] = await db
      .update(expenses)
      .set({
        vendor,
        description,
        amount: amount ? parseFloat(amount).toFixed(2) : undefined,
        taxAmount: taxAmount ? parseFloat(taxAmount).toFixed(2) : undefined,
        expenseDate: expenseDate ? new Date(expenseDate) : undefined,
        projectId: projectId !== undefined ? (projectId ? parseInt(projectId) : null) : undefined,
        categoryId: categoryId !== undefined ? (categoryId ? parseInt(categoryId) : null) : undefined,
        isDeductible,
        updatedAt: new Date(),
      })
      .where(and(eq(expenses.id, id), eq(expenses.userId, session.id)))
      .returning();

    if (!updatedExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("Expense update error:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const [deletedExpense] = await db
      .delete(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.userId, session.id)))
      .returning();

    if (!deletedExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Expense deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
