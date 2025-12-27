import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, expenses, incomes } from "@/drizzle.schema";
import { eq, and, sql } from "drizzle-orm";

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

    // Fetch project details
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, id), eq(projects.userId, session.id)),
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Calculate total expenses for this project
    const expenseResult = await db
      .select({ total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)` })
      .from(expenses)
      .where(and(eq(expenses.projectId, id), eq(expenses.userId, session.id)));
    
    const totalExpenses = parseFloat(expenseResult[0]?.total || "0");

    // Calculate total income for this project
    const incomeResult = await db
      .select({ total: sql<string>`COALESCE(SUM(${incomes.amount}), 0)` })
      .from(incomes)
      .where(and(eq(incomes.projectId, id), eq(incomes.userId, session.id)));
    
    const totalIncome = parseFloat(incomeResult[0]?.total || "0");

    // Net profit = Income - Expenses
    const netProfit = totalIncome - totalExpenses;

    return NextResponse.json({
      ...project,
      totalExpenses,
      totalIncome,
      netProfit,
    });
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
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
    const { name, clientName, clientEmail, description, status, budget } = body;

    const [updatedProject] = await db
      .update(projects)
      .set({
        name,
        clientName,
        clientEmail,
        description,
        status,
        budget: budget ? budget.toString() : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.userId, session.id)))
      .returning();

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
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

    const [deletedProject] = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, session.id)))
      .returning();

    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
