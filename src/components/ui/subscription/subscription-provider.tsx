"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
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
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exec = useCallback(async (action: typeof subscribeAction) => {
    setError(null);
    setIsPending(true);
    try {
      const result = await action();
      if (result.error) setError(result.error);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }, []);

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
