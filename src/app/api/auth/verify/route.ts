import { NextRequest, NextResponse } from "next/server";
import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { db } from "@/lib/db";
import { users } from "@/drizzle.schema";
import { eq } from "drizzle-orm";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const dynamic = 'force-dynamic';
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    let token = null;
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // Try to get token from cookie
      token = request.cookies.get("auth-token")?.value || null;
    }
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const command = new GetUserCommand({
      AccessToken: token,
    });

    const response = await cognitoClient.send(command);
    if (!response.Username) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const email = response.UserAttributes?.find(attr => attr.Name === "email")?.Value;
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 401 });
    }

    const userRecords = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userRecords.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dbUser = userRecords[0];
    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name ? dbUser.name : email.split("@")[0],
      role: dbUser.role,
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 401 });
  }
}
