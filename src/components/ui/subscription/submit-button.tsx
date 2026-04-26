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
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleAction() {
    startTransition(async () => {
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

      router.refresh();
      setShowModal(false);
    });
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
          isPending={isPending}
          error={error}
          subscribed={subscribed}
        />
      )}
    </>
  );
}
