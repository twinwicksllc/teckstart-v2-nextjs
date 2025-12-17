import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, boolean, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects table for tracking freelance projects
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  clientName: varchar("clientName", { length: 255 }),
  clientEmail: varchar("clientEmail", { length: 320 }),
  description: text("description"),
  status: mysqlEnum("status", ["active", "completed", "on_hold", "cancelled"]).default("active").notNull(),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("userId_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Expense categories for IRS Schedule C mapping
 */
export const expenseCategories = mysqlTable("expenseCategories", {
  id: int("id").autoincrement().primaryKey(),
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
export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: int("projectId").references(() => projects.id, { onDelete: "set null" }),
  categoryId: int("categoryId").references(() => expenseCategories.id, { onDelete: "set null" }),
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
  lineItems: json("lineItems").$type<Array<{
    description: string;
    quantity?: number;
    unitPrice?: number;
    amount: number;
  }>>(),
  aiParsed: boolean("aiParsed").default(false).notNull(),
  aiConfidence: decimal("aiConfidence", { precision: 5, scale: 2 }),
  source: mysqlEnum("source", ["manual", "receipt_upload", "aws_auto"]).default("manual").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("userId_idx").on(table.userId),
  projectIdIdx: index("projectId_idx").on(table.projectId),
  categoryIdIdx: index("categoryId_idx").on(table.categoryId),
  expenseDateIdx: index("expenseDate_idx").on(table.expenseDate),
  sourceIdx: index("source_idx").on(table.source),
}));

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

/**
 * Vendor templates for caching receipt parsing patterns
 */
export const vendorTemplates = mysqlTable("vendorTemplates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  vendorName: varchar("vendorName", { length: 255 }).notNull(),
  layoutHash: varchar("layoutHash", { length: 64 }).notNull(),
  extractionTemplate: json("extractionTemplate").$type<{
    vendorPattern: string;
    datePattern: string;
    amountPattern: string;
    taxPattern?: string;
    lineItemsPattern?: string;
  }>().notNull(),
  categoryId: int("categoryId").references(() => expenseCategories.id, { onDelete: "set null" }),
  useCount: int("useCount").default(0).notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userVendorIdx: index("user_vendor_idx").on(table.userId, table.vendorName),
  layoutHashIdx: index("layoutHash_idx").on(table.layoutHash),
}));

export type VendorTemplate = typeof vendorTemplates.$inferSelect;
export type InsertVendorTemplate = typeof vendorTemplates.$inferInsert;

/**
 * Parsing logs for audit trail and debugging
 */
export const parsingLogs = mysqlTable("parsingLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expenseId: int("expenseId").references(() => expenses.id, { onDelete: "set null" }),
  receiptFileKey: varchar("receiptFileKey", { length: 500 }).notNull(),
  vendorTemplateId: int("vendorTemplateId").references(() => vendorTemplates.id, { onDelete: "set null" }),
  usedTemplate: boolean("usedTemplate").default(false).notNull(),
  aiModel: varchar("aiModel", { length: 100 }).notNull(),
  aiCost: decimal("aiCost", { precision: 10, scale: 6 }),
  rawResponse: json("rawResponse"),
  extractedData: json("extractedData"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  processingTimeMs: int("processingTimeMs"),
  status: mysqlEnum("status", ["success", "failed", "partial"]).notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("userId_idx").on(table.userId),
  expenseIdIdx: index("expenseId_idx").on(table.expenseId),
  statusIdx: index("status_idx").on(table.status),
}));

export type ParsingLog = typeof parsingLogs.$inferSelect;
export type InsertParsingLog = typeof parsingLogs.$inferInsert;

/**
 * User preferences for customization
 */
export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  defaultCurrency: varchar("defaultCurrency", { length: 3 }).default("USD").notNull(),
  fiscalYearStart: int("fiscalYearStart").default(1).notNull(), // 1-12 for month
  autoCategorizationEnabled: boolean("autoCategorizationEnabled").default(true).notNull(),
  awsAutoRetrievalEnabled: boolean("awsAutoRetrievalEnabled").default(false).notNull(),
  awsAccountId: varchar("awsAccountId", { length: 12 }),
  awsAccessKeyId: varchar("awsAccessKeyId", { length: 128 }),
  awsSecretAccessKey: text("awsSecretAccessKey"), // Encrypted in production
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;
