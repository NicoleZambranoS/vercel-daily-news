"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { prefetch, getToken, reset } from "@/lib/subscription-store";
import { subscribeAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function SubmitButton({ className }: { className?: string }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    prefetch();
  }, []);

  async function handleClick() {
    setIsPending(true);
    try {
      const token = await getToken();
      if (!token) {
        setIsPending(false);
        return;
      }
      reset();

      await subscribeAction(token);
      router.refresh();
    } catch {
      setIsPending(false);
    }
  }

  return (
    <button
      className={clsx("cursor-pointer", className)}
      onClick={handleClick}
      disabled={isPending}
      aria-disabled={isPending}
    >
      {isPending ? "Subscribing…" : "Subscribe"}
    </button>
  );
}
