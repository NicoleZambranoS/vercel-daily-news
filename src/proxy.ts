import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.VERCEL_API_URL!;
const BYPASS_TOKEN = process.env.VERCEL_PROTECTION_BYPASS!;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/articles/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("subscription-token")?.value;

  // No cookie — let the page through, Paywall will show the teaser.
  if (!token) {
    return NextResponse.next();
  }

  return verifyAndContinue(request, token);
}

async function verifyAndContinue(request: NextRequest, token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/subscription`, {
      headers: {
        "x-vercel-protection-bypass": BYPASS_TOKEN,
        "x-subscription-token": token,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data.status === "active") {
        return NextResponse.next();
      }
    }
  } catch (error) {
    console.error("Proxy: subscription verification failed:", error);
  }

  // Token is invalid or expired, let the page through with the paywall.
  const url = request.nextUrl.clone();
  const response = NextResponse.redirect(url);
  response.cookies.delete("subscription-token");
  return response;
}

export const config = {
  matcher: ["/articles/:path*"],
};
