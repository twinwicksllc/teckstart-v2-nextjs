import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, projects, expenses, receipts } from "@/drizzle.schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const startedAt = Date.now();

  const requiredEnv = [
    "DATABASE_URL",
    "AWS_REGION",
    "S3_BUCKET_NAME",
  ];

  const envStatus: Record<string, boolean> = {};
  for (const key of requiredEnv) {
    envStatus[key] = Boolean(process.env[key]);
  }

  const details: Record<string, any> = {
    env: envStatus,
    db: {
      connected: false,
      latencyMs: undefined as number | undefined,
      tables: {
        users: false,
        projects: false,
        expenses: false,
        receipts: false,
      },
      errors: [] as Array<{ component: string; message: string }>,
    },
  };

  // Helper to check a table exists by attempting a trivial select
  async function checkTable<T>(name: string, selectFn: () => Promise<T>) {
    try {
      await selectFn();
      details.db.tables[name as keyof typeof details.db.tables] = true;
    } catch (err: any) {
      const msg = err?.message || String(err);
      details.db.errors.push({ component: `table:${name}`, message: msg });
      console.error(`[HEALTH] Missing or inaccessible table '${name}':`, msg);
    }
  }

  try {
    // Simple connectivity check
    await db.execute(sql`select 1 as ok`);
    details.db.connected = true;
    details.db.latencyMs = Date.now() - startedAt;
  } catch (err: any) {
    const msg = err?.message || String(err);
    details.db.errors.push({ component: "connect", message: msg });
    console.error("[HEALTH] Database connectivity failed:", msg);
    return NextResponse.json(
      { status: "error", details },
      { status: 500 }
    );
  }

  // Check critical tables
  await checkTable("users", async () => {
    await db.select({ id: users.id }).from(users).limit(1);
  });
  await checkTable("projects", async () => {
    await db.select({ id: projects.id }).from(projects).limit(1);
  });
  await checkTable("expenses", async () => {
    await db.select({ id: expenses.id }).from(expenses).limit(1);
  });
  await checkTable("receipts", async () => {
    await db.select({ id: receipts.id }).from(receipts).limit(1);
  });

  const allEnvOk = Object.values(envStatus).every(Boolean);
  const allTablesOk = Object.values(details.db.tables).every(Boolean);

  const overall = allEnvOk && details.db.connected && allTablesOk ? "ok" : "degraded";
  const httpStatus = overall === "ok" ? 200 : 503;

  if (overall !== "ok") {
    console.error("[HEALTH] Degraded:", JSON.stringify(details));
  }

  return NextResponse.json(
    {
      status: overall,
      details,
    },
    { status: httpStatus }
  );
}
