import { cookies } from "next/headers";

export const SUBSCRIPTION_COOKIE = "daily-news-subscription";

export async function isSubscribed(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SUBSCRIPTION_COOKIE)?.value === "true";
}
