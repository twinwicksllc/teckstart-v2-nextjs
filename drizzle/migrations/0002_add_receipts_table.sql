-- Create receipt_status enum type
DO $$ BEGIN
 CREATE TYPE receipt_status AS ENUM('pending', 'processing', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create receipts table for tracking receipt file processing
CREATE TABLE IF NOT EXISTS receipts (
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
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS "receipts_userId_idx" ON receipts("userId");
CREATE INDEX IF NOT EXISTS "receipts_projectId_idx" ON receipts("projectId");
CREATE INDEX IF NOT EXISTS "receipts_expenseId_idx" ON receipts("expenseId");
CREATE INDEX IF NOT EXISTS receipts_status_idx ON receipts(status);
CREATE INDEX IF NOT EXISTS "receipts_uploadedAt_idx" ON receipts("uploadedAt");

-- Add columns to expenses table if they don't exist
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS "receiptId" INTEGER,
ADD COLUMN IF NOT EXISTS "merchantName" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "parsingStatus" VARCHAR(50);

-- Add foreign key constraint if it doesn't exist
DO $$ BEGIN
  ALTER TABLE expenses ADD CONSTRAINT expenses_receiptId_fk FOREIGN KEY ("receiptId") REFERENCES receipts(id) ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create index on receiptId in expenses
CREATE INDEX IF NOT EXISTS "expenses_receiptId_idx" ON expenses("receiptId");
