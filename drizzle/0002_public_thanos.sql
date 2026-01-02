CREATE TYPE "public"."paddle_invoice_status" AS ENUM('draft', 'sent', 'paid', 'overdue', 'void');--> statement-breakpoint
CREATE TYPE "public"."paddle_payment_status" AS ENUM('created', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TABLE "paddleCustomers" (
	"id" serial PRIMARY KEY NOT NULL,
	"paddleCustomerId" varchar(100) NOT NULL,
	"email" varchar(320) NOT NULL,
	"name" varchar(255),
	"address" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "paddleCustomers_paddleCustomerId_unique" UNIQUE("paddleCustomerId")
);
--> statement-breakpoint
CREATE TABLE "paddleInvoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"paddleInvoiceId" varchar(100),
	"customerId" integer,
	"invoiceNumber" varchar(100) NOT NULL,
	"currencyCode" varchar(3) DEFAULT 'USD' NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"taxAmount" numeric(12, 2),
	"totalAmount" numeric(12, 2) NOT NULL,
	"status" "paddle_invoice_status" DEFAULT 'draft' NOT NULL,
	"dueDate" timestamp,
	"notes" text,
	"items" jsonb NOT NULL,
	"checkoutUrl" text,
	"paidAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "paddleInvoices_paddleInvoiceId_unique" UNIQUE("paddleInvoiceId")
);
--> statement-breakpoint
CREATE TABLE "paddlePayments" (
	"id" serial PRIMARY KEY NOT NULL,
	"paddleTransactionId" varchar(100),
	"invoiceId" integer,
	"customerId" integer,
	"amount" numeric(12, 2) NOT NULL,
	"currencyCode" varchar(3) NOT NULL,
	"status" "paddle_payment_status" NOT NULL,
	"paymentMethod" varchar(100),
	"paidAt" timestamp,
	"receiptUrl" text,
	"receiptData" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "paddlePayments_paddleTransactionId_unique" UNIQUE("paddleTransactionId")
);
--> statement-breakpoint
ALTER TABLE "paddleInvoices" ADD CONSTRAINT "paddleInvoices_customerId_paddleCustomers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."paddleCustomers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paddlePayments" ADD CONSTRAINT "paddlePayments_invoiceId_paddleInvoices_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."paddleInvoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paddlePayments" ADD CONSTRAINT "paddlePayments_customerId_paddleCustomers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."paddleCustomers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "paddle_customers_email_idx" ON "paddleCustomers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "paddle_customers_paddle_id_idx" ON "paddleCustomers" USING btree ("paddleCustomerId");--> statement-breakpoint
CREATE INDEX "paddle_invoices_customer_id_idx" ON "paddleInvoices" USING btree ("customerId");--> statement-breakpoint
CREATE INDEX "paddle_invoices_status_idx" ON "paddleInvoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "paddle_invoices_number_idx" ON "paddleInvoices" USING btree ("invoiceNumber");--> statement-breakpoint
CREATE INDEX "paddle_invoices_paddle_id_idx" ON "paddleInvoices" USING btree ("paddleInvoiceId");--> statement-breakpoint
CREATE INDEX "paddle_payments_invoice_id_idx" ON "paddlePayments" USING btree ("invoiceId");--> statement-breakpoint
CREATE INDEX "paddle_payments_customer_id_idx" ON "paddlePayments" USING btree ("customerId");--> statement-breakpoint
CREATE INDEX "paddle_payments_status_idx" ON "paddlePayments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "paddle_payments_paddle_id_idx" ON "paddlePayments" USING btree ("paddleTransactionId");--> statement-breakpoint
CREATE UNIQUE INDEX "expenses_fingerprint_unique" ON "expenses" USING btree ("fingerprint");