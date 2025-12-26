import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  try {
    const migrationPath = path.join(process.cwd(), "drizzle", "migrations", "0003_add_aws_fields.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("Running migration: 0003_add_aws_fields.sql");
    const commands = migrationSQL.split(";").filter(cmd => cmd.trim() !== "");
    for (const command of commands) {
      // @ts-ignore - neon client typing issue
      await sql.query(command);
    }
    console.log("✅ Migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
