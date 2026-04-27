import { type NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/fetch";
import type { Subscription } from "@/types/subscription";
import {
  SUBSCRIPTION_COOKIE,
  PREFETCH_COOKIE,
  COOKIE_OPTIONS,
  HEADER_TOKEN,
  HEADER_STATUS,
} from "@/lib/subscription";

function forward(requestHeaders: Headers) {
  return NextResponse.next({ request: { headers: requestHeaders } });
}

async function validateSubscription(
  token: string,
  requestHeaders: Headers,
): Promise<NextResponse> {
  try {
    const { data } = await fetchApi<Subscription>("/subscription", {
      headers: { [HEADER_TOKEN]: token },
    });

    if (data?.status === "active") {
      requestHeaders.set(HEADER_TOKEN, token);
      requestHeaders.set(HEADER_STATUS, "active");
      return forward(requestHeaders);
    }
  } catch {
    // Token invalid or expired
  }

  requestHeaders.set(HEADER_TOKEN, token);
  requestHeaders.set(HEADER_STATUS, "inactive");
  const response = forward(requestHeaders);
  response.cookies.delete(SUBSCRIPTION_COOKIE);
  return response;
}

async function prefetchToken(
  request: NextRequest,
  requestHeaders: Headers,
): Promise<NextResponse> {
  requestHeaders.delete(HEADER_TOKEN);
  requestHeaders.set(HEADER_STATUS, "inactive");

  if (request.cookies.get(PREFETCH_COOKIE)?.value) {
    return forward(requestHeaders);
  }

  try {
    const { data } = await fetchApi<Subscription>("/subscription/create", {
      method: "POST",
    });
    const response = forward(requestHeaders);
    response.cookies.set(PREFETCH_COOKIE, data.token, COOKIE_OPTIONS);
    return response;
  } catch {
    return forward(requestHeaders);
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SUBSCRIPTION_COOKIE)?.value;
  const requestHeaders = new Headers(request.headers);

  if (token) {
    return validateSubscription(token, requestHeaders);
  }

  return prefetchToken(request, requestHeaders);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
