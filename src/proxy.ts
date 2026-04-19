import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hasSubscription = request.cookies.has("subscription-token");
  const requestHeaders = new Headers(request.headers);

  // Set subscription status header to downstream components
  requestHeaders.set(
    "x-subscription-status",
    hasSubscription ? "active" : "inactive",
  );

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/articles/:path*"],
};
