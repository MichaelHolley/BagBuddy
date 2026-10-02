# BagBuddy

Packing lists for trips. Each trip gets its own list, built by pulling whole categories from a reusable catalog. Per-day items scale with the trip length and can be overridden by hand.

SvelteKit (remote functions) · Svelte 5 · Drizzle + SQLite (libsql) · Tailwind CSS

## Setup

```sh
pnpm install
cp .env.example .env
pnpm run db:setup   # applies migrations and seeds the catalog (seed is skipped if categories exist)
pnpm run dev
```

## Scripts

| Script                     | Purpose                                     |
| -------------------------- | ------------------------------------------- |
| `pnpm run check`           | Type-check                                  |
| `pnpm run test`            | Unit tests                                  |
| `pnpm run lint` / `format` | Prettier + ESLint                           |
| `pnpm run db:generate`     | Create a migration after editing the schema |
| `pnpm run db:migrate`      | Apply migrations                            |
| `pnpm run db:seed`         | Seed the default catalog                    |
| `pnpm run db:studio`       | Browse the database                         |
