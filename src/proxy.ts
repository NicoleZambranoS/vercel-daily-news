import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hasSubscription = request.cookies.has("subscription-token");
  const { pathname } = request.nextUrl;

  if (/^\/articles\/[^/]+$/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.searchParams.set("access", hasSubscription ? "full" : "preview");
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
