"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { prefetch, getToken } from "@/lib/subscription-store";
import { subscribeAction } from "@/lib/actions";

export default function SubmitButton({ className }: { className?: string }) {
  const router = useRouter();

  useEffect(() => {
    prefetch();
  }, []);

  async function handleClick() {
    const token = await getToken();
    if (!token) return;
    await subscribeAction(token);
    router.refresh();
  }

  return (
    <button className={clsx("cursor-pointer", className)} onClick={handleClick}>
      Subscribe
    </button>
  );
}
