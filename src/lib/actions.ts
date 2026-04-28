"use server";

import { cookies } from "next/headers";
import { fetchApi } from "@/lib/fetch";
import type { Subscription } from "@/types/subscription";
import {
  SUBSCRIPTION_COOKIE,
  COOKIE_OPTIONS,
  HEADER_TOKEN,
} from "@/lib/subscription";

export async function subscribe() {
  const cookieStore = await cookies();
  let token = cookieStore.get(SUBSCRIPTION_COOKIE)?.value;

  if (!token) {
    const { data } = await fetchApi<Subscription>("/subscription/create", {
      method: "POST",
    });
    token = data.token;
    cookieStore.set(SUBSCRIPTION_COOKIE, token, COOKIE_OPTIONS);
  }

  // Activate the subscription
  await fetchApi<Subscription>("/subscription", {
    method: "POST",
    headers: { [HEADER_TOKEN]: token },
  });
  // Client-side router.refresh() triggers proxy to re-verify
}

export async function unsubscribe() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SUBSCRIPTION_COOKIE)?.value;

  if (token) {
    await fetchApi<void>("/subscription", {
      method: "DELETE",
      headers: { [HEADER_TOKEN]: token },
    });
  }
}
