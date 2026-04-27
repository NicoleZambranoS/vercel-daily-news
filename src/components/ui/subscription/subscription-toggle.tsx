"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { prepareTokenAction, subscribeAction, unsubscribeAction } from "@/lib/actions";

type SubscriptionToggleProps = {
  subscribed: boolean;
};

export default function SubscriptionToggle({
  subscribed,
}: SubscriptionToggleProps) {
  const [isPending, setIsPending] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!subscribed) prepareTokenAction().then(setPendingToken);
  }, [subscribed]);

  async function handleToggle() {
    setIsPending(true);
    try {
      if (subscribed) {
        await unsubscribeAction();
      } else {
        await subscribeAction(pendingToken);
      }
      router.refresh();
    } finally {
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
