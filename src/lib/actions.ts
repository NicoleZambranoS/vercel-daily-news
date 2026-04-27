"use server";

import { cookies } from "next/headers";
import { after } from "next/server";
import { fetchApi } from "@/lib/fetch";
import type { Subscription } from "@/types/subscription";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  error?: string;
};

const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24,
  sameSite: "lax" as const,
};

export async function prepareSubscription(): Promise<string | null> {
  try {
    const { data } = await fetchApi<Subscription>("/subscription/create", {
      method: "POST",
    });
    const token = data.token;

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
  const cookieStore = await cookies();
  cookieStore.set("subscription-token", token, COOKIE_OPTIONS);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function unsubscribeAction(): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("subscription-token")?.value;

  if (!token) {
    return { success: false, error: "No active subscription found." };
  }

  cookieStore.delete("subscription-token");
  revalidatePath("/", "layout");

  after(async () => {
    try {
      await fetchApi<void>("/subscription", {
        method: "DELETE",
        headers: { "x-subscription-token": token },
      });
    } catch (error) {
      console.error("Background unsubscribe failed:", error);
    }
  });

  return { success: true };
}
