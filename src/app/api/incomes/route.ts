import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { withDatabase } from "@/lib/db";
import { db } from "@/lib/db";
import { incomes, projects } from "@/drizzle.schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const userIncomes = await withDatabase(async () => {
      const query = db.select({
        id: incomes.id,
        amount: incomes.amount,
        incomeDate: incomes.incomeDate,
        description: incomes.description,
        status: incomes.status,
        invoiceNumber: incomes.invoiceNumber,
        invoiceUrl: incomes.invoiceUrl,
        paymentMethod: incomes.paymentMethod,
        notes: incomes.notes,
        projectId: incomes.projectId,
        projectName: projects.name,
      })
        .from(incomes)
        .leftJoin(projects, eq(incomes.projectId, projects.id))
        .where(
          projectId 
            ? and(eq(incomes.userId, session.id), eq(incomes.projectId, parseInt(projectId)))
            : eq(incomes.userId, session.id)
        )
        .orderBy(desc(incomes.incomeDate))
        .limit(100);

      return await query;
    });

    return NextResponse.json(userIncomes);
  } catch (error) {
    console.error("Incomes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch incomes" },
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
    const { projectId, amount, description, incomeDate, status, invoiceNumber, invoiceUrl, paymentMethod, notes } = body;

    if (!projectId || !amount || !incomeDate) {
      return NextResponse.json(
        { error: "Project, amount, and income date are required" },
        { status: 400 }
      );
    }

    // Verify the project belongs to the user
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, parseInt(projectId)), eq(projects.userId, session.id)),
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    const newIncome = await withDatabase(async () => {
      const result = await db.insert(incomes).values({
        userId: session.id,
        projectId: parseInt(projectId),
        amount: parseFloat(amount).toFixed(2),
        description: description || null,
        incomeDate: new Date(incomeDate),
        status: status || "paid",
        invoiceNumber: invoiceNumber || null,
        invoiceUrl: invoiceUrl || null,
        paymentMethod: paymentMethod || null,
        notes: notes || null,
      }).returning();

      return result[0];
    });

    return NextResponse.json(newIncome, { status: 201 });
  } catch (error) {
    console.error("Income creation error:", error);
    return NextResponse.json(
      { error: "Failed to create income" },
      { status: 500 }
    );
  }
}
