import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("subscription-token")?.value;
  const requestHeaders = new Headers(request.headers);

  if (token) {
    requestHeaders.set("x-subscription-token", token);
  } else {
    requestHeaders.delete("x-subscription-token");
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
