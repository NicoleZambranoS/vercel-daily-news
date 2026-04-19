"use client";

import {
  subscribeAction,
  unsubscribeAction,
  type ActionState,
} from "@/lib/actions";
import { X, Sparkles, Check, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { createPortal } from "react-dom";

type SubscriptionModalProps = {
  onClose: () => void;
  subscribed: boolean;
};

export function SubscriptionModal({
  onClose,
  subscribed,
}: SubscriptionModalProps) {
  const action = subscribed ? unsubscribeAction : subscribeAction;
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    null,
  );

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={isPending ? undefined : onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-10 relative animate-in fade-in zoom-in duration-300 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isPending}
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

        {state?.error && (
          <p className="text-sm text-red-600 text-center mb-4">{state.error}</p>
        )}

        <form action={formAction}>
          <button
            type="submit"
            disabled={isPending}
            className="btn-gradient w-full justify-center disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>{subscribed ? "Unsubscribing…" : "Subscribing…"}</span>
              </>
            ) : (
              <span>{subscribed ? "Unsubscribe" : "Subscribe Now"}</span>
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
