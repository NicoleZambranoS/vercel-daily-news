import { NextResponse } from "next/server";
import { fetchApi } from "@/lib/fetch";
import { Subscription } from "@/types/subscription";

/**
 * Pre-creates a subscription in the background and returns the token.
 * The token is stored client-side and used later when the user clicks "Subscribe".
 */
export async function POST() {
  try {
    const subscription = await fetchApi<Subscription>("/subscription/create", {
      method: "POST",
    });

    return NextResponse.json({ token: subscription.data.token });
  } catch (error) {
    console.error("Subscription prepare failed:", error);
    return NextResponse.json(
      { token: null, error: "api-error" },
      { status: 500 },
    );
  }
}
