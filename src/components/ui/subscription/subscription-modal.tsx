"use client";

import { subscribeAction, unsubscribeAction } from "@/lib/actions";
import { getToken, reset } from "@/lib/subscription-store";
import { X, Sparkles, Check, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";

type ModalStatus = "idle" | "loading" | "success";

type SubscriptionModalProps = {
  onClose: () => void;
  subscribed: boolean;
};

export function SubscriptionModal({
  onClose,
  subscribed,
}: SubscriptionModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ModalStatus>("idle");
  const [isPending, startTransition] = useTransition();

  // Close once the RSC refresh has landed.
  // `status` is set outside startTransition so it commits eagerly.
  // Safety timeout ensures the modal closes even if the transition stalls.
  useEffect(() => {
    if (status !== "success") return;

    if (!isPending) {
      onClose();
      return;
    }

    const timeout = setTimeout(onClose, 3000);
    return () => clearTimeout(timeout);
  }, [status, isPending, onClose]);

  const busy = status === "loading" || (status === "success" && isPending);

  async function handleSubmit() {
    setStatus("loading");
    setError(null);

    try {
      if (subscribed) {
        const result = await unsubscribeAction();
        if (!result.success) {
          setError(result.error ?? "Failed to unsubscribe. Please try again.");
          setStatus("idle");
          return;
        }
        reset();
      } else {
        let token = await getToken();
        if (!token) {
          reset();
          token = await getToken();
        }
        if (!token) {
          setError("Couldn't subscribe. Please try again.");
          setStatus("idle");
          return;
        }

        const result = await subscribeAction(token);
        if (!result.success) {
          setError(result.error ?? "Failed to subscribe. Please try again.");
          setStatus("idle");
          return;
        }
      }

      // Cookie is set. Signal success eagerly (outside the transition)
      // then kick off the RSC refresh inside a transition to avoid
      // Suspense fallback flashes. The effect above closes the modal
      // once isPending settles to false.
      setStatus("success");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={busy ? undefined : onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-10 relative animate-in fade-in zoom-in duration-300 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={busy}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-semibold mb-2 text-gray-900">
              {subscribed
                ? "You've unsubscribed"
                : "Welcome to Vercel Daily Pro!"}
            </h2>
            <p className="text-gray-500">
              {subscribed
                ? "Your access has been removed."
                : "You now have full access to all content."}
            </p>
          </div>
        ) : (
          <>
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
                    Access all premium content including deep dives and
                    technical guides
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
              disabled={busy}
              className="btn-gradient w-full justify-center disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>{subscribed ? "Unsubscribing…" : "Subscribing…"}</span>
                </>
              ) : (
                <span>{subscribed ? "Unsubscribe" : "Subscribe Now"}</span>
              )}
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
