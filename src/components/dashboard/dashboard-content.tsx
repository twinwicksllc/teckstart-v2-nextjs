// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
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

export function DashboardContent({ user }: DashboardContentProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, expensesRes, incomesRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/expenses"),
        fetch("/api/incomes")
      ]);

      if (projectsRes.ok && expensesRes.ok) {
        const projectsData = await projectsRes.json();
        const expensesData = await expensesRes.json();
        const incomesData = incomesRes.ok ? await incomesRes.json() : [];
        
        setProjects(projectsData);
        setExpenses(expensesData);
        setIncomes(incomesData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const currentYear = new Date().getFullYear();
  
  const currentYearExpenses = expenses.filter(e => 
    new Date(e.expenseDate).getFullYear() === currentYear
  );
  
  const currentYearIncomes = incomes.filter(i => 
    new Date(i.incomeDate).getFullYear() === currentYear
  );

  const totalDeductions = currentYearExpenses
    .filter(e => e.isDeductible)
    .reduce((sum, e) => sum + parseFloat(e.amount || "0"), 0);

  // Calculate total income and net profit
  const totalExpenseAmount = currentYearExpenses.reduce((sum, e) => sum + parseFloat(e.amount || "0"), 0);
  const totalIncomeAmount = currentYearIncomes.reduce((sum, i) => sum + parseFloat(i.amount || "0"), 0);
  const netProfit = totalIncomeAmount - totalExpenseAmount;

  // Prepare chart data for dashboard (last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toISOString().split("-").slice(0, 2).join("-");
  }).reverse();

  const chartData = last6Months.map(month => {
    const monthExpenses = expenses.filter(e => 
      new Date(e.expenseDate).toISOString().startsWith(month)
    );
    const monthIncomes = incomes.filter(i => 
      new Date(i.incomeDate).toISOString().startsWith(month)
    );
    const expenseTotal = monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount || "0"), 0);
    const incomeTotal = monthIncomes.reduce((sum, i) => sum + parseFloat(i.amount || "0"), 0);
    return {
      name: new Date(month + "-01").toLocaleString('default', { month: 'short' }),
      expenses: expenseTotal,
      income: incomeTotal,
      profit: incomeTotal - expenseTotal
    };
  });

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
                ${totalIncomeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentYearIncomes.length} payments ({currentYear})
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/expenses"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentYearExpenses.length} expenses ({currentYear})
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/analytics"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netProfit >= 0 ? '' : '-'}${Math.abs(netProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {netProfit >= 0 ? 'Profit' : 'Loss'} ({currentYear})
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/analytics"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tax Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `$${Number(value).toFixed(2)}`,
                        name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Profit'
                      ]}
                    />
                    <Legend />
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
                    {projects.slice(0, 5).map((project: Project) => (
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
                    {expenses.slice(0, 5).map((expense: Expense) => (
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