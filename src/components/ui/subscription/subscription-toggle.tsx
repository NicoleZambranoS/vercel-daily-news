"use client";

import { useRouter } from "next/navigation";
import { subscribe, unsubscribe } from "@/lib/actions";
import { useSubscription } from "./subscription-provider";

type SubscriptionToggleProps = {
  isSubscribed: boolean;
};

export default function SubscriptionToggle({
  isSubscribed,
}: SubscriptionToggleProps) {
  const router = useRouter();
  const { tokenRef, isPending, startTransition } = useSubscription();

  function handleToggle() {
    startTransition(async () => {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe(tokenRef.current ?? null);
        tokenRef.current = null;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
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
        onClick={handleToggle}
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
