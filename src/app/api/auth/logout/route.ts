import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL || `${new URL(request.url).origin}/login`;

    // Clear the auth cookie
    const cookieStore = await cookies();
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
      // Include the logout URL for client-side redirect to completely clear Google session
      logoutUrl: domain ? `${domain.startsWith("http") ? domain : `https://${domain}`}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(redirectUri)}` : null,
    });

    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    // Also try to revoke any refresh tokens if they exist
    const token = cookieStore.get("auth-token")?.value;
    if (token) {
      try {
        const baseUrl = domain?.startsWith("http") ? domain : `https://${domain}`;
        if (baseUrl) {
          // Attempt to revoke the token at Cognito
          await fetch(`${baseUrl}/oauth2/revoke`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: clientId!,
              token: token,
            }).toString(),
          }).catch(e => console.error("Token revocation failed:", e));
        }
      } catch (e) {
        console.error("Error attempting token revocation:", e);
      }
    }

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Still clear the auth cookie even if logout fails
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  }
}