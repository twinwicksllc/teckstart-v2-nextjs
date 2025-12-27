
## **DB & Health Scripts**
- **Prereq:** Ensure `.env.local` contains `DATABASE_URL`, `AWS_REGION`, and `S3_BUCKET_NAME` or `AWS_S3_BUCKET`.
- **List Tables:** Shows all public tables in Neon.
   - Command:
      ```bash
      node scripts/list-tables.mjs
      ```
- **Check Receipts Table:** Verifies existence of the `receipts` table.
   - Command:
      ```bash
      node scripts/check-receipts.mjs
      ```
   - Expected output: `{ receiptsExists: true }`
- **Create Receipts Schema (safe/idempotent):** Creates enum, table, indexes, and FK.
   - Command:
      ```bash
      node scripts/create-receipts.mjs
      ```
- **Run SQL Migration:** Applies `drizzle/migrations/0002_add_receipts_table.sql` if you prefer raw SQL.
   - Command:
      ```bash
      node scripts/migrate-receipts.mjs
      ```
- **Health Endpoint:** Checks envs, DB connectivity, and table presence.
   - Local:
      ```bash
      curl -sS http://localhost:3000/api/admin/db/health | jq
      ```
   - Vercel:
      ```bash
      curl -sS https://<your-app>.vercel.app/api/admin/db/health | jq
      ```
   - Status should be `ok`; `degraded` indicates missing envs or tables.

# TeckStart v2 - Next.js Version

**Status:** 🚧 Under Development  
**Architecture:** Next.js 14 (App Router) + AWS + Neon PostgreSQL  
**Deployment:** Vercel (Optimized)

## 🎯 Overview

TeckStart is a freelance expense and project tracker with AI-powered receipt parsing. This version is built with the optimal Next.js architecture for Vercel deployment, replacing the suboptimal Vite + Express setup.

## ✨ Features

### Current Features (v2.0)
- ✅ User authentication with AWS Cognito
- ✅ Project management (CRUD operations)
- ✅ Expense tracking with manual entry
- ✅ Dashboard with analytics
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Serverless-optimized database connections

### Planned Features (v2.1)
- 🤖 AI receipt parsing with AWS Bedrock
- 📊 Advanced analytics dashboard
- 📄 Tax reporting and CSV export
- 🏷️ Automated expense categorization
- 💳 AWS Cost Explorer integration

## 🏗️ Architecture

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** TanStack Query
- **Authentication:** Custom JWT + AWS Cognito

### Backend
- **API Routes:** Next.js API routes (serverless)
- **Database:** Neon PostgreSQL with Drizzle ORM
- **Authentication:** AWS Cognito
- **File Storage:** AWS S3
- **AI Processing:** AWS Bedrock (planned)

### Infrastructure
- **Hosting:** Vercel (optimized for Next.js)
- **Database:** Neon PostgreSQL (serverless-optimized)
- **CDN:** Vercel Edge Network
- **Monitoring:** Built-in Vercel Analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Neon PostgreSQL database
- AWS account (Cognito + S3)
- Vercel account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/twinwicksllc/teckstart-v2-nextjs.git
   cd teckstart-v2-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Set up database**
   ```bash
   # Run migrations (when available)
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000**

### Environment Variables

See `.env.example` for all required variables:

```bash
# Database
DATABASE_HOST=your_postgresql_host
DATABASE_USER=your_postgresql_user
DATABASE_PASSWORD=your_postgresql_password
DATABASE_NAME=teckstart

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_s3_bucket

# Cognito
COGNITO_USER_POOL_ID=us-east-1_iSsgMCrkM
COGNITO_CLIENT_ID=your_client_id

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Dashboard pages
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui components
│   ├── auth/           # Authentication components
│   └── dashboard/      # Dashboard components
├── lib/                 # Utilities
│   ├── auth.ts          # Auth helpers
│   ├── db.ts            # Database connection
│   └── utils.ts         # General utilities
├── types/               # TypeScript types
└── drizzle.schema.ts    # Database schema
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code quality
npm run lint         # Run ESLint
npm run type-check   # Type checking without emit

# Database
npm run db:push      # Push schema changes
```

### Database Schema

The application uses 7 main tables:

1. **users** - User authentication and profiles
2. **projects** - Freelance project management
3. **expenses** - Expense tracking
4. **expenseCategories** - IRS Schedule C categories
5. **vendorTemplates** - AI parsing optimization
6. **parsingLogs** - Receipt processing audit trail
7. **userPreferences** - User settings

See `src/drizzle.schema.ts` for detailed schema.

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Environment Variables for Production

Set these in your Vercel dashboard:

```bash
DATABASE_URL=postgresql://...
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=...
COGNITO_USER_POOL_ID=...
COGNITO_CLIENT_ID=...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=...
```

## 🔐 Security

- **Authentication:** AWS Cognito with JWT tokens
- **Authorization:** Role-based access control
- **Input Validation:** Zod schemas for all inputs
- **CSRF Protection:** Next.js built-in protection
- **Secure Cookies:** httpOnly, secure, sameSite
- **Environment Variables:** All secrets in environment

## 📊 Performance

### Optimizations
- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automatic with App Router
- **Caching:** API response caching
- **Database Connection Pooling:** Serverless-optimized
- **CDN:** Vercel Edge Network

### Metrics
- **Lighthouse Score:** 90+ (target)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 2s
- **Bundle Size:** < 500KB gzipped

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions

## 🔄 Migration from Vite Version

If you're migrating from the Vite + Express version:

1. **Database:** Same schema, no migration needed
2. **Authentication:** Same AWS Cognito setup
3. **Features:** All current features preserved
4. **Deployment:** Much simpler with Vercel
5. **Performance:** Significantly improved

## 🛣️ Roadmap

### v2.1 (Next Sprint)
- [ ] AI receipt parsing with Claude 3.5 Sonnet
- [ ] File upload with drag-and-drop
- [ ] Vendor template caching
- [ ] Tax categorization

### v2.2 (Following Sprint)
- [ ] AWS Cost Explorer integration
- [ ] Advanced analytics dashboard
- [ ] CSV export for tax preparation
- [ ] Mobile app (React Native)

### v3.0 (Long Term)
- [ ] Multi-tenant support
- [ ] Advanced reporting
- [ ] Integrations (QuickBooks, etc.)
- [ ] Team collaboration features

---

**Built with ❤️ for freelancers by TeckStart**
