"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useTransition,
  type ReactNode,
  type RefObject,
  type TransitionStartFunction,
} from "react";
import { createToken } from "@/lib/actions";

type SubscriptionContextValue = {
  tokenRef: RefObject<string | null | undefined>;
  isPending: boolean;
  startTransition: TransitionStartFunction;
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
  const tokenRef = useRef<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    createToken().then((token) => {
      tokenRef.current = token;
    });
  }, []);

  return (
    <SubscriptionContext value={{ tokenRef, isPending, startTransition }}>
      {children}
    </SubscriptionContext>
  );
}
