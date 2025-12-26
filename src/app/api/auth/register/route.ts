import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await registerUser(email, password);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Registration successful. Please check your email for verification if required, then log in.",
      });
    }

    return NextResponse.json(
      { success: false, error: result.error || "Registration failed" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
