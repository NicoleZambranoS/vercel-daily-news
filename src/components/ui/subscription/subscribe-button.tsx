"use client";

import { useSubscription } from "./subscription-provider";

type SubscribeButtonProps = {
  className?: string;
};

export default function SubscribeButton({ className }: SubscribeButtonProps) {
  const { handleSubscribe, error, isPending } = useSubscription();

  return (
    <div>
      <button
        className={
          className ??
          "inline-flex items-center px-5 py-3 rounded-xl text-sm font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        }
        onClick={handleSubscribe}
        disabled={isPending}
      >
        {isPending ? "Subscribing..." : "Subscribe"}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
