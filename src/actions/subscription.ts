"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SUBSCRIPTION_COOKIE } from "@/lib/subscription";

export async function subscribe() {
  const cookieStore = await cookies();
  cookieStore.set(SUBSCRIPTION_COOKIE, "true", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  revalidatePath("/", "layout");
}

export async function unsubscribe() {
  const cookieStore = await cookies();
  cookieStore.delete(SUBSCRIPTION_COOKIE);
  revalidatePath("/", "layout");
}
