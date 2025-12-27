import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { incomes } from "@/drizzle.schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);

    const income = await db.query.incomes.findFirst({
      where: and(eq(incomes.id, id), eq(incomes.userId, session.id)),
    });

    if (!income) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    return NextResponse.json(income);
  } catch (error) {
    console.error("Income fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch income" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const body = await request.json();
    const { amount, description, incomeDate, status, invoiceNumber, invoiceUrl, paymentMethod, notes } = body;

    const [updatedIncome] = await db
      .update(incomes)
      .set({
        amount: amount ? parseFloat(amount).toFixed(2) : undefined,
        description: description !== undefined ? description : undefined,
        incomeDate: incomeDate ? new Date(incomeDate) : undefined,
        status: status || undefined,
        invoiceNumber: invoiceNumber !== undefined ? invoiceNumber : undefined,
        invoiceUrl: invoiceUrl !== undefined ? invoiceUrl : undefined,
        paymentMethod: paymentMethod !== undefined ? paymentMethod : undefined,
        notes: notes !== undefined ? notes : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(incomes.id, id), eq(incomes.userId, session.id)))
      .returning();

    if (!updatedIncome) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    return NextResponse.json(updatedIncome);
  } catch (error) {
    console.error("Income update error:", error);
    return NextResponse.json(
      { error: "Failed to update income" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);

    const [deletedIncome] = await db
      .delete(incomes)
      .where(and(eq(incomes.id, id), eq(incomes.userId, session.id)))
      .returning();

    if (!deletedIncome) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Income deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete income" },
      { status: 500 }
    );
  }
}
