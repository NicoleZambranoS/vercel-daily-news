# Vercel Daily News

A news reading platform built with Next.js 16 and the App Router. Fetches articles, categories, and subscription state from a protected Vercel-hosted API and gates long-form content behind a cookie-based "Pro" subscription.

## Features

- **Home page** — breaking news banner, marketing hero, and a featured articles grid
- **Search & explore** (`/search`) — debounced full-text search, category filtering, and pagination, all driven by URL params
- **Article pages** (`/articles/[slug]`) — rich block content (paragraphs, headings, blockquotes, lists, images) with dynamic OG metadata
- **Premium content gating** — non-subscribers see a preview (first two blocks) with a subscribe CTA; subscribers see the full article
- **Subscription management** — modal-based subscribe/unsubscribe flow using server actions and an `httpOnly` cookie
- **Trending articles** — contextual recommendations at the bottom of each article page
- **Error handling** — dedicated error boundaries and not-found pages per route segment

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
├── app/                  # App Router pages, layouts, error boundaries
│   ├── articles/[slug]/  # Article detail page
│   └── search/           # Search & explore page
├── components/
│   ├── header.tsx        # Site header with nav and subscription toggle
│   ├── footer.tsx        # Site footer
│   └── ui/               # Feature-scoped UI components
│       ├── home/         # Hero, featured articles, breaking news
│       ├── search/       # Search input, category filter, results
│       ├── article/      # Article content, header, trending
│       └── subscription/ # Subscribe modal and toggle
├── hooks/                # Custom React hooks
├── lib/                  # Server-side data fetching and actions
└── types/                # TypeScript type definitions
```

## Scripts

| Command      | Description                  |
| ------------ | ---------------------------- |
| `pnpm dev`   | Start the development server |
| `pnpm build` | Build for production         |
| `pnpm start` | Run the production build     |
| `pnpm lint`  | Run ESLint                   |
