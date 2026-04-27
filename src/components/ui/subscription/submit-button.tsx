"use client";

import clsx from "clsx";
import { useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { prefetch, getToken } from "@/lib/subscription-store";
import { subscribeAction } from "@/lib/actions";

export default function SubmitButton({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    prefetch();
  }, []);

  function handleClick() {
    startTransition(async () => {
      const token = await getToken();
      if (!token) return;
      await subscribeAction(token);
      router.replace(pathname);
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
