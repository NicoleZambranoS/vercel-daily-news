"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUpdateSearchParams() {
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
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return { searchParams, updateParams };
}
