"use client";

import clsx from "clsx";
import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { subscribeAction, unsubscribeAction } from "@/lib/actions";
import {
  getToken,
  reset,
  getPending,
  setPending,
  subscribePending,
} from "@/lib/subscription-store";

type SubmitButtonProps = {
  subscribed?: boolean;
  className?: string;
};

export default function SubmitButton({
  subscribed = false,
  className,
}: SubmitButtonProps) {
  const router = useRouter();
  const isPending = useSyncExternalStore(subscribePending, getPending, () => false);

  async function handleClick() {
    if (isPending) return;
    setPending(true);

    try {
      if (subscribed) {
        await unsubscribeAction();
        reset();
      } else {
        let token = await getToken();
        if (!token) {
          reset();
          token = await getToken();
        }
        if (!token) {
          setPending(false);
          return;
        }

        await subscribeAction(token);
      }

      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      className={clsx("cursor-pointer", className)}
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending
        ? subscribed
          ? "Unsubscribing…"
          : "Subscribing…"
        : subscribed
          ? "Unsubscribe"
          : "Subscribe"}
    </button>
  );
}
