import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { expenses, projects, expenseCategories } from "@/drizzle.schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const categoryId = searchParams.get("categoryId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let whereClause = eq(expenses.userId, user.id);

    if (projectId) {
      whereClause = and(whereClause, eq(expenses.projectId, parseInt(projectId))) as any;
    }
    if (categoryId) {
      whereClause = and(whereClause, eq(expenses.categoryId, parseInt(categoryId))) as any;
    }
    if (startDate) {
      whereClause = and(whereClause, gte(expenses.expenseDate, new Date(startDate))) as any;
    }
    if (endDate) {
      whereClause = and(whereClause, lte(expenses.expenseDate, new Date(endDate))) as any;
    }

    // 1. Spending by Category
    const categoryData = await db
      .select({
        name: expenseCategories.name,
        value: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.id))
      .where(whereClause)
      .groupBy(expenseCategories.name);

    // 2. Spending over Time (Monthly)
    const monthlyData = await db
      .select({
        month: sql<string>`to_char(${expenses.expenseDate}, 'YYYY-MM')`,
        amount: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .where(whereClause)
      .groupBy(sql`to_char(${expenses.expenseDate}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${expenses.expenseDate}, 'YYYY-MM')`);

    // 3. Spending by Project
    const projectData = await db
      .select({
        name: projects.name,
        amount: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .leftJoin(projects, eq(expenses.projectId, projects.id))
      .where(whereClause)
      .groupBy(projects.name);

    // 4. Vendor Breakdown (Top 5)
    const vendorData = await db
      .select({
        name: expenses.vendor,
        amount: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .where(whereClause)
      .groupBy(expenses.vendor)
      .orderBy(sql`sum(${expenses.amount}) desc`)
      .limit(5);

    return NextResponse.json({
      byCategory: categoryData.map(d => ({ ...d, value: parseFloat(d.value as any) || 0, name: d.name || "Uncategorized" })),
      monthly: monthlyData.map(d => ({ ...d, amount: parseFloat(d.amount as any) || 0 })),
      byProject: projectData.map(d => ({ ...d, amount: parseFloat(d.amount as any) || 0, name: d.name || "General" })),
      byVendor: vendorData.map(d => ({ ...d, amount: parseFloat(d.amount as any) || 0 })),
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
