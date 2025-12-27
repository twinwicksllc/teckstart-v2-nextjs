CREATE TYPE "public"."income_status" AS ENUM('pending', 'paid');--> statement-breakpoint
CREATE TABLE "incomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"description" text,
	"incomeDate" timestamp NOT NULL,
	"status" "income_status" DEFAULT 'paid' NOT NULL,
	"invoiceNumber" varchar(100),
	"invoiceUrl" text,
	"paymentMethod" varchar(100),
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "incomes_userId_idx" ON "incomes" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "incomes_projectId_idx" ON "incomes" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "incomes_incomeDate_idx" ON "incomes" USING btree ("incomeDate");--> statement-breakpoint
CREATE INDEX "incomes_status_idx" ON "incomes" USING btree ("status");