#!/usr/bin/env node
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = neon(process.env.DATABASE_URL);

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Export it before running this script.");
    process.exit(1);
  }

  const migrationPath = path.join(__dirname, "..", "drizzle", "migrations", "0005_add_expenses_fingerprint_unique.sql");
  const migrationSQL = fs.readFileSync(migrationPath, "utf8");

  console.log("Running migration: 0005_add_expenses_fingerprint_unique.sql");
  await sql.query(migrationSQL);
  console.log("✅ Migration applied");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
