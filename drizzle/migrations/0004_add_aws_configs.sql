DO $$ BEGIN
 CREATE TYPE "public"."expense_source" AS ENUM('manual', 'receipt_upload', 'aws_auto');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "public"."expense_source" ADD VALUE IF NOT EXISTS 'aws_auto';
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."parsing_status" AS ENUM('success', 'failed', 'partial');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."project_status" AS ENUM('active', 'completed', 'on_hold', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."receipt_status" AS ENUM('pending', 'processing', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "awsConfigs" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"awsAccessKeyId" text NOT NULL,
	"awsSecretAccessKey" text NOT NULL,
	"awsRegion" varchar(50) DEFAULT 'us-east-1' NOT NULL,
	"awsAccountId" varchar(20),
	"lastSyncedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenseCategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"scheduleCLine" varchar(50),
	"description" text,
	"isDeductible" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "expenseCategories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer,
	"categoryId" integer,
	"vendor" varchar(255) NOT NULL,
	"description" text,
	"amount" numeric(12, 2) NOT NULL,
	"taxAmount" numeric(12, 2),
	"expenseDate" timestamp NOT NULL,
	"receiptUrl" text,
	"receiptFileKey" varchar(500),
	"receiptFileName" varchar(255),
	"receiptMimeType" varchar(100),
	"isDeductible" boolean DEFAULT true NOT NULL,
	"deductibilityReason" text,
	"lineItems" jsonb,
	"aiParsed" boolean DEFAULT false NOT NULL,
	"aiConfidence" numeric(5, 2),
	"source" "expense_source" DEFAULT 'manual' NOT NULL,
	"awsService" varchar(255),
	"awsTags" jsonb,
	"fingerprint" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "awsService" varchar(255);
--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "awsTags" jsonb;
--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "fingerprint" varchar(255);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parsingLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"expenseId" integer,
	"receiptFileKey" varchar(500) NOT NULL,
	"vendorTemplateId" integer,
	"usedTemplate" boolean DEFAULT false NOT NULL,
	"aiModel" varchar(100) NOT NULL,
	"aiCost" numeric(10, 6),
	"rawResponse" jsonb,
	"extractedData" jsonb,
	"confidence" numeric(5, 2),
	"processingTimeMs" integer,
	"status" "parsing_status" NOT NULL,
	"errorMessage" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"clientName" varchar(255),
	"clientEmail" varchar(320),
	"description" text,
	"status" "project_status" DEFAULT 'active' NOT NULL,
	"budget" numeric(12, 2),
	"startDate" timestamp,
	"endDate" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "receipts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer,
	"expenseId" integer,
	"filePath" varchar(500) NOT NULL,
	"fileName" varchar(255) NOT NULL,
	"fileSize" integer,
	"fileType" varchar(100),
	"s3Key" varchar(500),
	"status" "receipt_status" DEFAULT 'pending' NOT NULL,
	"rawParsedData" jsonb,
	"normalizedData" jsonb,
	"merchantName" varchar(255),
	"vendorName" varchar(255),
	"confidenceScore" numeric(5, 2),
	"retryCount" integer DEFAULT 0 NOT NULL,
	"lastError" text,
	"uploadedAt" timestamp DEFAULT now() NOT NULL,
	"processedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userPreferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"defaultCurrency" varchar(3) DEFAULT 'USD' NOT NULL,
	"fiscalYearStart" integer DEFAULT 1 NOT NULL,
	"autoCategorizationEnabled" boolean DEFAULT true NOT NULL,
	"awsAutoRetrievalEnabled" boolean DEFAULT false NOT NULL,
	"awsAccountId" varchar(12),
	"awsAccessKeyId" varchar(128),
	"awsSecretAccessKey" text,
	"awsRegion" varchar(50) DEFAULT 'us-east-1' NOT NULL,
	"awsLastRetrievedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "userPreferences_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64),
	"name" text,
	"email" varchar(320) NOT NULL,
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendorTemplates" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"vendorName" varchar(255) NOT NULL,
	"layoutHash" varchar(64) NOT NULL,
	"extractionTemplate" jsonb NOT NULL,
	"categoryId" integer,
	"useCount" integer DEFAULT 0 NOT NULL,
	"lastUsedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "awsConfigs" ADD CONSTRAINT "awsConfigs_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenses" ADD CONSTRAINT "expenses_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenses" ADD CONSTRAINT "expenses_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenses" ADD CONSTRAINT "expenses_categoryId_expenseCategories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."expenseCategories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parsingLogs" ADD CONSTRAINT "parsingLogs_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parsingLogs" ADD CONSTRAINT "parsingLogs_expenseId_expenses_id_fk" FOREIGN KEY ("expenseId") REFERENCES "public"."expenses"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parsingLogs" ADD CONSTRAINT "parsingLogs_vendorTemplateId_vendorTemplates_id_fk" FOREIGN KEY ("vendorTemplateId") REFERENCES "public"."vendorTemplates"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "receipts" ADD CONSTRAINT "receipts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "receipts" ADD CONSTRAINT "receipts_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "receipts" ADD CONSTRAINT "receipts_expenseId_expenses_id_fk" FOREIGN KEY ("expenseId") REFERENCES "public"."expenses"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userPreferences" ADD CONSTRAINT "userPreferences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendorTemplates" ADD CONSTRAINT "vendorTemplates_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendorTemplates" ADD CONSTRAINT "vendorTemplates_categoryId_expenseCategories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."expenseCategories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "awsConfigs_userId_idx" ON "awsConfigs" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "expenses_userId_idx" ON "expenses" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "expenses_projectId_idx" ON "expenses" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "expenses_categoryId_idx" ON "expenses" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "expenses_expenseDate_idx" ON "expenses" USING btree ("expenseDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "expenses_fingerprint_idx" ON "expenses" USING btree ("fingerprint");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "expenses_source_idx" ON "expenses" USING btree ("source");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parsingLogs_userId_idx" ON "parsingLogs" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parsingLogs_expenseId_idx" ON "parsingLogs" USING btree ("expenseId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parsingLogs_status_idx" ON "parsingLogs" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_userId_idx" ON "projects" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "receipts_userId_idx" ON "receipts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "receipts_projectId_idx" ON "receipts" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "receipts_expenseId_idx" ON "receipts" USING btree ("expenseId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "receipts_status_idx" ON "receipts" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "receipts_uploadedAt_idx" ON "receipts" USING btree ("uploadedAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_vendor_idx" ON "vendorTemplates" USING btree ("userId","vendorName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "layoutHash_idx" ON "vendorTemplates" USING btree ("layoutHash");