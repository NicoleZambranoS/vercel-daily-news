import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hasSubscription = request.cookies.has("subscription-token");
  const url = request.nextUrl.clone();

  url.searchParams.set("access", hasSubscription ? "full" : "preview");
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/articles/:path*"],
};
