import { cookies, headers } from "next/headers";

// Cookie names
export const SUBSCRIPTION_COOKIE = "subscription-token";
export const PREFETCH_COOKIE = "prefetch-token";

// Proxy-forwarded header names
export const HEADER_TOKEN = "x-subscription-token";
export const HEADER_STATUS = "x-subscription-status";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24,
  path: "/",
};

export async function getSubscriptionStatus(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SUBSCRIPTION_COOKIE)?.value;

  const headersList = await headers();
  const proxyToken = headersList.get(HEADER_TOKEN);
  const proxyStatus = headersList.get(HEADER_STATUS);

  if (proxyStatus && (proxyToken ?? undefined) === token) {
    return proxyStatus === "active";
  }

  return !!token;
}
