"use client";

import { subscribe, unsubscribe } from "@/lib/actions";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useTransition,
  type ReactNode,
} from "react";

interface SubscriptionContextValue {
  isPending: boolean;
  error: string | null;
  handleSubscribe: () => void;
  handleUnsubscribe: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  isPending: false,
  error: null,
  handleSubscribe: () => {},
  handleUnsubscribe: () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubscribe() {
    setError(null);
    startTransition(async () => {
      const result = await subscribe();
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleUnsubscribe() {
    setError(null);
    startTransition(async () => {
      const result = await unsubscribe();
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <SubscriptionContext
      value={{
        isPending,
        error,
        handleSubscribe,
        handleUnsubscribe,
      }}
    >
      {children}
    </SubscriptionContext>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
