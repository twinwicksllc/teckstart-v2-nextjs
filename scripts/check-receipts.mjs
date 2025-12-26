import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const [existsRow] = await sql`select exists (select 1 from information_schema.tables where table_schema='public' and table_name='receipts') as exists;`;
  console.log({ receiptsExists: existsRow.exists });
}

main().catch((e)=>{console.error(e); process.exit(1);});
