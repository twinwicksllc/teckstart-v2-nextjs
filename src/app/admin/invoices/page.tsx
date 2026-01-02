'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Copy, Check, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { getServerSession } from '@/lib/auth';

interface InvoiceItem {
  description: string;
  amount: number;
  quantity: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  customerEmail: string;
  amount: string;
  totalAmount: string;
  currencyCode: string;
  status: string;
  notes?: string;
  checkoutUrl?: string;
  createdAt: string;
  items: InvoiceItem[];
}

interface User {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AdminInvoicesContentProps {
  user: User;
}

function AdminInvoicesContent({ user }: AdminInvoicesContentProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true); // Track if database is configured
  
  // Form state
  const [customerEmail, setCustomerEmail] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', amount: 0, quantity: 1 }
  ]);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load invoices
  const loadInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices || []);
        setIsConfigured(true);
      } else {
        // Check if it's a configuration error
        const errorData = await response.json();
        if (response.status === 500 && errorData.error?.includes('DATABASE_URL')) {
          setIsConfigured(false);
        }
      }
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // Add item
  const addItem = () => {
    setItems([...items, { description: '', amount: 0, quantity: 1 }]);
  };

  // Remove item
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Update item
  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Create invoice
  const createInvoice = async () => {
    // Validation
    if (!customerEmail) {
      toast.error('Customer email is required');
      return;
    }

    if (items.some(item => !item.description || item.amount <= 0)) {
      toast.error('All items must have a description and positive amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail,
          items: items.map(item => ({
            ...item,
            amount: item.amount.toString()
          })),
          currencyCode,
          notes,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Invoice created successfully!');
        setIsCreateDialogOpen(false);
        
        // Reset form
        setCustomerEmail('');
        setItems([{ description: '', amount: 0, quantity: 1 }]);
        setNotes('');
        
        // Reload invoices
        loadInvoices();

        // If checkout URL was created, copy it
        if (result.checkoutUrl) {
          copyCheckoutUrl(result.checkoutUrl);
          toast.success('Checkout link copied to clipboard!');
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy checkout URL
  const copyCheckoutUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Checkout link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy URL');
    }
  };

  // Format currency
  const formatCurrency = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(num);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Invoice Management</h1>
          <p className="text-gray-600">Create and manage customer invoices</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>
                Create a new invoice for your customer
              </DialogDescription>
            </DialogHeader>

            {isConfigured ? (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerEmail">Customer Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Invoice Items *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <Label htmlFor={`description-${index}`}>Description</Label>
                          <Input
                            id={`description-${index}`}
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Service description"
                            required
                          />
                        </div>
                        <div className="w-32">
                          <Label htmlFor={`amount-${index}`}>Amount</Label>
                          <Input
                            id={`amount-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.amount || ''}
                            onChange={(e) => updateItem(index, 'amount', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div className="w-24">
                          <Label htmlFor={`quantity-${index}`}>Qty</Label>
                          <Input
                            id={`quantity-${index}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <Label htmlFor="currencyCode">Currency</Label>
                  <select
                    id="currencyCode"
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes for the customer"
                    rows={3}
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={createInvoice}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Invoice'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Database Configuration Required</h3>
                  <p className="text-muted-foreground mb-4">
                    The invoice system requires a database connection to work properly.
                  </p>
                  <div className="bg-muted p-4 rounded-lg text-left max-w-md mx-auto">
                    <h4 className="font-medium mb-2">To set up the database:</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Create a <code className="bg-background px-1 rounded">.env.local</code> file</li>
                      <li>Add your <code className="bg-background px-1 rounded">DATABASE_URL</code></li>
                      <li>Run: <code className="bg-background px-1 rounded">npx tsx scripts/migrate.ts</code></li>
                      <li>Restart the development server</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            Manage your customer invoices and track payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No invoices yet. Create your first invoice to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices?.map((invoice) => (
                    <TableRow key={invoice?.id || Math.random()}>
                      <TableCell className="font-medium">{invoice?.invoiceNumber || 'N/A'}</TableCell>
                      <TableCell>{invoice?.customerEmail || 'N/A'}</TableCell>
                      <TableCell>{formatCurrency(invoice?.totalAmount || '0', invoice?.currencyCode || 'USD')}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {(invoice?.status || 'unknown').charAt(0).toUpperCase() + (invoice?.status || 'unknown').slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(invoice?.createdAt || new Date().toISOString())}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {invoice?.checkoutUrl && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(invoice.checkoutUrl, '_blank')}
                                title="Open checkout link"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyCheckoutUrl(invoice.checkoutUrl!)}
                                title="Copy checkout link"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main page component with user authentication
export default function AdminInvoicesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user session on client side
    const checkAuth = async () => {
      try {
        // We'll need to create an API endpoint to get the current user
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Redirect to login if not authenticated
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <DashboardLayout user={user}>
      <AdminInvoicesContent user={user} />
    </DashboardLayout>
  );
}