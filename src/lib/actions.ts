"use server";

import { cookies } from "next/headers";
import { after } from "next/server";
import { fetchApi } from "@/lib/fetch";
import { Subscription } from "@/types/subscription";

export type ActionState = {
  success: boolean;
  error?: string;
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

/**
 * Pre-creates a subscription via the API and returns the token.
 */
export async function prepareSubscription(): Promise<string | null> {
  try {
    const subscription = await fetchApi<Subscription>("/subscription/create", {
      method: "POST",
    });
    return subscription.data.token;
  } catch {
    return null;
  }
}

/**
 * Sets the subscription cookie with a pre-fetched token, instant, no API call.
 */
export async function subscribeAction(token: string): Promise<ActionState> {
  const cookieStore = await cookies();
  cookieStore.set("subscription-token", token, COOKIE_OPTIONS);
  return { success: true };
}

/**
 * Deletes the subscription cookie and cleans up via the API in the background.
 */
export async function unsubscribeAction(): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("subscription-token")?.value;

  if (!token) {
    return { success: false, error: "No active subscription found." };
  }

  cookieStore.delete("subscription-token");

  after(async () => {
    try {
      await fetchApi<void>("/subscription", {
        method: "DELETE",
        headers: { "x-subscription-token": token },
      });
    } catch (error) {
      console.error("Background unsubscribe cleanup failed:", error);
    }
  });

  return { success: true };
}
