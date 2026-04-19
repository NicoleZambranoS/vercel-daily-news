"use client";

import { type TransitionStartFunction } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUpdateSearchParams(
  startTransition?: TransitionStartFunction,
) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const url = `${pathname}?${params.toString()}`;

    if (startTransition) {
      startTransition(() => {
        replace(url, { scroll: false });
      });
    } else {
      replace(url, { scroll: false });
    }
  };

  return { searchParams, updateParams };
}
