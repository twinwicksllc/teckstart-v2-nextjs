import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { withDatabase } from "@/lib/db";
import { db } from "@/lib/db";
import { expenses } from "../../drizzle.schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userExpenses = await withDatabase(async () => {
      return await db.select()
        .from(expenses)
        .where(eq(expenses.userId, session.id))
        .orderBy(desc(expenses.expenseDate))
        .limit(50);
    });

    return NextResponse.json(userExpenses);
  } catch (error) {
    console.error("Expenses fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { vendor, description, amount, taxAmount, expenseDate, projectId, categoryId } = body;

    if (!vendor || !amount || !expenseDate) {
      return NextResponse.json(
        { error: "Vendor, amount, and expense date are required" },
        { status: 400 }
      );
    }

    const newExpense = await withDatabase(async () => {
      const result = await db.insert(expenses).values({
        userId: session.id,
        vendor,
        description,
        amount: parseFloat(amount),
        taxAmount: taxAmount ? parseFloat(taxAmount) : null,
        expenseDate: new Date(expenseDate),
        projectId: projectId ? parseInt(projectId) : null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        source: "manual",
        isDeductible: true,
      });

      // Return the created expense
      return await db.select()
        .from(expenses)
        .where(eq(expenses.id, Number(result.insertId)))
        .limit(1);
    });

    return NextResponse.json(newExpense[0]);
  } catch (error) {
    console.error("Expense creation error:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}