"use server";

import { cookies } from "next/headers";
import { after } from "next/server";
import { fetchApi } from "@/lib/fetch";
import type { Subscription } from "@/types/subscription";
import {
  SUBSCRIPTION_COOKIE,
  PREFETCH_COOKIE,
  COOKIE_OPTIONS,
  HEADER_TOKEN,
} from "@/lib/subscription";

async function createToken(): Promise<string | null> {
  try {
    const { data: created } = await fetchApi<Subscription>(
      "/subscription/create",
      { method: "POST" },
    );
    return created.token;
  } catch {
    return null;
  }
}

export async function subscribe(): Promise<{ error?: string }> {
  const cookieStore = await cookies();

  // Use the token prefetched by the proxy, fall back to creating one on the fly
  let token = cookieStore.get(PREFETCH_COOKIE)?.value;

  if (!token) {
    token = (await createToken()) ?? undefined;
  }

  if (!token)
    return { error: "Unable to create subscription. Please try again." };

  try {
    await fetchApi<Subscription>("/subscription", {
      method: "POST",
      headers: { [HEADER_TOKEN]: token },
    });
  } catch {
    return { error: "Subscription failed. Please try again." };
  }

  cookieStore.set(SUBSCRIPTION_COOKIE, token, COOKIE_OPTIONS);
  cookieStore.delete(PREFETCH_COOKIE);
  return {};
}

export async function unsubscribe(): Promise<{ error?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SUBSCRIPTION_COOKIE)?.value;

  if (!token) return { error: "No active subscription found." };

  cookieStore.delete(SUBSCRIPTION_COOKIE);

  const prefetch = await createToken();
  if (prefetch) {
    cookieStore.set(PREFETCH_COOKIE, prefetch, COOKIE_OPTIONS);
  }

  after(async () => {
    try {
      await fetchApi<void>("/subscription", {
        method: "DELETE",
        headers: { [HEADER_TOKEN]: token },
      });
    } catch (error) {
      console.error("Background unsubscribe failed:", error);
    }
  });

  return {};
}
