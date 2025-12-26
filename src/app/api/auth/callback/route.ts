import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/drizzle.schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL || `${new URL(request.url).origin}/api/auth/callback`;

    if (!domain || !clientId) {
      console.error("Missing Cognito configuration:", { domain, clientId });
      return NextResponse.redirect(new URL("/login?error=missing_config", request.url));
    }

    const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;

    // Exchange code for tokens
    console.log("Exchanging code for tokens...");
    const tokenResponse = await fetch(`${baseUrl}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokens);
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url));
    }

    const { access_token, id_token } = tokens;

    // Get user info from Cognito
    console.log("Fetching user info...");
    const userInfoResponse = await fetch(`${baseUrl}/oauth2/userInfo`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      console.error("Failed to fetch user info:", userInfo);
      return NextResponse.redirect(new URL("/login?error=user_info_failed", request.url));
    }

    const email = userInfo.email.toLowerCase();
    const name = userInfo.name || userInfo.given_name || email.split("@")[0];

    console.log("Syncing user with database:", email);
    // Sync with database
    let user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length === 0) {
      console.log("Creating new user in database...");
      await db.insert(users).values({
        email,
        name,
        loginMethod: "google",
        role: "user",
      });
      user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    }

    console.log("Login successful, redirecting to dashboard");
    // Create response and set cookie
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    };

    console.log("Setting auth-token cookie with options:", { ...cookieOptions, secure: cookieOptions.secure });
    response.cookies.set("auth-token", access_token, cookieOptions);

    return response;
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(new URL("/login?error=internal_error", request.url));
  }
}
