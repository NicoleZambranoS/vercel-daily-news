"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { prepareTokenAction, subscribeAction } from "@/lib/actions";

export default function SubmitButton({ className }: { className?: string }) {
  const [isPending, setIsPending] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    prepareTokenAction().then(setPendingToken);
  }, []);

  async function handleClick() {
    setIsPending(true);
    try {
      await subscribeAction(pendingToken);
      router.refresh();
    } finally {
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
