import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const sql = neon(process.env.DATABASE_URL);
    const migrationPath = path.join(__dirname, "..", "drizzle", "migrations", "0002_add_receipts_table.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("Running migration: 0002_add_receipts_table.sql");
    
    // Execute the entire migration as raw SQL
    await sql.unsafe(migrationSQL);
    
    console.log("✅ Migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
