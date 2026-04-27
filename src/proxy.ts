import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.VERCEL_API_URL!;
const BYPASS_TOKEN = process.env.VERCEL_PROTECTION_BYPASS!;

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("subscription-token")?.value;

  // No subscription cookie — pass the request through unchanged.
  if (!token) {
    return NextResponse.next();
  }

  // On article pages verify the token against the API so a manually set
  // cookie cannot bypass the paywall. Other pages (home, search) just get
  // the header injected — no verification needed there.
  if (request.nextUrl.pathname.startsWith("/articles/")) {
    return verifyAndContinue(request, token);
  }

  // Non-article pages just inject the header.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-subscription-token", token);
  return NextResponse.next({ request: { headers: requestHeaders } });
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
      const { success, data } = await res.json();
      if (success && data.status === "active") {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-subscription-token", token);
        return NextResponse.next({ request: { headers: requestHeaders } });
      }
    }
  } catch (error) {
    console.error("Proxy: subscription verification failed:", error);
  }

  // Invalid token — remove it so the paywall shows the teaser.
  const response = NextResponse.next();
  response.cookies.delete("subscription-token");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
