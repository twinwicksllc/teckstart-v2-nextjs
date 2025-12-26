import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Login attempt for:", email);
    const result = await authenticateUser(email, password);
    console.log("Auth result:", { success: result.success, error: result.error });

    if (result.success && result.user && result.token) {
      // Create session cookie
      const response = NextResponse.json({
        success: true,
        user: result.user,
      });

      // Set secure cookie
      response.cookies.set("auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: result.error || "Authentication failed" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}