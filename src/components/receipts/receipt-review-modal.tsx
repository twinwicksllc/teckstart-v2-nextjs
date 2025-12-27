"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project, ExpenseCategory } from "@/drizzle.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZoomIn, ZoomOut, RotateCw, RefreshCw, ExternalLink } from "lucide-react";

interface ReceiptReviewModalProps {
  expenseId: number;
  initialData: {
    merchantName?: string;
    total?: number;
    date?: string;
    category?: string;
    categoryId?: number | null;
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
    categoryId: initialData.categoryId?.toString() || "",
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => { setZoom(1); setRotation(0); };

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

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/expenses/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          
          // If we have a category name from AI but no ID, try to match it
          if (!formData.categoryId && initialData.category) {
            const match = data.find((c: ExpenseCategory) => 
              c.name.toLowerCase() === initialData.category?.toLowerCase()
            );
            if (match) {
              setFormData(prev => ({ ...prev, categoryId: match.id.toString() }));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
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
    fetchCategories();
    fetchReceiptUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseId, initialData.category]);

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
          categoryId: formData.categoryId || null,
        }),
      });

      if (response.ok) {
        onSave();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save changes");
      }
    } catch {
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
                    name="projectId"
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
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="categoryId"
                  className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-end space-x-2 mb-2">
                  <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom <= 0.5} type="button" title="Zoom Out">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
                  <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoom >= 3} type="button" title="Zoom In">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleRotate} type="button" title="Rotate">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleReset} type="button" title="Reset">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => window.open(receiptUrl, '_blank')} type="button" title="Open in New Tab">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center min-h-[300px] relative">
                  {receiptUrl.toLowerCase().includes('.pdf') ? (
                    <iframe 
                      src={receiptUrl} 
                      className="w-full h-full min-h-[400px]"
                      title="Receipt PDF"
                    />
                  ) : (
                    <div 
                      className="transition-transform duration-200 ease-in-out flex items-center justify-center"
                      style={{ 
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={receiptUrl} 
                        alt="Receipt" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
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
