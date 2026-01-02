import { NextRequest, NextResponse } from 'next/server';
import { createDraftInvoice, createCheckoutLink, getAllInvoices } from '@/lib/paddle-api';
import { PaddleInvoiceItem } from '@/lib/paddle';

/**
 * GET /api/invoices
 * Get all invoices (admin only)
 */
export async function GET() {
  try {
    const invoices = await getAllInvoices();
    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Error getting invoices:', error);
    // Return empty array if database is not configured instead of error
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      return NextResponse.json({ invoices: [] });
    }
    return NextResponse.json(
      { error: 'Failed to get invoices' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invoices
 * Create a new invoice (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, items, currencyCode = 'USD', notes } = body;
    
    // Validate input
    if (!customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: customerEmail and items are required' },
        { status: 400 }
      );
    }
    
    // Validate items
    for (const item of items) {
      if (!item.description || typeof item.amount !== 'number' || typeof item.quantity !== 'number') {
        return NextResponse.json(
          { error: 'Invalid item: each item must have description, amount, and quantity' },
          { status: 400 }
        );
      }
      if (item.amount <= 0 || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Invalid item: amount and quantity must be positive' },
          { status: 400 }
        );
      }
    }
    
    // Create draft invoice
    const invoice = await createDraftInvoice(
      customerEmail,
      items as PaddleInvoiceItem[],
      currencyCode,
      notes
    );
    
    // Create checkout link
    const checkoutUrl = await createCheckoutLink(invoice.id);
    
    return NextResponse.json({
      invoice: {
        ...invoice,
        checkoutUrl,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    // Return specific error if database is not configured
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up DATABASE_URL in .env.local' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}