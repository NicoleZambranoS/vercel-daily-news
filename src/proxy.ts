import { type NextRequest, NextResponse } from "next/server";
import {
  SUBSCRIPTION_COOKIE,
  SUBSCRIPTION_ACTIVE_COOKIE,
  HEADER_TOKEN,
  HEADER_STATUS,
} from "@/lib/subscription";

function forward(requestHeaders: Headers) {
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const token = request.cookies.get(SUBSCRIPTION_COOKIE)?.value;

  // User is not subscribed
  if (!token) {
    requestHeaders.set(HEADER_STATUS, "inactive");
    return forward(requestHeaders);
  }

  // Just activated by the subscribe action
  const activationSignal = request.cookies.get(
    SUBSCRIPTION_ACTIVE_COOKIE,
  )?.value;
  if (activationSignal && activationSignal === token) {
    requestHeaders.set(HEADER_STATUS, "active");
    return forward(requestHeaders);
  }

  // Set the token header so the API can verify the subscription
  requestHeaders.set(HEADER_TOKEN, token);
  return forward(requestHeaders);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
