import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hasSubscription = request.cookies.has("subscription-token");

  // Pass access level to downstream pages via request header.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-subscription-access",
    hasSubscription ? "full" : "preview",
  );

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
