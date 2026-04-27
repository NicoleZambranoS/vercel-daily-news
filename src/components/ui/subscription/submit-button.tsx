"use client";

import clsx from "clsx";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { subscribeAction, unsubscribeAction } from "@/lib/actions";
import { getToken, reset } from "@/lib/subscription-store";

type SubmitButtonProps = {
  subscribed?: boolean;
  className?: string;
};

export default function SubmitButton({
  subscribed = false,
  className,
}: SubmitButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (subscribed) {
        await unsubscribeAction();
        reset();
      } else {
        let token = await getToken();
        if (!token) {
          reset();
          token = await getToken();
        }
        if (!token) return;

        await subscribeAction(token);
      }

      router.refresh();
    });
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
