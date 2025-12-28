"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReceiptUploadForm } from "@/components/receipts/receipt-upload-form";
import { Navbar } from "@/components/navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Project, Expense, Income } from "@/drizzle.schema";

interface User {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface DashboardContentProps {
  user: User;
}

interface ChartData {
  name: string;
  expenses: number;
  income: number;
  profit: number;
}

interface DashboardStats {
  currentYearExpenses: Expense[];
  currentYearIncomes: Income[];
  totalDeductions: number;
  totalExpenseAmount: number;
  totalIncomeAmount: number;
  netProfit: number;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [projectsRes, expensesRes, incomesRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/expenses"),
        fetch("/api/incomes")
      ]);

      if (projectsRes.ok && expensesRes.ok) {
        const projectsData: Project[] = await projectsRes.json();
        const expensesData: Expense[] = await expensesRes.json();
        const incomesData: Income[] = incomesRes.ok ? await incomesRes.json() : [];
        
        setProjects(projectsData);
        setExpenses(expensesData);
        setIncomes(incomesData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calculate stats with useMemo to prevent recalculations
  const stats = useMemo((): DashboardStats => {
    const currentYear = new Date().getFullYear();
    
    const currentYearExpenses = expenses.filter(e => 
      new Date(e.expenseDate).getFullYear() === currentYear
    );
    
    const currentYearIncomes = incomes.filter(i => 
      new Date(i.incomeDate).getFullYear() === currentYear
    );

    const totalDeductions = currentYearExpenses
      .filter(e => e.isDeductible)
      .reduce((sum: number, e: Expense) => sum + parseFloat(e.amount || "0"), 0);

    const totalExpenseAmount = currentYearExpenses.reduce((sum: number, e: Expense) => sum + parseFloat(e.amount || "0"), 0);
    const totalIncomeAmount = currentYearIncomes.reduce((sum: number, i: Income) => sum + parseFloat(i.amount || "0"), 0);
    const netProfit = totalIncomeAmount - totalExpenseAmount;

    return {
      currentYearExpenses,
      currentYearIncomes,
      totalDeductions,
      totalExpenseAmount,
      totalIncomeAmount,
      netProfit
    };
  }, [expenses, incomes]);

  // Prepare chart data with useMemo
  const chartData = useMemo((): ChartData[] => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return { year, month, monthNum: d.getMonth() };
    });

    return last6Months.map(({ year, month, monthNum }) => {
      const monthStr = `${year}-${month}`;
      const monthExpenses = stats.currentYearExpenses.filter(e => {
        const expenseMonth = new Date(e.expenseDate).toISOString().split("-").slice(0, 2).join("-");
        return expenseMonth === monthStr;
      });
      const monthIncomes = stats.currentYearIncomes.filter(i => {
        const incomeMonth = new Date(i.incomeDate).toISOString().split("-").slice(0, 2).join("-");
        return incomeMonth === monthStr;
      });
      const expenseTotal = monthExpenses.reduce((sum: number, e: Expense) => sum + parseFloat(e.amount || "0"), 0);
      const incomeTotal = monthIncomes.reduce((sum: number, i: Income) => sum + parseFloat(i.amount || "0"), 0);
      const monthName = new Date(year, monthNum, 1).toLocaleString('default', { month: 'short' });
      return {
        name: monthName,
        expenses: expenseTotal,
        income: incomeTotal,
        profit: incomeTotal - expenseTotal
      };
    });
  }, [stats.currentYearExpenses, stats.currentYearIncomes]);

  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/projects"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                Active projects
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/analytics"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${stats.totalIncomeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.currentYearIncomes.length} payments ({currentYear})
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/expenses"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${stats.totalExpenseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.currentYearExpenses.length} expenses ({currentYear})
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/analytics"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.netProfit >= 0 ? '' : '-'}${Math.abs(stats.netProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.netProfit >= 0 ? 'Profit' : 'Loss'} ({currentYear})
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/analytics"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tax Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">
                Potential savings ({currentYear})
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Upload Receipt</CardTitle>
              <CardDescription>
                AI-powered receipt parsing with Claude
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReceiptUploadForm />
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-8">
            <Card className="cursor-pointer hover:shadow-sm transition-shadow" onClick={() => window.location.href = "/analytics"}>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Your financial overview for the last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-50">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number | string, name: string) => {
                        const label = name === 'income' || name === 'Income'
                          ? 'Income'
                          : name === 'expenses' || name === 'Expenses'
                          ? 'Expenses'
                          : 'Profit';
                        return [`$${Number(value || 0).toFixed(2)}`, label];
                      }}
                    />
                    <Legend
                      formatter={(value: string) => {
                        if (value === 'income' || value === 'Income') return 'Income';
                        if (value === 'expenses' || value === 'Expenses') return 'Expenses';
                        return value;
                      }}
                    />
                    <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>
                    Your latest freelance projects
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = "/projects"}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No projects yet</p>
                    <Button onClick={() => window.location.href = "/projects/new"}>
                      Create Your First Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = "/projects"}>
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-gray-500">{project.clientName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${project.budget || 0}</p>
                          <p className="text-sm text-gray-500">{project.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Expenses</CardTitle>
                  <CardDescription>
                    Your latest expense entries
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = "/expenses"}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No expenses yet</p>
                    <Button onClick={() => window.location.href = "/expenses/new"}>
                      Add Your First Expense
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.slice(0, 5).map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = "/expenses"}>
                        <div>
                          <h3 className="font-medium">{expense.vendor}</h3>
                          <p className="text-sm text-gray-500">{expense.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${expense.amount}</p>
                          <p className="text-sm text-gray-500">{new Date(expense.expenseDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}