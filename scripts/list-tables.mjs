import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    const rows = await sql`select table_name from information_schema.tables where table_schema='public' order by table_name;`;
    console.log(rows.map((r) => r.table_name));
  } catch (err) {
    console.error("Query failed:", err);
    process.exit(1);
  }
}

main();
