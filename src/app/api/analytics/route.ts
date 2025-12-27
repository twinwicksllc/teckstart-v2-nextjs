import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { expenses, projects, expenseCategories, incomes } from "@/drizzle.schema";
import { eq, and, gte, lte, sql, SQL } from "drizzle-orm";

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

    // Build expense where clause
    let expenseWhereClause: SQL | undefined = eq(expenses.userId, user.id);
    if (projectId) {
      expenseWhereClause = and(expenseWhereClause, eq(expenses.projectId, parseInt(projectId)));
    }
    if (categoryId) {
      expenseWhereClause = and(expenseWhereClause, eq(expenses.categoryId, parseInt(categoryId)));
    }
    if (startDate) {
      expenseWhereClause = and(expenseWhereClause, gte(expenses.expenseDate, new Date(startDate)));
    }
    if (endDate) {
      expenseWhereClause = and(expenseWhereClause, lte(expenses.expenseDate, new Date(endDate)));
    }

    // Build income where clause
    let incomeWhereClause: SQL | undefined = eq(incomes.userId, user.id);
    if (projectId) {
      incomeWhereClause = and(incomeWhereClause, eq(incomes.projectId, parseInt(projectId)));
    }
    if (startDate) {
      incomeWhereClause = and(incomeWhereClause, gte(incomes.incomeDate, new Date(startDate)));
    }
    if (endDate) {
      incomeWhereClause = and(incomeWhereClause, lte(incomes.incomeDate, new Date(endDate)));
    }

    // 1. Spending by Category
    const categoryData = await db
      .select({
        name: expenseCategories.name,
        value: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.id))
      .where(expenseWhereClause)
      .groupBy(expenseCategories.name);

    // 2. Spending over Time (Monthly)
    const monthlyExpenseData = await db
      .select({
        month: sql<string>`to_char(${expenses.expenseDate}, 'YYYY-MM')`,
        amount: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .where(expenseWhereClause)
      .groupBy(sql`to_char(${expenses.expenseDate}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${expenses.expenseDate}, 'YYYY-MM')`);

    // 2b. Income over Time (Monthly)
    const monthlyIncomeData = await db
      .select({
        month: sql<string>`to_char(${incomes.incomeDate}, 'YYYY-MM')`,
        amount: sql<number>`sum(${incomes.amount})`,
      })
      .from(incomes)
      .where(incomeWhereClause)
      .groupBy(sql`to_char(${incomes.incomeDate}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${incomes.incomeDate}, 'YYYY-MM')`);

    // Merge monthly data (expenses + income + profit)
    const monthlyMap = new Map<string, { month: string; expenses: number; income: number; profit: number }>();
    
    for (const row of monthlyExpenseData) {
      const month = row.month;
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { month, expenses: 0, income: 0, profit: 0 });
      }
      monthlyMap.get(month)!.expenses = parseFloat(String(row.amount)) || 0;
    }
    
    for (const row of monthlyIncomeData) {
      const month = row.month;
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { month, expenses: 0, income: 0, profit: 0 });
      }
      monthlyMap.get(month)!.income = parseFloat(String(row.amount)) || 0;
    }

    // Calculate profit for each month
    for (const entry of Array.from(monthlyMap.values())) {
      entry.profit = entry.income - entry.expenses;
    }

    const monthlyData = Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));

    // 3. Spending by Project
    const projectData = await db
      .select({
        name: projects.name,
        amount: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .leftJoin(projects, eq(expenses.projectId, projects.id))
      .where(expenseWhereClause)
      .groupBy(projects.name);

    // 4. Vendor Breakdown (Top 5)
    const vendorData = await db
      .select({
        name: expenses.vendor,
        amount: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .where(expenseWhereClause)
      .groupBy(expenses.vendor)
      .orderBy(sql`sum(${expenses.amount}) desc`)
      .limit(5);

    // 5. Total summaries
    const totalExpenseResult = await db
      .select({ total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)` })
      .from(expenses)
      .where(expenseWhereClause);
    const totalExpenses = parseFloat(totalExpenseResult[0]?.total || "0");

    const totalIncomeResult = await db
      .select({ total: sql<string>`COALESCE(SUM(${incomes.amount}), 0)` })
      .from(incomes)
      .where(incomeWhereClause);
    const totalIncome = parseFloat(totalIncomeResult[0]?.total || "0");

    const netProfit = totalIncome - totalExpenses;

    return NextResponse.json({
      byCategory: categoryData.map(d => ({ ...d, value: parseFloat(String(d.value)) || 0, name: d.name || "Uncategorized" })),
      monthly: monthlyData,
      byProject: projectData.map(d => ({ ...d, amount: parseFloat(String(d.amount)) || 0, name: d.name || "General" })),
      byVendor: vendorData.map(d => ({ ...d, amount: parseFloat(String(d.amount)) || 0 })),
      summary: {
        totalExpenses,
        totalIncome,
        netProfit,
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
