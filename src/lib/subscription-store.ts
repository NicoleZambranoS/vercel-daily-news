import { prepareSubscription } from "@/lib/actions";

let prefetchedToken: string | null = null;
let prefetchPromise: Promise<string | null> | null = null;

export function startPrefetch() {
  if (prefetchPromise) return prefetchPromise;

  prefetchPromise = prepareSubscription()
    .then((token) => {
      prefetchedToken = token;
      return token;
    })
    .catch(() => {
      prefetchedToken = null;
      return null;
    });

  return prefetchPromise;
}

export function getToken(): string | null {
  return prefetchedToken;
}

export function getTokenPromise(): Promise<string | null> {
  return prefetchPromise ?? Promise.resolve(null);
}

export function clearStore() {
  prefetchedToken = null;
  prefetchPromise = null;
}
