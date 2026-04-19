# Vercel Daily News

A news publication built with Next.js 16 and the App Router. It pulls articles, categories, and breaking news from a Vercel-hosted API and gates premium content behind a cookie-based subscription.

The project is designed to demonstrate core Next.js 16 patterns: the `"use cache"` directive for data fetching, Suspense boundaries for Partial Prerendering, Server Actions for mutations, and a proxy for route-level access control.

## Features

- **Home page** — breaking news banner, hero section, and a grid of six featured articles
- **Article pages** (`/articles/[slug]`) — full article content for subscribers, a two-block preview with a subscribe CTA for everyone else, plus up to four trending article recommendations loaded with Suspense
- **Search** (`/search`) — debounced text search with category filtering and pagination, all persisted in URL params so results survive a refresh or a shared link
- **Subscription** — anonymous subscribe/unsubscribe via Server Actions, stored in an `httpOnly` cookie that persists across sessions
- **Error handling** — per-route error boundaries and not-found pages

## How caching works

Cache Components are enabled (`cacheComponents: true`), which turns on Partial Prerendering across the app. Every page has a static shell that's prerendered at build time and dynamic content that streams in at request time through Suspense boundaries.

Data-fetching functions in `src/lib/api.ts` use the `"use cache"` directive with `cacheLife()` to control how long each type of content is cached:

- **Breaking news** — revalidates every 5 minutes since it's time-sensitive
- **Article listings and trending** — revalidate every 30 minutes as new content is published throughout the day
- **Article details and categories** — revalidate every 24 hours since they rarely change after publication

Subscription status is intentionally not cached. It reads from cookies on every request so it always reflects the current state, especially right after subscribing or unsubscribing.

## How the proxy works

`src/proxy.ts` runs on every request to `/articles/*`. It checks for the subscription cookie and forwards the subscription status as a request header. This keeps the access control check at the routing layer, separate from the rendering logic in page components.

The proxy doesn't block non-subscribers — they still reach the page and see the paywalled preview. It's a validation layer, not a hard gate.

## How subscriptions work

Subscribing and unsubscribing are handled by Server Actions in `src/lib/actions.ts`. The subscribe action calls the API to create a subscription, then sets an `httpOnly` cookie. The unsubscribe action calls the API to delete it, then removes the cookie.

Since setting or deleting a cookie in a Server Action automatically invalidates the client's router cache, the page updates immediately without needing `revalidatePath`. The cached article data stays cached because only the subscription status changed.

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
├── proxy.ts                 # Route-level access control for article pages
├── app/                     # Pages, layouts, error boundaries
│   ├── articles/[slug]/     # Article detail with paywall
│   └── search/              # Search and explore
├── components/
│   ├── header.tsx           # Site header with subscription toggle
│   ├── footer.tsx           # Site footer
│   └── ui/                  # Feature-scoped UI components
│       ├── home/            # Hero, featured articles, breaking news
│       ├── search/          # Search input, category filter, results
│       ├── article/         # Article content, header, trending, CTA
│       └── subscription/    # Subscribe modal and toggle button
├── hooks/                   # Custom React hooks
├── lib/
│   ├── fetch.ts             # Shared API client
│   ├── api.ts               # Cached data-fetching functions
│   └── actions.ts           # Server Actions for subscribe/unsubscribe
└── types/                   # TypeScript type definitions
```

## Scripts

| Command      | Description                  |
| ------------ | ---------------------------- |
| `pnpm dev`   | Start the development server |
| `pnpm build` | Build for production         |
| `pnpm start` | Run the production build     |
| `pnpm lint`  | Run ESLint                   |
