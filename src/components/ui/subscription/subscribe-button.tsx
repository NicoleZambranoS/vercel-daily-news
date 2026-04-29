"use client";

import { useState } from "react";
import { subscribe } from "@/lib/actions";

type SubscribeButtonProps = {
  className?: string;
};

export default function SubscribeButton({ className }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setError(null);
    setLoading(true);
    const result = await subscribe();
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    // Full reload to trigger a fresh GET through the proxy with the
    // updated cookies. router.refresh() can't be used reliably until
    // Next.js 16.3.0 ships the fix for vercel/next.js#86055.
    window.location.reload();
  };

  return (
    <div>
      <button
        className={
          className ??
          "inline-flex items-center px-5 py-3 rounded-xl text-sm font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        }
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
