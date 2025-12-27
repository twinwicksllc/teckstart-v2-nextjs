import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import fs from "fs";

async function main() {
  console.log("Running migration 0001_flat_polaris (incomes table)...");

  const migrationPath = path.join(process.cwd(), "drizzle/0001_flat_polaris.sql");
  const migrationSql = fs.readFileSync(migrationPath, "utf8");

  // Split the migration into individual statements
  const statements = migrationSql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    try {
      await db.execute(sql.raw(statement));
      console.log("Executed statement successfully");
    } catch (error) {
      console.error("Error executing statement:", error);
      console.log("Statement:", statement);
      throw error;
    }
  }

  console.log("Migration 0001 completed successfully");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
