"use server";

import { cookies } from "next/headers";
import { fetchApi } from "@/lib/fetch";
import { Subscription } from "@/types/subscription";

export type ActionState = {
  success: boolean;
  error?: string;
};

const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24,
  sameSite: "lax" as const,
};

// Create and activate a new subscription in background
export async function prepareSubscription(): Promise<string | null> {
  try {
    const subscription = await fetchApi<Subscription>("/subscription/create", {
      method: "POST",
    });
    const token = subscription.data.token;

    await fetchApi<Subscription>("/subscription", {
      method: "POST",
      headers: { "x-subscription-token": token },
    });

    return token;
  } catch {
    return null;
  }
}

export async function subscribeAction(token: string): Promise<ActionState> {
  if (!token) return { success: false, error: "Missing token." };

  const cookieStore = await cookies();
  cookieStore.set("subscription-token", token, COOKIE_OPTIONS);
  return { success: true };
}

export async function unsubscribeAction(): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("subscription-token")?.value;

  if (!token) {
    return { success: false, error: "No active subscription found." };
  }

  await fetchApi<void>("/subscription", {
    method: "DELETE",
    headers: { "x-subscription-token": token },
  });

  cookieStore.delete("subscription-token");
  return { success: true };
}
