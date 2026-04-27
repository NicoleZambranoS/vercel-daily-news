import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.VERCEL_API_URL!;
const BYPASS_TOKEN = process.env.VERCEL_PROTECTION_BYPASS!;

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paywall enforcement for article pages via proxy
  if (pathname.startsWith("/articles/")) {
    const token = request.cookies.get("subscription-token")?.value;

    // Create response with request headers to pass subscription status to the page
    const requestHeaders = new Headers(request.headers);

    if (!token) {
      requestHeaders.set("x-subscription-status", "inactive");
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Verify subscription status with API before returning the response
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
          requestHeaders.set("x-subscription-status", "active");
          return NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
        }
      }
    } catch (error) {
      console.error("Proxy: Subscription verification failed:", error);
    }

    // Not subscribed or error - mark as inactive
    requestHeaders.set("x-subscription-status", "inactive");
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/articles/:path*"],
};
