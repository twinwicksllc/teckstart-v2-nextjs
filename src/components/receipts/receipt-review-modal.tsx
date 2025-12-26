"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReceiptReviewModalProps {
  expenseId: number;
  initialData: {
    merchantName?: string;
    total?: number;
    date?: string;
    category?: string;
    projectId?: number | null;
    description?: string;
  };
  onClose: () => void;
  onSave: () => void;
}

export function ReceiptReviewModal({ expenseId, initialData, onClose, onSave }: ReceiptReviewModalProps) {
  const [formData, setFormData] = useState({
    vendor: initialData.merchantName || "",
    amount: initialData.total?.toString() || "",
    expenseDate: initialData.date || new Date().toISOString().split("T")[0],
    description: initialData.description || "",
    projectId: initialData.projectId?.toString() || "",
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    const fetchReceiptUrl = async () => {
      try {
        const response = await fetch(`/api/expenses/${expenseId}/receipt`);
        if (response.ok) {
          const data = await response.json();
          setReceiptUrl(data.url);
        }
      } catch (err) {
        console.error("Failed to fetch receipt URL:", err);
      }
    };

    fetchProjects();
    fetchReceiptUrl();
  }, [expenseId]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          projectId: formData.projectId || null,
        }),
      });

      if (response.ok) {
        onSave();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save changes");
      }
    } catch (err) {
      setError("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full ${receiptUrl ? 'max-w-4xl' : 'max-w-lg'} bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col`}>
        <CardHeader>
          <CardTitle>Review Captured Data</CardTitle>
          <p className="text-sm text-gray-500">
            AI has extracted the following details. Please verify and assign a project if applicable.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className={`grid grid-cols-1 ${receiptUrl ? 'md:grid-cols-2' : ''} gap-6`}>
            {/* Form Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Merchant</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project (Optional)</Label>
                  <select
                    id="project"
                    className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  >
                    <option value="">General Business Expense</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What was this for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Receipt Image Column */}
            {receiptUrl && (
              <div className="border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center min-h-[300px]">
                {receiptUrl.toLowerCase().includes('.pdf') ? (
                  <iframe 
                    src={receiptUrl} 
                    className="w-full h-full min-h-[400px]"
                    title="Receipt PDF"
                  />
                ) : (
                  <img 
                    src={receiptUrl} 
                    alt="Receipt" 
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Confirm & Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
