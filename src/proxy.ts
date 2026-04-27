import { type NextRequest, NextResponse } from "next/server";
export function proxy(request: NextRequest) {
  const token = request.cookies.get("subscription-token")?.value;
  const requestHeaders = new Headers(request.headers);

  if (token) {
    requestHeaders.set("x-subscription-token", token);
    requestHeaders.set("x-subscription-status", "active");
  } else {
    requestHeaders.delete("x-subscription-token");
    requestHeaders.set("x-subscription-status", "inactive");
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
