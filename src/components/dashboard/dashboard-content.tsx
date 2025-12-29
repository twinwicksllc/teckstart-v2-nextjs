"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReceiptUploadForm } from "@/components/receipts/receipt-upload-form";
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
import { TrendingUp, TrendingDown, Search } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search to improve performance
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const fetchDashboardData = useCallback(async () => {
    let isMounted = true;
    try {
      const [projectsRes, expensesRes, incomesRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/expenses"),
        fetch("/api/incomes")
      ]);

      if (isMounted && projectsRes.ok && expensesRes.ok) {
        const projectsData: Project[] = await projectsRes.json();
        const expensesData: Expense[] = await expensesRes.json();
        const incomesData: Income[] = incomesRes.ok ? await incomesRes.json() : [];
        
        setProjects(projectsData);
        setExpenses(expensesData);
        setIncomes(incomesData);
      }
    } catch (error) {
      if (isMounted) console.error("Failed to fetch dashboard data:", error);
    } finally {
      if (isMounted) setLoading(false);
    }
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const cleanup = fetchDashboardData();
    return () => {
      cleanup.then(fn => fn && fn());
    };
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

  // Memoize filtered data for better performance
  const filteredExpenses = useMemo(() => {
    if (!debouncedQuery) return stats.currentYearExpenses;
    const query = debouncedQuery.toLowerCase();
    return stats.currentYearExpenses.filter(e => 
      e.vendor?.toLowerCase().includes(query) ||
      e.description?.toLowerCase().includes(query) ||
      e.amount?.toString().includes(query)
    );
  }, [stats.currentYearExpenses, debouncedQuery]);

  const filteredProjects = useMemo(() => {
    if (!debouncedQuery) return projects;
    const query = debouncedQuery.toLowerCase();
    return projects.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  }, [projects, debouncedQuery]);

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

  // Filter expenses and projects based on search query
  const filteredExpenses = useMemo(() => {
    if (!searchQuery.trim()) return expenses;
    const query = searchQuery.toLowerCase();
    return expenses.filter(
      (expense) =>
        (expense.vendor?.toLowerCase().includes(query) || false) ||
        (expense.description?.toLowerCase().includes(query) || false)
    );
  }, [expenses, searchQuery]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        (project.name?.toLowerCase().includes(query) || false) ||
        (project.clientName?.toLowerCase().includes(query) || false)
    );
  }, [projects, searchQuery]);

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
    <div className="min-h-screen" style={{ backgroundColor: "var(--background, #ededf4)" }}>
      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="h-16 border-b bg-white px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Income Card - Orange/Yellow */}
            <div
              className="rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
              style={{ backgroundColor: "#FEB33C", color: "#000000" }}
              onClick={() => (window.location.href = "/analytics")}
            >
              <div className="text-sm font-medium mb-2">Total Income</div>
              <div className="text-3xl font-bold mb-1">
                ${stats.totalIncomeAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-xs opacity-80 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stats.currentYearIncomes.length} payments ({currentYear})
              </div>
            </div>

            {/* Total Expenses Card - Cherry Rose */}
            <div
              className="rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
              style={{ backgroundColor: "#AF1B3F", color: "#FFFFFF" }}
              onClick={() => (window.location.href = "/expenses")}
            >
              <div className="text-sm font-medium mb-2">Total Expenses</div>
              <div className="text-3xl font-bold mb-1">
                ${stats.totalExpenseAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-xs opacity-90 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                {stats.currentYearExpenses.length} expenses ({currentYear})
              </div>
            </div>

            {/* Net Profit Card - Medium Jungle */}
            <div
              className="rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: stats.netProfit >= 0 ? "#3A9D3D" : "#AF1B3F",
                color: "#FFFFFF",
              }}
              onClick={() => (window.location.href = "/analytics")}
            >
              <div className="text-sm font-medium mb-2">Net Profit</div>
              <div className="text-3xl font-bold mb-1">
                {stats.netProfit >= 0 ? "" : "-"}$
                {Math.abs(stats.netProfit).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-xs opacity-90">
                {stats.netProfit >= 0 ? "Profit" : "Loss"} ({currentYear})
              </div>
            </div>

            {/* Tax Deductions Card - Celadon */}
            <div
              className="rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: "#A8DCA8",
                color: "#1f2937",
              }}
              onClick={() => (window.location.href = "/analytics")}
            >
              <div className="text-sm font-medium mb-2">Tax Deductions</div>
              <div className="text-3xl font-bold mb-1">
                ${stats.totalDeductions.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-xs opacity-90">Potential savings ({currentYear})</div>
            </div>
          </div>

          {/* Charts and Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Income vs Expenses Chart - Takes 2 columns */}
            <Card
              className="lg:col-span-2 cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => (window.location.href = "/analytics")}
            >
              <CardHeader>
                <CardTitle>Income vs Expenses Trend</CardTitle>
                <CardDescription>Your financial overview for the last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
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

            {/* Upload Receipt Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Receipt</CardTitle>
                <CardDescription>AI-powered receipt parsing</CardDescription>
              </CardHeader>
              <CardContent>
                <ReceiptUploadForm />
              </CardContent>
            </Card>
          </div>

          {/* Recent Items Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Recent Expenses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Expenses</CardTitle>
                  <CardDescription>Your latest expense entries</CardDescription>
                </div>
                <button className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => (window.location.href = "/expenses")}>
                  View All
                </button>
              </CardHeader>
              <CardContent>
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">{searchQuery ? "No matching expenses found" : "No expenses yet"}</p>
                    {!searchQuery && (
                      <Button onClick={() => (window.location.href = "/expenses/new")}>
                        Add Your First Expense
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredExpenses.slice(0, 5).map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => (window.location.href = "/expenses")}>
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

            {/* Recent Projects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Your latest freelance projects</CardDescription>
                </div>
                <button className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => (window.location.href = "/projects")}>
                  View All
                </button>
              </CardHeader>
              <CardContent>
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">{searchQuery ? "No matching projects found" : "No projects yet"}</p>
                    {!searchQuery && (
                      <Button onClick={() => (window.location.href = "/projects/new")}>
                        Create Your First Project
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProjects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => (window.location.href = "/projects")}>
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
          </div>
        </div>
      </div>
    </div>
  );
}