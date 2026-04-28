import { cookies } from "next/headers";

// Cookie names
export const SUBSCRIPTION_COOKIE = "subscription-token";
export const PREFETCH_COOKIE = "prefetch-token";

// Header names
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
  return !!cookieStore.get(SUBSCRIPTION_COOKIE)?.value;
}
