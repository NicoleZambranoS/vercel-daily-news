"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { prefetch, getToken, reset } from "@/lib/subscription-store";
import { subscribeAction, unsubscribeAction } from "@/lib/actions";

type SubscriptionToggleProps = {
  subscribed: boolean;
};

export default function SubscriptionToggle({
  subscribed,
}: SubscriptionToggleProps) {
  const [isPending, setIsPending] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!subscribed) prefetch();
  }, [subscribed]);

  async function handleToggle() {
    setIsPending(true);
    try {
      if (subscribed) {
        await unsubscribeAction(pathname);
      } else {
        const token = await getToken();
        if (!token) {
          setIsPending(false);
          return;
        }
        reset();
        await subscribeAction(token, pathname);
      }
    } catch {
      setIsPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {subscribed && (
        <span className="hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white">
          Subscribed
        </span>
      )}
      <button
        className={
          subscribed
            ? "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            : "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        }
        onClick={handleToggle}
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending
          ? subscribed
            ? "Unsubscribing…"
            : "Subscribing…"
          : subscribed
            ? "Unsubscribe"
            : "Subscribe"}
      </button>
    </div>
  );
}
