import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { syncAWSExpenses } from "@/lib/aws-processor";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { startDate, endDate } = body;

    // Default to current month if not provided
    const now = new Date();
    const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];

    await syncAWSExpenses(session.id, start, end);

    return NextResponse.json({ success: true, window: { start, end } });
  } catch (error) {
    console.error("Error syncing AWS expenses:", error);
    const message = error instanceof Error ? error.message : "Sync failed";

    // Map known failures to clearer status codes
    if (message.includes("AWS Config not found")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message.includes("decryption failed")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message.includes("AWS Cost Explorer error")) {
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
