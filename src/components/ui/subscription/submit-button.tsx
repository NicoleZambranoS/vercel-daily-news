"use client";

import clsx from "clsx";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { subscribeAction, unsubscribeAction } from "@/lib/actions";
import { getToken, reset } from "@/lib/subscription-store";
import { SubscriptionModal } from "./subscription-modal";

type SubmitButtonProps = {
  subscribed?: boolean;
  className?: string;
};

export default function SubmitButton({
  subscribed = false,
  className,
}: SubmitButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleAction() {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1 — run the server action (sets/deletes the cookie).
      if (subscribed) {
        const result = await unsubscribeAction();
        if (!result.success) {
          setError(result.error ?? "Failed to unsubscribe. Please try again.");
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
          return;
        }

        const result = await subscribeAction(token);
        if (!result.success) {
          setError(result.error ?? "Failed to subscribe. Please try again.");
          return;
        }
      }

      setShowModal(false);

      // Refresh the RSC in its own isolated transition.
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        className={clsx("cursor-pointer", className)}
        onClick={() => {
          setShowModal(true);
          setError(null);
        }}
      >
        {subscribed ? "Unsubscribe" : "Subscribe"}
      </button>
      {showModal && (
        <SubscriptionModal
          onClose={() => setShowModal(false)}
          onAction={handleAction}
          isPending={isLoading}
          error={error}
          subscribed={subscribed}
        />
      )}
    </>
  );
}
