"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReceiptReviewModal } from "@/components/receipts/receipt-review-modal";
import { Expense, User } from "@/drizzle.schema";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

interface ExpenseWithDetails extends Expense {
  projectName?: string | null;
  categoryName?: string | null;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseWithDetails[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<ExpenseWithDetails | null>(null);

  useEffect(() => {
    fetchExpenses();
    fetchUser();
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

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses");
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (response.ok) {
        setExpenses(expenses.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={user} />
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
            <Link href="/expenses/new">
              <Button>Add Expense</Button>
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {expenses.length === 0 ? (
                <li className="px-6 py-12 text-center">
                  <p className="text-gray-500 mb-4">No expenses found.</p>
                  <Link href="/expenses/new">
                    <Button>Add Your First Expense</Button>
                </Link>
              </li>
            ) : (
              expenses.map((expense) => (
                <li key={expense.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {expense.vendor}
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-gray-500">
                            {expense.projectName ? `Project: ${expense.projectName}` : "General Business Expense"}
                          </p>
                          <span className="text-gray-300">•</span>
                          <p className="text-xs font-medium text-purple-600">
                            {expense.categoryName || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          ${expense.amount}
                        </p>
                        <div className="flex space-x-2">
                          {expense.receiptFileKey && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/expenses/${expense.id}/receipt`);
                                  const data = await res.json();
                                  if (data.url) window.open(data.url, '_blank');
                                } catch (err) {
                                  console.error("Failed to open receipt:", err);
                                }
                              }}
                            >
                              View Receipt
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingExpense(expense)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(expense.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {expense.description || "No description"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {new Date(expense.expenseDate).toLocaleDateString()}
                        </p>
                        {expense.aiParsed && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            AI Parsed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

        {editingExpense && (
          <ReceiptReviewModal
            expenseId={editingExpense.id}
            initialData={{
              merchantName: editingExpense.vendor,
              total: parseFloat(editingExpense.amount),
              date: new Date(editingExpense.expenseDate).toISOString().split("T")[0],
              description: editingExpense.description || undefined,
              projectId: editingExpense.projectId,
            }}
            onClose={() => setEditingExpense(null)}
            onSave={() => {
              setEditingExpense(null);
              fetchExpenses();
            }}
          />
        )}
      </div>
    </div>
  );
}
