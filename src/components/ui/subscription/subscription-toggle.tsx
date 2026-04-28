"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { subscribe, unsubscribe, prepareSubscription } from "@/lib/actions";

type SubscriptionToggleProps = {
  isSubscribed: boolean;
};

export default function SubscriptionToggle({
  isSubscribed,
}: SubscriptionToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Pre-create a subscription token in the background so it's ready when the user clicks subscribe.
  useEffect(() => {
    if (!isSubscribed) {
      prepareSubscription();
    }
  }, [isSubscribed]);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = isSubscribed ? await unsubscribe() : await subscribe();

      if (result.error) {
        setError(result.error);
        return;
      }

      setTimeout(() => router.refresh(), 0);
    });
  };

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-600">{error}</span>}
      {isSubscribed && (
        <span className="hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white">
          Subscribed
        </span>
      )}
      <button
        className={
          isSubscribed
            ? "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            : "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        }
        onClick={handleClick}
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending
          ? isSubscribed
            ? "Unsubscribing..."
            : "Subscribing..."
          : isSubscribed
            ? "Unsubscribe"
            : "Subscribe"}
      </button>
    </div>
  );
}
