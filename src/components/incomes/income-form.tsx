"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  id: number;
  name: string;
}

interface Income {
  id: number;
  projectId: number;
  amount: string;
  description: string | null;
  incomeDate: string;
  status: "pending" | "paid";
  invoiceNumber: string | null;
  paymentMethod: string | null;
  notes: string | null;
}

interface IncomeFormProps {
  projects?: Project[];
  preSelectedProjectId?: number;
  income?: Income;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function IncomeForm({ projects: externalProjects, preSelectedProjectId, income, onSuccess, onCancel }: IncomeFormProps) {
  const [projects, setProjects] = useState<Project[]>(externalProjects || []);
  const [projectId, setProjectId] = useState(
    income?.projectId?.toString() || preSelectedProjectId?.toString() || ""
  );
  const [amount, setAmount] = useState(income?.amount || "");
  const [incomeDate, setIncomeDate] = useState(
    income?.incomeDate 
      ? new Date(income.incomeDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState(income?.description || "");
  const [status, setStatus] = useState<"pending" | "paid">(income?.status || "paid");
  const [invoiceNumber, setInvoiceNumber] = useState(income?.invoiceNumber || "");
  const [paymentMethod, setPaymentMethod] = useState(income?.paymentMethod || "");
  const [notes, setNotes] = useState(income?.notes || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isEditing = !!income;

  // Fetch projects if not provided externally
  useEffect(() => {
    if (!externalProjects || externalProjects.length === 0) {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
          setProjects(data);
        })
        .catch((err) => console.error("Failed to fetch projects:", err));
    }
  }, [externalProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = isEditing ? `/api/incomes/${income.id}` : "/api/incomes";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          amount,
          incomeDate,
          description: description || null,
          status,
          invoiceNumber: invoiceNumber || null,
          paymentMethod: paymentMethod || null,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/projects");
          router.refresh();
        }
      } else {
        const data = await response.json();
        setError(data.error || `Failed to ${isEditing ? "update" : "create"} income`);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Income" : "Record Income"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectId">Project *</Label>
            <select
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incomeDate">Date *</Label>
              <Input
                id="incomeDate"
                type="date"
                value={incomeDate}
                onChange={(e) => setIncomeDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "pending" | "paid")}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Input
                id="paymentMethod"
                placeholder="e.g. Bank Transfer, PayPal"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              placeholder="e.g. INV-001"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of the income"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Income" : "Record Income"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
