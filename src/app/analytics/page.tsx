"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface AnalyticsData {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
  };
  totalDeductible: number;
  monthly: Array<{
    month: string;
    income: number;
    expenses: number;
    profit: number;
  }>;
  byCategory: Array<{
    name: string;
    value: number;
  }>;
  byProject: Array<{
    name: string;
    value: number;
  }>;
}

interface Category {
  id: string;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  name: string;
}

interface FilterState {
  projectId: string;
  categoryId: string;
  vendor: string;
  startDate: string;
  endDate: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    projectId: "",
    categoryId: "",
    vendor: "",
    startDate: "",
    endDate: "",
  });
  const [vendorOptions, setVendorOptions] = useState<string[]>([]);

  useEffect(() => {
    const initPage = async () => {
      await Promise.all([fetchFilters(), fetchAnalytics(), fetchUser()]);
    };
    initPage();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/verify");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchFilters = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/expenses/categories"),
      ]);
      if (pRes.ok) setProjects(await pRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    } catch (err) {
      console.error("Failed to fetch filters:", err);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.projectId) params.append("projectId", filters.projectId);
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.vendor) params.append("vendor", filters.vendor);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await fetch(`/api/analytics?${params.toString()}`);
      if (response.ok) {
        const json = await response.json();
        setData(json);
        if (json.vendorOptions) {
          setVendorOptions(json.vendorOptions);
        }
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFilters = async () => {
    await fetchAnalytics();
  };

  const resetFilters = async () => {
    setFilters({
      projectId: "",
      categoryId: "",
      vendor: "",
      startDate: "",
      endDate: "",
    });
    await fetchAnalytics();
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Insights & Analytics</h1>
        </div>
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Project</Label>
                <select
                  name="projectId"
                  className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                  value={filters.projectId}
                  onChange={handleFilterChange}
                >
                  <option value="">All Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  name="categoryId"
                  className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                  value={filters.categoryId}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Vendor</Label>
                <select
                  name="vendor"
                  className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                  value={filters.vendor}
                  onChange={handleFilterChange}
                >
                  <option value="">All Vendors</option>
                  {vendorOptions.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <input
                  type="date"
                  name="startDate"
                  className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <input
                  type="date"
                  name="endDate"
                  className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="flex items-end space-x-2">
                <Button onClick={applyFilters} className="flex-1">Apply</Button>
                <Button variant="outline" onClick={resetFilters}>Reset</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {data && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${(data.summary?.totalIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    ${(data.summary?.totalExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${(data.summary?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(data.summary?.netProfit || 0) >= 0 ? '' : '-'}${Math.abs(data.summary?.netProfit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Tax Deductions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ${(data.totalDeductible || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Income vs Expenses Trend */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Income vs Expenses Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `$${Number(value).toFixed(2)}`,
                          name
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="income" fill="#22c55e" name="Income" />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Profit/Loss Trend */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Profit/Loss</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [
                          `${Number(value) >= 0 ? '' : '-'}$${Math.abs(Number(value)).toFixed(2)}`,
                          'Profit/Loss'
                        ]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                        name="Profit/Loss ($)" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Spending by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.byCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.byCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Spending by Project */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Project</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.byProject}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#82ca9d" name="Total Spent ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Vendors */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Top 5 Vendors</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.byVendor} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#FF8042" name="Total Spent ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
