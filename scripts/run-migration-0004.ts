import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import fs from "fs";

async function main() {
  console.log("Running migration 0004_add_aws_configs...");

  const migrationPath = path.join(process.cwd(), "drizzle/migrations/0004_add_aws_configs.sql");
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
      console.error("Statement:", statement);
      process.exit(1);
    }
  }

  console.log("Migration 0004 completed successfully");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
