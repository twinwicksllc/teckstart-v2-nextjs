import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function debug() {
  try {
    console.log("--- Latest Projects ---");
    const projects = await sql`SELECT id, name, "clientName", status, "createdAt" FROM projects ORDER BY "createdAt" DESC LIMIT 5;`;
    console.table(projects);

    console.log("\n--- Latest Receipts ---");
    const receipts = await sql`SELECT id, "fileName", "fileType", status, "retryCount", "lastError", "uploadedAt", "updatedAt" FROM receipts ORDER BY "uploadedAt" DESC LIMIT 10;`;
    console.table(receipts);

    console.log("\n--- Latest Expenses ---");
    const expenses = await sql`SELECT id, vendor, amount, "expenseDate", "aiParsed", "aiConfidence" FROM expenses ORDER BY "createdAt" DESC LIMIT 5;`;
    console.table(expenses);

    console.log("\n--- Parsing Logs (if any) ---");
    try {
      const logs = await sql`SELECT * FROM "parsingLogs" ORDER BY "createdAt" DESC LIMIT 5;`;
      console.table(logs);
    } catch (e) {
      console.log("No parsingLogs table or error fetching logs.");
    }
  } catch (error) {
    console.error("Debug failed:", error);
  }
}

debug();
