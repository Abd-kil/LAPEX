# LAPEX

LAPEX is Syria's premier laptop comparison and review platform. We simplify laptop shopping by aggregating listings from major Syrian retailers and international brands, providing detailed specifications and performance scores in one place — helping customers make informed decisions.

Built with **Next.js** (App Router), **TypeScript**, and **Supabase**, LAPEX delivers a multilingual, responsive experience with server routes, advanced search and filtering, and reusable UI components for product listings, details, favorites, and side-by-side comparisons.

**Live demo:** https://lapex.vercel.app (deployed on Vercel as the `dev` deployment)

## Key features

- Product search and filtering
- Product comparison view and score breakdowns
- Favorites management
- Multilingual support and locale-aware routing
- Supabase backend integration (auth + database)

## Tech stack

- Next.js (App Router)
- TypeScript
- Supabase (client + server-side integration)
- TailwindCSS / PostCSS

## Quick start

1. Install dependencies:

```bash
npm install
# or
pnpm install
```

2. Run development server:

```bash
npm run dev
```

3. Open http://localhost:3000 in your browser.

For available npm scripts and more, check `package.json`.

## Environment & secrets

This project uses Supabase. Provide the required environment variables before running locally (example names):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

See the Supabase setup notes for details: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) and [SUPABASE_CONNECTION.md](SUPABASE_CONNECTION.md).

## Project structure (high level)

- [src/app](src/app) — Next.js app routes and pages
- [src/components](src/components) — UI components grouped by feature
- [src/lib/supabase](src/lib/supabase) — Supabase client, hooks and queries
- [src/api](src/api) — server route handlers
- [src/utils](src/utils) — helper utilities (image, text, favorite)

Explore the source for detailed implementations (for example, see [src/app/[locale]/product/[slug]/page.tsx](src/app/%5Blocale%5D/product/%5Bslug%5D/page.tsx)).

## Supabase notes

This repository includes helper docs and connection notes:

- [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)
- [SUPABASE_CONNECTION.md](SUPABASE_CONNECTION.md)

Follow those guides to create a Supabase project and seed any required tables before running the app.
