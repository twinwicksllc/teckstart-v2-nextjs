import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  
  return NextResponse.json({
    cookies: allCookies.map(c => ({
      name: c.name,
      valueLength: c.value.length,
      valuePreview: c.value.substring(0, 50) + (c.value.length > 50 ? "..." : ""),
    })),
    allCookieHeaders: request.headers.get("cookie"),
    authorization: request.headers.get("authorization"),
  });
}
