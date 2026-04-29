"use client";

/**
 * After a successful subscribe/unsubscribe server action: prefer a plain
 * `router.refresh()` (not inside `useTransition`) so RSC can pick up new cookies.
 * Double `requestAnimationFrame` lets the refresh request start before UI settles (same
 * idea as the old subscription-modal flow).
 *
 * Do not wrap `refresh` in `useTransition` — it can leave `isPending` stuck with
 * Suspense / loading boundaries: https://github.com/vercel/next.js/issues/86055
 *
 * If the article UI still lags intermittently, set
 * `NEXT_PUBLIC_SUBSCRIPTION_HARD_RELOAD=true` or swap to `window.location.reload()`
 * here for a full document load.
 */
export function runAfterSubscriptionChange(
  refresh: () => void,
  onSettled: () => void,
): void {
  if (process.env.NEXT_PUBLIC_SUBSCRIPTION_HARD_RELOAD === "true") {
    window.location.reload();
    return;
  }

  refresh();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      onSettled();
    });
  });
}
