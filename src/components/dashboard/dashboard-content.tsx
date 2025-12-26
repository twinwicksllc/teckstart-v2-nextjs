"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  ResponsiveContainer,
} from "recharts";

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
  const [projects, setProjects] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, expensesRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/expenses")
      ]);

      if (projectsRes.ok && expensesRes.ok) {
        const projectsData = await projectsRes.json();
        const expensesData = await expensesRes.json();
        
        setProjects(projectsData);
        setExpenses(expensesData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalDeductions = expenses
    .filter(e => e.isDeductible)
    .reduce((sum, e) => sum + parseFloat(e.amount || "0"), 0);

  const aiProcessedCount = expenses.filter(e => e.aiParsed).length;

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
    return {
      name: new Date(month + "-01").toLocaleString('default', { month: 'short' }),
      amount: monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount || "0"), 0)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/expenses"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expenses.length}</div>
              <p className="text-xs text-muted-foreground">
                This month
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
                Potential savings
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/analytics"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receipts Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aiProcessedCount}</div>
              <p className="text-xs text-muted-foreground">
                AI-processed
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
                <CardTitle>Monthly Spending Trend</CardTitle>
                <CardDescription>Your expenses over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
                    {projects.slice(0, 5).map((project: any) => (
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
                    {expenses.slice(0, 5).map((expense: any) => (
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