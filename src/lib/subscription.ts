import { headers } from "next/headers";

// Cookie name — single cookie for the subscription token
export const SUBSCRIPTION_COOKIE = "subscription-token";

// Header names set by the proxy
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
  const headersList = await headers();
  return headersList.get(HEADER_STATUS) === "active";
}
