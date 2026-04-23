"use server";

import { after } from "next/server";
import { fetchApi } from "@/lib/fetch";
import { Subscription } from "@/types/subscription";

export type ActionState = {
  success: boolean;
  error?: string;
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
 * Validates a subscription token.
 */
export async function subscribeAction(token: string): Promise<ActionState> {
  if (!token) return { success: false, error: "Missing token." };
  return { success: true };
}

/**
 * Cleans up the subscription on the API in the background.
 */
export async function unsubscribeAction(token: string): Promise<ActionState> {
  if (!token) return { success: false, error: "Missing token." };

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
