"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { prefetch, getToken, reset } from "@/lib/subscription-store";
import { subscribeAction, unsubscribeAction } from "@/lib/actions";

type SubscriptionToggleProps = {
  subscribed: boolean;
};

export default function SubscriptionToggle({
  subscribed,
}: SubscriptionToggleProps) {
  const router = useRouter();

  useEffect(() => {
    if (!subscribed) prefetch();
  }, [subscribed]);

  async function handleToggle() {
    if (subscribed) {
      await unsubscribeAction();
      reset();
    } else {
      const token = await getToken();
      if (!token) return;
      await subscribeAction(token);
    }
    router.refresh();
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
            ? "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-black transition-colors cursor-pointer"
            : "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity cursor-pointer"
        }
        onClick={handleToggle}
      >
        {subscribed ? "Unsubscribe" : "Subscribe"}
      </button>
    </div>
  );
}
