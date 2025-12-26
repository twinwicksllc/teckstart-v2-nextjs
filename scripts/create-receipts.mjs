import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log("Creating receipt_status enum and receipts table...");
  await sql`DO $$ BEGIN CREATE TYPE receipt_status AS ENUM('pending','processing','completed','failed'); EXCEPTION WHEN duplicate_object THEN null; END $$;`;
  await sql`CREATE TABLE IF NOT EXISTS receipts (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "projectId" INTEGER REFERENCES projects(id) ON DELETE SET NULL,
    "expenseId" INTEGER REFERENCES expenses(id) ON DELETE SET NULL,
    "filePath" VARCHAR(500) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileSize" INTEGER,
    "fileType" VARCHAR(100),
    "s3Key" VARCHAR(500),
    status receipt_status NOT NULL DEFAULT 'pending',
    "rawParsedData" JSONB,
    "normalizedData" JSONB,
    "merchantName" VARCHAR(255),
    "vendorName" VARCHAR(255),
    "confidenceScore" DECIMAL(5, 2),
    "retryCount" INTEGER DEFAULT 0,
    "lastError" TEXT,
    "uploadedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "processedAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
  );`;
  await sql`CREATE INDEX IF NOT EXISTS "receipts_userId_idx" ON receipts("userId");`;
  await sql`CREATE INDEX IF NOT EXISTS "receipts_projectId_idx" ON receipts("projectId");`;
  await sql`CREATE INDEX IF NOT EXISTS "receipts_expenseId_idx" ON receipts("expenseId");`;
  await sql`CREATE INDEX IF NOT EXISTS receipts_status_idx ON receipts(status);`;
  await sql`CREATE INDEX IF NOT EXISTS "receipts_uploadedAt_idx" ON receipts("uploadedAt");`;
  await sql`ALTER TABLE expenses ADD COLUMN IF NOT EXISTS "receiptId" INTEGER;`;
  await sql`ALTER TABLE expenses ADD COLUMN IF NOT EXISTS "merchantName" VARCHAR(255);`;
  await sql`ALTER TABLE expenses ADD COLUMN IF NOT EXISTS "parsingStatus" VARCHAR(50);`;
  await sql`DO $$ BEGIN ALTER TABLE expenses ADD CONSTRAINT expenses_receiptId_fk FOREIGN KEY ("receiptId") REFERENCES receipts(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN null; END $$;`;
  await sql`CREATE INDEX IF NOT EXISTS "expenses_receiptId_idx" ON expenses("receiptId");`;
  console.log("Done.");
}

main().catch((e)=>{console.error("Creation failed:", e); process.exit(1);});
