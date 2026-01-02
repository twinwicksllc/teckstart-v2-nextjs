# Quick Start Guide - Paddle Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your Paddle API Key (2 minutes)

1. Go to https://sandbox-vendors.paddle.com/signup
2. Sign up for a free sandbox account
3. Navigate to **Developer tools** > **Authentication** > **API Keys**
4. Click **Create API Key**
5. Copy the **API Key Secret** (starts with `paddle_test_...`)

### Step 2: Add API Key to Environment (1 minute)

Add this line to your `.env.local` file:
```bash
PADDLE_API_KEY=your_paddle_test_key_here
```

### Step 3: Run Database Migration (1 minute)

```bash
cd /workspace/teckstart-latest
npm install tsx
npx tsx scripts/migrate.ts
```

### Step 4: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then start again
npm run dev
```

### Step 5: Create Your First Invoice (1 minute)

1. Navigate to http://localhost:3000/admin/invoices
2. Click **Create Invoice**
3. Fill in:
   - Customer Email: `test@example.com`
   - Item Description: `Test Service`
   - Amount: `10`
   - Quantity: `1`
4. Click **Create Invoice**
5. The checkout URL is automatically copied to your clipboard!

## 📝 What Just Happened?

1. ✅ Customer created in Paddle (automatically)
2. ✅ Invoice created in database
3. ✅ Checkout link generated
4. ✅ Link copied to clipboard

## 🧪 Test the Payment

1. Open the checkout URL in an incognito browser
2. Enter test card details (Paddle provides these)
3. Complete the payment
4. Check the admin page - invoice status should change to "Paid"

## 🎯 You're Done!

Your Paddle integration is now working. You can:
- Create invoices for customers
- Share checkout links via email/chat
- Collect payments automatically
- Track payment status
- Generate receipts

## 📚 Need More Details?

See the full documentation:
- **Setup Guide:** `PADDLE_SETUP_GUIDE.md`
- **Implementation Summary:** `PADDLE_IMPLEMENTATION_SUMMARY.md`
- **Environment Template:** `.env.paddle.example`

## 🆘 Common Issues

**"API Key not configured"**
→ Make sure you added `PADDLE_API_KEY` to `.env.local` and restarted the server

**"Migration failed"**
→ Check that `DATABASE_URL` is correct in `.env.local`

**"Can't access /admin/invoices"**
→ Make sure you're logged in as an admin user (role === "admin")

## 📞 Support

- Paddle Docs: https://www.paddle.com/docs
- Your Repository: https://github.com/twinwicksllc/teckstart-v2-nextjs