"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  subscribe as subscribeAction,
  unsubscribe as unsubscribeAction,
} from "@/lib/actions";

type SubscriptionContextValue = {
  isPending: boolean;
  error: string | null;
  subscribe: () => void;
  unsubscribe: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null,
);

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return ctx;
}

export default function SubscriptionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const exec = useCallback(
    (action: typeof subscribeAction) => {
      setError(null);
      startTransition(async () => {
        try {
          const result = await action();
          if (result.error) setError(result.error);
        } catch {
          setError("Something went wrong. Please try again.");
        }
      });
    },
    [startTransition],
  );

  const subscribe = useCallback(() => exec(subscribeAction), [exec]);
  const unsubscribe = useCallback(() => exec(unsubscribeAction), [exec]);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(id);
  }, [error]);

  return (
    <SubscriptionContext value={{ isPending, error, subscribe, unsubscribe }}>
      {children}
    </SubscriptionContext>
  );
}
