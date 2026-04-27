import { prepareSubscription } from "@/lib/actions";

let inflight: Promise<string | null> | null = null;

export function prefetch(): void {
  if (!inflight) {
    inflight = prepareSubscription().catch(() => null);
  }
}

export async function getToken(): Promise<string | null> {
  return inflight;
}

export function reset(): void {
  inflight = null;
}
