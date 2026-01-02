# Paddle Integration Setup Guide

## Overview

This guide will help you set up Paddle payment integration for TeckStart, allowing you to create invoices for customers and collect payments with automatic tax compliance.

## Prerequisites

- Paddle Sandbox Account: https://sandbox-vendors.paddle.com/signup
- Access to your TeckStart codebase
- Database access to run migrations

## Phase 1: Paddle Account Setup

### 1.1 Create Paddle Sandbox Account

1. Go to https://sandbox-vendors.paddle.com/signup
2. Sign up for a sandbox account (free)
3. Complete the onboarding process

### 1.2 Generate API Keys

1. Log in to your Paddle Sandbox Dashboard
2. Navigate to **Developer tools** > **Authentication** > **API Keys**
3. Click **Create API Key**
4. Name it "TeckStart Integration"
5. Copy the **API Key ID** and **API Key Secret**
6. Save these securely - you'll need them in the next step

### 1.3 Configure Default Settings (Optional but Recommended)

1. Go to **Settings** > **Business**
2. Set your business name, address, and tax ID
3. Configure default payment methods
4. Set up your branding (logo, colors) for checkout pages

## Phase 2: Environment Configuration

### 2.1 Add Paddle API Key to Environment Variables

1. Copy the API Key Secret from Phase 1.2
2. Add it to your `.env.local` file:

```bash
# Paddle Configuration
PADDLE_API_KEY=paddle_live_1234567890abcdef1234567890abcdef
NODE_ENV=development
```

**Note:** Use your actual API Key Secret from Paddle, not the placeholder above.

### 2.2 Verify Environment Variables

Make sure your `.env.local` file exists and contains:
```bash
DATABASE_URL=your_neon_database_url
PADDLE_API_KEY=your_paddle_api_key
NODE_ENV=development
```

## Phase 3: Database Migration

### 3.1 Run the Migration

The database migration creates the necessary tables for storing Paddle customers, invoices, and payments.

**Option 1: Using the migration script**
```bash
cd /workspace/teckstart-latest
npm install tsx
npx tsx scripts/migrate.ts
```

**Option 2: Manual SQL execution**

Connect to your Neon database and run the SQL from:
```
drizzle/0002_public_thanos.sql
```

This will create:
- `paddleCustomers` table
- `paddleInvoices` table
- `paddlePayments` table
- Required indexes and foreign keys

### 3.2 Verify Migration

Check that the tables were created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'paddle%';
```

Expected output:
```
paddleCustomers
paddleInvoices
paddlePayments
```

## Phase 4: Webhook Configuration (Optional for Testing)

### 4.1 Get Your Webhook URL

Your webhook endpoint is:
```
https://your-domain.com/api/webhooks/paddle
```

For local testing, you can use ngrok:
```bash
ngrok http 3000
```

Then use the ngrok URL: `https://abc123.ngrok.io/api/webhooks/paddle`

### 4.2 Configure Webhook in Paddle

1. Go to **Developer tools** > **Notifications** > **Webhooks**
2. Click **Create Webhook**
3. Enter your webhook URL
4. Select events to subscribe to:
   - `invoice.paid`
   - `payment.completed`
   - `payment.failed`
5. Copy the **Webhook Secret** (save this for later)
6. Click **Create**

### 4.3 Add Webhook Secret to Environment Variables

Add to your `.env.local`:
```bash
PADDLE_WEBHOOK_SECRET=whsec_1234567890abcdef
```

## Phase 5: Access the Admin Interface

### 5.1 Navigate to Invoice Management

Open your browser and go to:
```
http://localhost:3000/admin/invoices
```

### 5.2 Create Your First Invoice

1. Click **Create Invoice** button
2. Fill in customer email
3. Add invoice items:
   - Description (e.g., "TeckStart Monthly Subscription")
   - Amount (e.g., 29.00)
   - Quantity (e.g., 1)
4. Set currency (default: USD)
5. Add optional notes
6. Click **Create Invoice**

### 5.3 Send Invoice to Customer

After creating the invoice:
1. The checkout URL is automatically copied to your clipboard
2. Share this URL with your customer
3. Customer can pay via Paddle's secure checkout
4. Payment status updates automatically via webhooks

## Phase 6: Testing the Payment Flow

### 6.1 Test Invoice Creation

1. Create a test invoice with:
   - Email: `test@example.com`
   - Item: "Test Service" - $10.00 - 1 unit
2. Copy the checkout URL
3. Open it in an incognito browser

### 6.2 Test Payment (Sandbox)

1. On the Paddle checkout page:
   - Enter test card details (Paddle provides test cards)
   - Complete the payment
2. Check that payment status updates to "paid"
3. Verify webhook received payment event

### 6.3 Verify Data Storage

Check your database:
```sql
SELECT * FROM paddleInvoices;
SELECT * FROM paddlePayments;
SELECT * FROM paddleCustomers;
```

## Phase 7: Production Setup

### 7.1 Create Production Paddle Account

1. Go to https://vendors.paddle.com/signup
2. Complete business verification
3. Set up bank account for payouts

### 7.2 Generate Production API Keys

Repeat Phase 1.2 with your production account

### 7.3 Update Environment Variables

Update `.env.local` or set in your production environment:
```bash
PADDLE_API_KEY=paddle_live_production_key
PADDLE_WEBHOOK_SECRET=production_webhook_secret
NODE_ENV=production
```

### 7.4 Configure Production Webhook

Repeat Phase 4 with your production domain

### 7.5 Test Production Flow

Create a small test invoice ($0.01) to verify production setup

## API Reference

### Create Invoice

**POST** `/api/invoices`

```json
{
  "customerEmail": "customer@example.com",
  "items": [
    {
      "description": "Service Description",
      "amount": 100.00,
      "quantity": 1
    }
  ],
  "currencyCode": "USD",
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "invoice": {
    "id": 1,
    "invoiceNumber": "INV-202601-1234",
    "customerEmail": "customer@example.com",
    "amount": "100.00",
    "totalAmount": "100.00",
    "currencyCode": "USD",
    "status": "sent",
    "checkoutUrl": "https://checkout.paddle.com/checkout/...",
    "items": [...]
  }
}
```

### Get Invoice Details

**GET** `/api/invoices/{id}`

**Response:**
```json
{
  "invoice": {...},
  "payments": [...]
}
```

### List All Invoices

**GET** `/api/invoices`

**Response:**
```json
{
  "invoices": [...]
}
```

## Troubleshooting

### Issue: "Paddle API Key not configured"

**Solution:** Ensure `PADDLE_API_KEY` is set in `.env.local` and restart the dev server.

### Issue: "Migration failed"

**Solution:** Check that `DATABASE_URL` is correct and you have sufficient permissions. Run migration manually with SQL.

### Issue: Webhooks not received

**Solution:** 
- Verify webhook URL is accessible (use ngrok for local testing)
- Check Paddle webhook logs for errors
- Ensure webhook secret is correct

### Issue: Payment status not updating

**Solution:**
- Check webhook is configured correctly
- Verify webhook handler is receiving events
- Check database logs for errors

## Security Notes

1. **Never commit `.env.local`** to version control
2. **Rotate API keys** periodically
3. **Use webhook signature verification** in production
4. **Restrict admin pages** to authorized users only
5. **Validate all inputs** before processing

## Support

- Paddle Documentation: https://www.paddle.com/docs
- Paddle Support: https://www.paddle.com/support
- TeckStart Repository: https://github.com/twinwicksllc/teckstart-v2-nextjs

## Next Steps

1. Complete the setup above
2. Test with sandbox payments
3. Customize invoice templates (optional)
4. Set up automated invoice reminders (optional)
5. Integrate with existing user management (optional)