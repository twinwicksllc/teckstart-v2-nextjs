import { serial, pgTable, text, timestamp, varchar, decimal, jsonb, boolean, index, pgEnum, integer } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const projectStatusEnum = pgEnum("project_status", ["active", "completed", "on_hold", "cancelled"]);
export const expenseSourceEnum = pgEnum("expense_source", ["manual", "receipt_upload", "aws_auto"]);
export const parsingStatusEnum = pgEnum("parsing_status", ["success", "failed", "partial"]);
export const receiptStatusEnum = pgEnum("receipt_status", ["pending", "processing", "completed", "failed"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }),
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects table for tracking freelance projects
 */
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  clientName: varchar("clientName", { length: 255 }),
  clientEmail: varchar("clientEmail", { length: 320 }),
  description: text("description"),
  status: projectStatusEnum("status").default("active").notNull(),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("projects_userId_idx").on(table.userId),
  statusIdx: index("projects_status_idx").on(table.status),
}));

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Expense categories for IRS Schedule C mapping
 */
export const expenseCategories = pgTable("expenseCategories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  scheduleCLine: varchar("scheduleCLine", { length: 50 }),
  description: text("description"),
  isDeductible: boolean("isDeductible").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type InsertExpenseCategory = typeof expenseCategories.$inferInsert;

/**
 * Expenses table for tracking all expenses
 */
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("projectId").references(() => projects.id, { onDelete: "set null" }),
  categoryId: integer("categoryId").references(() => expenseCategories.id, { onDelete: "set null" }),
  vendor: varchar("vendor", { length: 255 }).notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal("taxAmount", { precision: 12, scale: 2 }),
  expenseDate: timestamp("expenseDate").notNull(),
  receiptUrl: text("receiptUrl"),
  receiptFileKey: varchar("receiptFileKey", { length: 500 }),
  receiptFileName: varchar("receiptFileName", { length: 255 }),
  receiptMimeType: varchar("receiptMimeType", { length: 100 }),
  isDeductible: boolean("isDeductible").default(true).notNull(),
  deductibilityReason: text("deductibilityReason"),
  lineItems: jsonb("lineItems").$type<Array<{
    description: string;
    quantity?: number;
    unitPrice?: number;
    amount: number;
  }>>(),
  aiParsed: boolean("aiParsed").default(false).notNull(),
  aiConfidence: decimal("aiConfidence", { precision: 5, scale: 2 }),
  source: expenseSourceEnum("source").default("manual").notNull(),
  awsService: varchar("awsService", { length: 255 }),
  awsTags: jsonb("awsTags").$type<Record<string, string>>(),
  fingerprint: varchar("fingerprint", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("expenses_userId_idx").on(table.userId),
  projectIdIdx: index("expenses_projectId_idx").on(table.projectId),
  categoryIdIdx: index("expenses_categoryId_idx").on(table.categoryId),
  expenseDateIdx: index("expenses_expenseDate_idx").on(table.expenseDate),
  fingerprintIdx: index("expenses_fingerprint_idx").on(table.fingerprint),
  sourceIdx: index("expenses_source_idx").on(table.source),
}));

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

/**
 * AWS Configurations for multiple accounts
 */
export const awsConfigs = pgTable("awsConfigs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  awsAccessKeyId: text("awsAccessKeyId").notNull(), // Encrypted
  awsSecretAccessKey: text("awsSecretAccessKey").notNull(), // Encrypted
  awsRegion: varchar("awsRegion", { length: 50 }).default("us-east-1").notNull(),
  awsAccountId: varchar("awsAccountId", { length: 20 }),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("awsConfigs_userId_idx").on(table.userId),
}));

export type AwsConfig = typeof awsConfigs.$inferSelect;
export type InsertAwsConfig = typeof awsConfigs.$inferInsert;

/**
 * Vendor templates for caching receipt parsing patterns
 */
export const vendorTemplates = pgTable("vendorTemplates", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  vendorName: varchar("vendorName", { length: 255 }).notNull(),
  layoutHash: varchar("layoutHash", { length: 64 }).notNull(),
  extractionTemplate: jsonb("extractionTemplate").$type<{
    vendorPattern: string;
    datePattern: string;
    amountPattern: string;
    taxPattern?: string;
    lineItemsPattern?: string;
  }>().notNull(),
  categoryId: integer("categoryId").references(() => expenseCategories.id, { onDelete: "set null" }),
  useCount: integer("useCount").default(0).notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userVendorIdx: index("user_vendor_idx").on(table.userId, table.vendorName),
  layoutHashIdx: index("layoutHash_idx").on(table.layoutHash),
}));

export type VendorTemplate = typeof vendorTemplates.$inferSelect;
export type InsertVendorTemplate = typeof vendorTemplates.$inferInsert;

/**
 * Parsing logs for audit trail and debugging
 */
export const parsingLogs = pgTable("parsingLogs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expenseId: integer("expenseId").references(() => expenses.id, { onDelete: "set null" }),
  receiptFileKey: varchar("receiptFileKey", { length: 500 }).notNull(),
  vendorTemplateId: integer("vendorTemplateId").references(() => vendorTemplates.id, { onDelete: "set null" }),
  usedTemplate: boolean("usedTemplate").default(false).notNull(),
  aiModel: varchar("aiModel", { length: 100 }).notNull(),
  aiCost: decimal("aiCost", { precision: 10, scale: 6 }),
  rawResponse: jsonb("rawResponse"),
  extractedData: jsonb("extractedData"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  processingTimeMs: integer("processingTimeMs"),
  status: parsingStatusEnum("status").notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("parsingLogs_userId_idx").on(table.userId),
  expenseIdIdx: index("parsingLogs_expenseId_idx").on(table.expenseId),
  statusIdx: index("parsingLogs_status_idx").on(table.status),
}));

export type ParsingLog = typeof parsingLogs.$inferSelect;
export type InsertParsingLog = typeof parsingLogs.$inferInsert;

/**
 * User preferences for customization
 */
export const userPreferences = pgTable("userPreferences", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  defaultCurrency: varchar("defaultCurrency", { length: 3 }).default("USD").notNull(),
  fiscalYearStart: integer("fiscalYearStart").default(1).notNull(), // 1-12 for month
  autoCategorizationEnabled: boolean("autoCategorizationEnabled").default(true).notNull(),
  awsAutoRetrievalEnabled: boolean("awsAutoRetrievalEnabled").default(false).notNull(),
  awsAccountId: varchar("awsAccountId", { length: 12 }),
  awsAccessKeyId: varchar("awsAccessKeyId", { length: 128 }),
  awsSecretAccessKey: text("awsSecretAccessKey"), // Encrypted in production
  awsRegion: varchar("awsRegion", { length: 50 }).default("us-east-1").notNull(),
  awsLastRetrievedAt: timestamp("awsLastRetrievedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

/**
 * Receipts table for tracking receipt file processing and AI parsing
 */
export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("projectId").references(() => projects.id, { onDelete: "set null" }),
  expenseId: integer("expenseId").references(() => expenses.id, { onDelete: "set null" }),
  filePath: varchar("filePath", { length: 500 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileSize: integer("fileSize"),
  fileType: varchar("fileType", { length: 100 }),
  s3Key: varchar("s3Key", { length: 500 }),
  status: receiptStatusEnum("status").default("pending").notNull(),
  rawParsedData: jsonb("rawParsedData").$type<Record<string, any>>(),
  normalizedData: jsonb("normalizedData").$type<{
    merchantName?: string;
    date?: string;
    total?: number;
    tax?: number;
    currency?: string;
    category?: string;
    isTaxable?: boolean;
    lineItems?: Array<{
      description: string;
      quantity?: number;
      unitPrice?: number;
      amount: number;
    }>;
  }>(),
  merchantName: varchar("merchantName", { length: 255 }),
  vendorName: varchar("vendorName", { length: 255 }),
  confidenceScore: decimal("confidenceScore", { precision: 5, scale: 2 }),
  retryCount: integer("retryCount").default(0).notNull(),
  lastError: text("lastError"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("receipts_userId_idx").on(table.userId),
  projectIdIdx: index("receipts_projectId_idx").on(table.projectId),
  expenseIdIdx: index("receipts_expenseId_idx").on(table.expenseId),
  statusIdx: index("receipts_status_idx").on(table.status),
  uploadedAtIdx: index("receipts_uploadedAt_idx").on(table.uploadedAt),
}));

export type Receipt = typeof receipts.$inferSelect;
export type InsertReceipt = typeof receipts.$inferInsert;

