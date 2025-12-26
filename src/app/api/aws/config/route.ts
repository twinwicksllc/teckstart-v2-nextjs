import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { awsConfigs } from "@/drizzle.schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth";
import { encrypt } from "@/lib/encryption";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await db.query.awsConfigs.findFirst({
    where: eq(awsConfigs.userId, session.id),
  });

  if (!config) {
    return NextResponse.json({ configured: false });
  }

  return NextResponse.json({
    configured: true,
    lastSyncedAt: config.lastSyncedAt,
    awsRegion: config.awsRegion,
    // Do not return secrets
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    let { accessKeyId, secretAccessKey, region } = body;

    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Trim whitespace to prevent copy-paste errors
    accessKeyId = accessKeyId.trim();
    secretAccessKey = secretAccessKey.trim();

    const encryptedAccessKey = encrypt(accessKeyId);
    const encryptedSecretKey = encrypt(secretAccessKey);

    const existingConfig = await db.query.awsConfigs.findFirst({
      where: eq(awsConfigs.userId, session.id),
    });

    if (existingConfig) {
      await db.update(awsConfigs)
        .set({
          awsAccessKeyId: encryptedAccessKey,
          awsSecretAccessKey: encryptedSecretKey,
          awsRegion: region || "us-east-1",
          updatedAt: new Date(),
        })
        .where(eq(awsConfigs.id, existingConfig.id));
    } else {
      await db.insert(awsConfigs).values({
        userId: session.id,
        awsAccessKeyId: encryptedAccessKey,
        awsSecretAccessKey: encryptedSecretKey,
        awsRegion: region || "us-east-1",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving AWS config:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
