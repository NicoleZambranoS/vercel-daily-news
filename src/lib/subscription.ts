import { headers } from "next/headers";
import { verifySubscription } from "@/lib/api";

// Cookie name — single cookie for the subscription token
export const SUBSCRIPTION_COOKIE = "subscription-token";

// Cookie set by the subscribe action so the proxy can skip verification on the immediate router.refresh() after activation.
export const SUBSCRIPTION_ACTIVE_COOKIE = "subscription-active";

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

  // Proxy already determined status from cookie signals
  const status = headersList.get(HEADER_STATUS);
  if (status === "active") return true;
  if (status === "inactive") return false;

  // During a server action's RSC re-render the proxy headers are stale
  // (they reflect the pre-mutation request). Skip the slow verifySubscription()
  // call — the router.refresh() that follows will fetch the correct state
  // through the proxy with updated cookies.
  if (headersList.get("next-action")) return false;

  const token = headersList.get(HEADER_TOKEN);
  if (!token) return false;

  return verifySubscription(token);
}
