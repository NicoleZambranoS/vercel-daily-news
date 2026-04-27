"use client";

import clsx from "clsx";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { prefetch, getToken } from "@/lib/subscription-store";
import { subscribeAction } from "@/lib/actions";

export default function SubmitButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    prefetch();
  }, []);

  function handleClick() {
    startTransition(async () => {
      const token = await getToken();
      if (!token) return;
      await subscribeAction(token);
      router.refresh();
    });
  }

  return (
    <button
      className={clsx("cursor-pointer", className)}
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? "Subscribing…" : "Subscribe"}
    </button>
  );
}
