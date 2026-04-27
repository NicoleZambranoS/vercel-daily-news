"use server";

import { cookies } from "next/headers";
import { after } from "next/server";
import { fetchApi } from "@/lib/fetch";
import type { Subscription } from "@/types/subscription";

const COOKIE_NAME = "subscription-token";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24,
  path: "/",
};

export async function createToken(): Promise<string | null> {
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

export async function subscribe(prefetchedToken: string | null): Promise<void> {
  const cookieStore = await cookies();

  let token = prefetchedToken;

  if (!token) {
    token = await createToken();
  }

  if (!token) return;

  await fetchApi<Subscription>("/subscription", {
    method: "POST",
    headers: { "x-subscription-token": token },
  });

  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export async function unsubscribe(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return;

  cookieStore.delete(COOKIE_NAME);

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
