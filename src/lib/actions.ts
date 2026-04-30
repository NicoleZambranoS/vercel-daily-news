"use server";

import { cookies } from "next/headers";
import { after } from "next/server";
import { fetchApi } from "@/lib/fetch";
import type { Subscription } from "@/types/subscription";
import {
  SUBSCRIPTION_COOKIE,
  SUBSCRIPTION_ACTIVE_COOKIE,
  COOKIE_OPTIONS,
  HEADER_TOKEN,
} from "@/lib/subscription";
import { verifySubscription } from "@/lib/api";

export async function prepareSubscription() {
  const cookieStore = await cookies();
  if (cookieStore.get(SUBSCRIPTION_COOKIE)?.value) return;

  try {
    const { data } = await fetchApi<Subscription>("/subscription/create", {
      method: "POST",
    });
    cookieStore.set(SUBSCRIPTION_COOKIE, data.token, COOKIE_OPTIONS);
  } catch {
    // Silently fail, subscribe() will retry
  }
}

type ActionResult = { error?: string };

export async function subscribe(): Promise<ActionResult> {
  const cookieStore = await cookies();
  let token = cookieStore.get(SUBSCRIPTION_COOKIE)?.value;

  // Create token if not already created
  if (!token) {
    try {
      const { data } = await fetchApi<Subscription>("/subscription/create", {
        method: "POST",
      });
      token = data.token;
      cookieStore.set(SUBSCRIPTION_COOKIE, token, COOKIE_OPTIONS);
    } catch {
      return { error: "Unable to subscribe right now. Please try again." };
    }
  }

  // Set the active cookie so the proxy can skip verification on the immediate router.refresh() after activation.
  cookieStore.set(SUBSCRIPTION_ACTIVE_COOKIE, token, {
    ...COOKIE_OPTIONS,
    maxAge: 5,
  });

  // Activate the subscription behind the scenes
  const tokenToActivate = token;
  after(async () => {
    try {
      await fetchApi<Subscription>("/subscription", {
        method: "POST",
        headers: { [HEADER_TOKEN]: tokenToActivate },
      });
      await verifySubscription(tokenToActivate);
    } catch {
      // Silently fail
    }
  });

  return {};
}

export async function unsubscribe(): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SUBSCRIPTION_COOKIE)?.value;

  if (token) {
    cookieStore.delete(SUBSCRIPTION_COOKIE);
    cookieStore.delete(SUBSCRIPTION_ACTIVE_COOKIE);

    // Delete the subscription behind the scenes
    after(async () => {
      try {
        await fetchApi<void>("/subscription", {
          method: "DELETE",
          headers: { [HEADER_TOKEN]: token },
        });
      } catch {
        // Silently fail
      }
    });
  }

  return {};
}
