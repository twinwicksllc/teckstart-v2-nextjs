import { Paddle, Environment } from '@paddle/paddle-node-sdk';

// Initialize Paddle with sandbox environment
const paddle = new Paddle(process.env.PADDLE_API_KEY || '', {
  environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as Environment,
});

// Paddle environment types
export type PaddleEnvironment = 'sandbox' | 'production';

// Customer interface
export interface PaddleCustomer {
  id?: string;
  email: string;
  name: string;
  address?: {
    countryCode: string;
    region?: string;
    city?: string;
    postalCode?: string;
    line1?: string;
    line2?: string;
  };
}

// Invoice item interface
export interface PaddleInvoiceItem {
  description: string;
  amount: number;
  quantity: number;
  taxRate?: string;
}

// Invoice interface
export interface PaddleInvoice {
  id?: string;
  customerId?: string;
  customer: PaddleCustomer;
  items: PaddleInvoiceItem[];
  currencyCode: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
  invoiceNumber?: string;
  dueDate?: Date;
  notes?: string;
  createdAt?: Date;
  paidAt?: Date;
  checkoutUrl?: string;
}

// Payment interface
export interface PaddlePayment {
  id: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  currencyCode: string;
  status: 'created' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  paidAt?: Date;
  receiptUrl?: string;
}

// Get Paddle instance
export function getPaddle() {
  return paddle;
}

// Validate Paddle API key
export function isPaddleConfigured(): boolean {
  return !!(process.env.PADDLE_API_KEY);
}

export default paddle;