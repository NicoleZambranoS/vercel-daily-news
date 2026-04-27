"use server";

import { cookies } from "next/headers";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { fetchApi } from "@/lib/fetch";
import type { Subscription } from "@/types/subscription";

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

export async function subscribeAction(
  token: string,
  pathname: string,
): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.set("subscription-token", token, COOKIE_OPTIONS);
  redirect(pathname);
}

export async function unsubscribeAction(pathname: string): Promise<never> {
  const cookieStore = await cookies();
  const token = cookieStore.get("subscription-token")?.value;

  if (token) {
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
  }

  redirect(pathname);
}
