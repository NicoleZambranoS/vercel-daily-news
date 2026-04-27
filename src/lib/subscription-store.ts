import { prepareSubscription } from "@/lib/actions";

let inflight: Promise<string | null> | null = null;

export function prefetch(): void {
  if (!inflight) {
    inflight = prepareSubscription().catch(() => null);
  }
}

export async function getToken(): Promise<string | null> {
  prefetch();
  return inflight!;
}

export function reset(): void {
  inflight = null;
}

// Shared pending state so every SubmitButton instance disables while any
// action is in flight, preventing double calls across header + article CTA.
let pending = false;
const listeners = new Set<() => void>();

export function getPending(): boolean {
  return pending;
}

export function setPending(value: boolean): void {
  pending = value;
  listeners.forEach((l) => l());
}

export function subscribePending(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
