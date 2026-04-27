"use server";

import { cookies } from "next/headers";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/fetch";
import type { Subscription } from "@/types/subscription";

const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  maxAge: 60 * 60 * 24,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

// Called silently on mount — returns a pre-created token held in client state.
// Does NOT touch cookies so no re-renders are triggered.
export async function prepareTokenAction(): Promise<string | null> {
  try {
    const { data } = await fetchApi<Subscription>("/subscription/create", {
      method: "POST",
    });
    return data.token;
  } catch {
    return null;
  }
}

// token comes from prepareTokenAction; falls back to creating one if null.
export async function subscribeAction(token: string | null): Promise<void> {
  const cookieStore = await cookies();

  if (!token) {
    const { data } = await fetchApi<Subscription>("/subscription/create", {
      method: "POST",
    });
    token = data.token;
  }

  cookieStore.set("subscription-token", token, COOKIE_OPTIONS);

  await fetchApi<Subscription>("/subscription", {
    method: "POST",
    headers: { "x-subscription-token": token },
  });

  revalidatePath("/", "layout");
}

export async function unsubscribeAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("subscription-token")?.value;

  if (!token) return;

  cookieStore.delete("subscription-token");

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

  revalidatePath("/", "layout");
}
