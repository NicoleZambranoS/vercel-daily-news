# Vercel Daily News

A fictional news publication built with Next.js 16. The app pulls articles, categories, and breaking news from a Vercel-hosted API and gates premium content behind a cookie-based subscription.

The external API is intentionally slow, so a big part of the challenge was making the app feel fast despite that. The project covers the core Next.js 16 patterns: `"use cache"` for data fetching, Suspense for streaming, Server Actions for mutations, and a proxy for route-level access control.

## Pages

- **Home** (`/`) — A breaking news banner, hero section, and a grid of six featured articles. The hero renders right away; breaking news and articles stream in through Suspense boundaries.
- **Article detail** (`/articles/[slug]`) — Full article content for subscribers, or a two-block preview with a subscribe CTA for everyone else. Trending article recommendations stream in separately.
- **Search** (`/search`) — Text search with category filtering and pagination, all persisted in URL params so results survive a refresh or a shared link.

## Caching

Cache Components are enabled (`cacheComponents: true` in `next.config.ts`), which turns on Partial Prerendering. Static shells are prerendered at build time and dynamic content streams in at request time through Suspense boundaries.

Data-fetching functions in `src/lib/api.ts` use `"use cache"` with `cacheLife()`:

- **Breaking news** — 5 minutes (time-sensitive)
- **Article listings and trending** — 30 minutes
- **Article details and categories** — 1 hour
- **Subscription verification** — 30-second stale window, revalidates after 60 seconds

Subscription status is never cached. It's determined at request time by `getSubscriptionStatus()` in `src/lib/subscription.ts`, which reads headers set by the proxy.

## Proxy

`src/proxy.ts` runs on every request and handles access control through request headers. It reads the user's cookies and sets `x-subscription-status` and `x-subscription-token` headers that downstream server components use to determine subscription state.

Three cases:

1. **No token cookie** — sets `x-subscription-status: inactive`. User sees the paywall.
2. **Token + active cookie** (short-lived trust window after subscribing) — sets `x-subscription-status: active`. Skips the slow verification API call so the page loads instantly after a subscribe action.
3. **Token only** (normal page loads) — sets `x-subscription-token` and leaves status unset. `getSubscriptionStatus()` then calls `verifySubscription()` against the API to confirm the token is valid.

This keeps access control at the routing layer. Server components never touch cookies directly — they read the headers the proxy already resolved.

## Subscriptions

The API is slow, so subscribing needed a different approach to feel instant.

When a non-subscriber loads any page, the `SubscriptionToggle` component quietly calls a `prepareSubscription` Server Action in the background. That action hits the API to create a token and stores it in an `httpOnly` cookie. By the time the user clicks "Subscribe," the token is already there.

**Subscribing:** The `subscribe` action grabs the pre-created token (or creates one if needed), sets a short-lived `subscription-active` cookie as a trust signal for the proxy, and returns immediately. The actual API activation and verification cache warming happen after the response via `after()` from `next/server`. The page re-renders through `router.refresh()`, and because the proxy sees the trust cookie, the page loads fast without waiting for the slow API.

Once the trust cookie expires (5 seconds), the proxy falls back to real verification via `verifySubscription()`. If the token turns out to be invalid for any reason, the paywall shows up again. If it's valid, the cached verification result is already warm from the `after()` callback, so there's no delay.

**Unsubscribing:** A Server Action deletes both cookies and returns immediately. The actual API DELETE call runs after the response via `after()`. The page re-renders through `router.refresh()` and the proxy sees no cookies, so the paywall shows.

## Error handling

Each route segment has its own `error.tsx` and the article route has a `not-found.tsx`, all built on a shared `StatusPage` component. Article pages also have a `loading.tsx` for navigation transitions; the homepage and search page use component-level Suspense instead.

## Tech Stack

| Area            | Choice                  |
| --------------- | ----------------------- |
| Framework       | Next.js 16 (App Router) |
| Language        | TypeScript (strict)     |
| Styling         | Tailwind CSS v4         |
| Icons           | lucide-react            |
| Package manager | pnpm                    |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

| Variable                   | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| `VERCEL_API_URL`           | Base URL for the backend API              |
| `VERCEL_PROTECTION_BYPASS` | Vercel Deployment Protection bypass token |

## Project Structure

```
src/
├── proxy.ts                  # Access control via request headers
├── app/
│   ├── articles/[slug]/      # Article detail with paywall
│   └── search/               # Search and explore
├── components/
│   ├── header.tsx            # Site header with subscription toggle
│   ├── footer.tsx            # Site footer
│   └── ui/
│       ├── home/             # Hero, featured articles, breaking news
│       ├── search/           # Search input, category filter, results
│       ├── article/          # Article content, header, paywall, trending
│       └── subscription/     # Subscribe button and toggle
├── hooks/                    # Custom React hooks
├── lib/
│   ├── fetch.ts              # Shared API client
│   ├── api.ts                # Cached data-fetching functions
│   ├── actions.ts            # Server Actions (subscribe / unsubscribe / prepare)
│   ├── subscription.ts       # Cookie constants and subscription status check
│   └── format.ts             # Date formatting
└── types/                    # TypeScript type definitions
```

## Scripts

| Command      | Description                  |
| ------------ | ---------------------------- |
| `pnpm dev`   | Start the development server |
| `pnpm build` | Build for production         |
| `pnpm start` | Run the production build     |
| `pnpm lint`  | Run ESLint                   |
