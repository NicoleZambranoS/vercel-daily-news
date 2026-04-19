"use server";

import { cookies } from "next/headers";
import { fetchApi } from "@/lib/fetch";
import { Subscription } from "@/types/subscription";

export type ActionState = {
  success: boolean;
  error?: string;
} | null;

export async function subscribeAction(): Promise<ActionState> {
  try {
    const subscription = await fetchApi<Subscription>("/subscription/create", {
      method: "POST",
    });

    const cookieStore = await cookies();
    cookieStore.set("subscription-token", subscription.data.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return { success: true };
  } catch (error) {
    console.error("Subscribe failed:", error);
    return { success: false, error: "Failed to subscribe. Please try again." };
  }
}

export async function unsubscribeAction(): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("subscription-token")?.value;

  if (!token) {
    return { success: false, error: "No active subscription found." };
  }

  try {
    await fetchApi<void>("/subscription", {
      method: "DELETE",
      headers: { "x-subscription-token": token },
    });

    cookieStore.delete("subscription-token");
    return { success: true };
  } catch (error) {
    console.error("Unsubscribe failed:", error);
    return {
      success: false,
      error: "Failed to unsubscribe. Please try again.",
    };
  }
}
