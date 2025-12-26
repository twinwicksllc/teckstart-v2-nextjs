import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  try {
    const migrationPath = path.join(process.cwd(), "drizzle", "migrations", "0002_add_receipts_table.sql");
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
