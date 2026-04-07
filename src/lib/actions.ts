"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types/api";
import { Subscription } from "@/types/subscription";

const BASE_URL = process.env.VERCEL_API_URL!;
const BYPASS_TOKEN = process.env.VERCEL_PROTECTION_BYPASS!;

export type ActionState = {
  success: boolean;
  error?: string;
} | null;

async function fetchApi<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "x-vercel-protection-bypass": BYPASS_TOKEN,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

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

    revalidatePath("/articles/[slug]", "page");
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
    revalidatePath("/articles/[slug]", "page");
    return { success: true };
  } catch (error) {
    console.error("Unsubscribe failed:", error);
    return {
      success: false,
      error: "Failed to unsubscribe. Please try again.",
    };
  }
}
