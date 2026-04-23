"use client";

import { useEffect } from "react";
import SubmitButton from "@/components/ui/subscription/submit-button";
import { startPrefetch } from "@/lib/subscription-store";

type SubscriptionToggleProps = {
  subscribed: boolean;
};

export default function SubscriptionToggle({
  subscribed,
}: SubscriptionToggleProps) {
  // Pre-fetch a subscription token in the background for non-subscribers
  useEffect(() => {
    if (!subscribed) startPrefetch();
  }, [subscribed]);

  return (
    <div className="flex items-center gap-2">
      {subscribed && (
        <span className="hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white">
          Subscribed
        </span>
      )}
      <SubmitButton
        subscribed={subscribed}
        className={
          subscribed
            ? "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-black transition-colors"
            : "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity"
        }
      />
    </div>
  );
}
