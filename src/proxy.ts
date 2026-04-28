import { type NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/fetch";
import type { Subscription } from "@/types/subscription";
import {
  SUBSCRIPTION_COOKIE,
  COOKIE_OPTIONS,
  HEADER_TOKEN,
  HEADER_STATUS,
} from "@/lib/subscription";

function forward(requestHeaders: Headers) {
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const token = request.cookies.get(SUBSCRIPTION_COOKIE)?.value;

  // No token — prefetch one
  if (!token) {
    requestHeaders.set(HEADER_STATUS, "inactive");

    try {
      const { data } = await fetchApi<Subscription>("/subscription/create", {
        method: "POST",
      });
      const response = forward(requestHeaders);
      response.cookies.set(SUBSCRIPTION_COOKIE, data.token, COOKIE_OPTIONS);
      return response;
    } catch {
      return forward(requestHeaders);
    }
  }

  // Verify existing subscription (access control)
  try {
    const { data } = await fetchApi<Subscription>("/subscription", {
      headers: { [HEADER_TOKEN]: token },
    });

    requestHeaders.set(
      HEADER_STATUS,
      data?.status === "active" ? "active" : "inactive",
    );
    return forward(requestHeaders);
  } catch {
    // Token is invalid/tampered — delete it and prefetch a valid one
    requestHeaders.set(HEADER_STATUS, "inactive");
    const response = forward(requestHeaders);
    response.cookies.delete(SUBSCRIPTION_COOKIE);

    try {
      const { data } = await fetchApi<Subscription>("/subscription/create", {
        method: "POST",
      });
      response.cookies.set(SUBSCRIPTION_COOKIE, data.token, COOKIE_OPTIONS);
    } catch {
      // Prefetch failed — next request will retry
    }

    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
