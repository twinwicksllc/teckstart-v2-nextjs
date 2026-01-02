import { NextRequest, NextResponse } from 'next/server';
import { getInvoice, generateReceipt } from '@/lib/paddle-api';
import { db } from '@/lib/db';
import { paddlePayments } from '@/drizzle.schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/invoices/[id]
 * Get invoice details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = parseInt(params.id);
    
    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }
    
    const invoice = await getInvoice(invoiceId);
    
    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }
    
    // Get payments for this invoice
    const payments = await db.select()
      .from(paddlePayments)
      .where(eq(paddlePayments.invoiceId, invoiceId));
    
    return NextResponse.json({
      invoice,
      payments,
    });
  } catch (error) {
    console.error('Error getting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to get invoice' },
      { status: 500 }
    );
  }
}