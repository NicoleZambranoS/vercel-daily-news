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
- **Article details and categories** — 1 hour (max allowed window)

Subscription status is never cached. On article pages it comes from the proxy rewrite (`searchParams.access`). Everywhere else it reads from `cookies()` on every request.

## Proxy

`src/proxy.ts` for article pages it reads the `subscription-token` cookie and rewrites the URL with `?access=full` or `?access=preview`. The article page then reads `searchParams.access` instead of touching `cookies()` directly, keeping access control at the routing layer.

The rewrite is invisible to the browser — the URL stays clean — and tamper-proof, since the proxy always overrides the `access` param from the real cookie.

## Subscriptions

The API is slow, so subscribing needed a different approach to feel instant.

When a non-subscriber loads any page, the `SubscriptionToggle` component quietly calls a `prepareSubscription` Server Action in the background. That action hits the slow API and stashes the returned token in a module-level store. By the time the user actually clicks "Subscribe," the token is already sitting there waiting.

**Subscribing:** The modal grabs the pre-fetched token, a Server Action sets it as the `subscription-token` cookie, and the page re-renders in place through the proxy — no navigation, no scroll jump, no delay.

**Unsubscribing:** A Server Action deletes the cookie and returns immediately. The actual API DELETE call runs after the response via `after()` from `next/server` (fire-and-forget). The page re-renders through the proxy and shows the paywall.

Neither action touches cached article data — `revalidatePath` is never called because subscription changes don't affect content.

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
├── proxy.ts                  # Access control for article pages
├── app/
│   ├── articles/[slug]/      # Article detail with paywall
│   └── search/               # Search and explore
├── components/
│   ├── header.tsx            # Site header with subscription toggle
│   ├── footer.tsx            # Site footer
│   └── ui/
│       ├── home/             # Hero, featured articles, breaking news
│       ├── search/           # Search input, category filter, results
│       ├── article/          # Article content, header, trending
│       └── subscription/     # Subscribe modal and toggle
├── hooks/                    # Custom React hooks
├── lib/
│   ├── fetch.ts              # Shared API client
│   ├── api.ts                # Cached data-fetching functions
│   ├── actions.ts            # Server Actions (subscribe / unsubscribe / prepare)
│   ├── subscription-store.ts # Pre-fetched token store
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
