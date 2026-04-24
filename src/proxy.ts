import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/articles/")) {
    const hasSubscription = request.cookies.has("subscription-token");
    const url = request.nextUrl.clone();
    url.searchParams.set("access", hasSubscription ? "full" : "preview");

    const response = NextResponse.rewrite(url);
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
