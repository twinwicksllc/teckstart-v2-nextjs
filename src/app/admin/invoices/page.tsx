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

export default function AdminInvoicesPage() {
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
      if (!response.ok) {
        throw new Error('API response not ok');
      }
      const data = await response.json();
      if (data.error && data.error.includes('Database not configured')) {
        setIsConfigured(false);
        setInvoices([]);
      } else {
        setInvoices(data.invoices || []);
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
      setIsConfigured(false);
      setInvoices([]); // Set empty array to prevent undefined errors
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadInvoices();
  }, []);
  
  // Add new item
  const addItem = () => {
    setItems([...items, { description: '', amount: 0, quantity: 1 }]);
  };
  
  // Remove item
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  // Update item
  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  
  // Calculate total
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount * item.quantity, 0);
  };
  
  // Create invoice
  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!customerEmail || !customerEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    for (const item of items) {
      if (!item.description || item.amount <= 0 || item.quantity <= 0) {
        toast.error('Please fill in all item fields with valid values');
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail,
          items,
          currencyCode,
          notes,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create invoice');
      }
      
      const data = await response.json();
      
      toast.success('Invoice created successfully!');
      setIsCreateDialogOpen(false);
      
      // Reset form
      setCustomerEmail('');
      setItems([{ description: '', amount: 0, quantity: 1 }]);
      setNotes('');
      
      // Reload invoices
      await loadInvoices();
      
      // Copy checkout URL to clipboard
      if (data.invoice.checkoutUrl) {
        await navigator.clipboard.writeText(data.invoice.checkoutUrl);
        toast.success('Checkout link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Copy checkout URL
  const copyCheckoutUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success('Checkout link copied to clipboard!');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Format currency
  const formatCurrency = (amount: string, code: string) => {
    const parsedAmount = parseFloat(amount || '0');
    if (isNaN(parsedAmount)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code || 'USD',
      }).format(0);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code || 'USD',
    }).format(parsedAmount);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading invoices...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Invoice Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage invoices for your customers</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>
                Create a new invoice and generate a checkout link for payment
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createInvoice} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Customer Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <Label>Invoice Items *</Label>
                {items?.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-24 space-y-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        step="0.01"
                        value={item.amount || ''}
                        onChange={(e) => updateItem(index, 'amount', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div className="w-20 space-y-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  placeholder="USD"
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())}
                  maxLength={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or terms..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal().toString(), currencyCode)}</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Invoice'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            {isConfigured ? 
              `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''} total` : 
              'Database not configured'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConfigured ? (
            <div className="text-center py-12">
              <div className="mb-4">
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