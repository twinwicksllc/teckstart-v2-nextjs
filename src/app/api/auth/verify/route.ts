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
    const cookieToken = request.cookies.get("auth-token")?.value;
    
    console.log("Auth verification request:", {
      hasAuthHeader: !!authHeader,
      hasCookieToken: !!cookieToken,
      cookieName: "auth-token",
      allCookies: request.cookies.getAll().map(c => ({ name: c.name, valueLength: c.value.length }))
    });

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
      console.log("Using token from Authorization header");
    } else if (cookieToken) {
      token = cookieToken;
      console.log("Using token from auth-token cookie");
    } else {
      console.log("No token found in headers or cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Attempting to verify token with Cognito, token length:", token.length);
    const command = new GetUserCommand({
      AccessToken: token,
    });

    const response = await cognitoClient.send(command);
    console.log("Cognito response:", { username: response.Username, attributeCount: response.UserAttributes?.length });
    
    if (!response.Username) {
      console.log("No username in Cognito response");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const email = response.UserAttributes?.find(attr => attr.Name === "email")?.Value;
    if (!email) {
      console.log("No email in Cognito response");
      return NextResponse.json({ error: "Email not found" }, { status: 401 });
    }

    console.log("Found email from Cognito:", email);
    const userRecords = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    console.log("Database lookup:", { found: userRecords.length > 0, email });
    if (userRecords.length === 0) {
      console.log("User not found in database for email:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dbUser = userRecords[0];
    console.log("User verified successfully:", { id: dbUser.id, email: dbUser.email });
    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name ? dbUser.name : email.split("@")[0],
      role: dbUser.role,
    });
  } catch (error) {
    console.error("Token verification failed:", {
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ error: "Verification failed" }, { status: 401 });
  }
}
