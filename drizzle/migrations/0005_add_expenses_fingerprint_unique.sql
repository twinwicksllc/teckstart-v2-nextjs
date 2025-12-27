-- Add unique index for expenses.fingerprint to support upserts
CREATE UNIQUE INDEX IF NOT EXISTS expenses_fingerprint_unique ON "expenses" ("fingerprint");
