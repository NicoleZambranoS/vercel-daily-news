"use client";

import { subscribeAction, unsubscribeAction } from "@/lib/actions";
import {
  getToken,
  getTokenPromise,
  clearStore,
  startPrefetch,
} from "@/lib/subscription-store";
import { X, Sparkles, Check, Loader2 } from "lucide-react";
import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type SubscriptionModalProps = {
  onClose: () => void;
  subscribed: boolean;
};

export function SubscriptionModal({
  onClose,
  subscribed,
}: SubscriptionModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const refreshing = useRef(false);

  useEffect(() => {
    if (!isPending && refreshing.current) {
      refreshing.current = false;
      onClose();
    }
  }, [isPending, onClose]);

  async function handleSubmit() {
    setIsLoading(true);
    setError(null);

    if (subscribed) {
      const result = await unsubscribeAction();
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        setIsLoading(false);
        return;
      }
      clearStore();
    } else {
      let token = getToken();
      if (!token) token = await getTokenPromise();
      if (!token) {
        clearStore();
        token = await startPrefetch();
      }
      if (!token) {
        setError("Couldn't prepare subscription. Please try again.");
        setIsLoading(false);
        return;
      }

      const result = await subscribeAction(token);
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        setIsLoading(false);
        return;
      }
    }

    refreshing.current = true;
    startTransition(() => router.refresh());
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={isLoading ? undefined : onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-10 relative animate-in fade-in zoom-in duration-300 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-purple-600 to-blue-600 rounded-2xl mb-6 relative overflow-hidden">
            <Sparkles className="w-10 h-10 text-white relative z-10" />
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
          <h2 className="text-4xl font-semibold mb-3 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {subscribed
              ? "Unsubscribe from Vercel Daily Pro"
              : "Subscribe to Vercel Daily Pro"}
          </h2>
          <p className="text-gray-600 text-lg">
            {subscribed
              ? "You will no longer have access to premium content"
              : "Subscribe to Vercel Daily Pro and get exclusive access to premium content"}
          </p>
        </div>

        <div className="space-y-3 mb-10">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-linear-to-r from-purple-50 to-blue-50 border border-purple-100">
            <div className="shrink-0 w-6 h-6 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mt-0.5">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-gray-900">
                Unlimited Premium Articles
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Access all premium content including deep dives and technical
                guides
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center mb-4">{error}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="btn-gradient w-full justify-center disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>{subscribed ? "Unsubscribing…" : "Subscribing…"}</span>
            </>
          ) : (
            <span>{subscribed ? "Unsubscribe" : "Subscribe Now"}</span>
          )}
        </button>
      </div>
    </div>,
    document.body,
  );
}
