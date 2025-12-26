import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, "..", "drizzle", "migrations", "0002_add_receipts_table.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("Running migration: 0002_add_receipts_table.sql");
    await sql(migrationSQL);
    console.log("✅ Migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
