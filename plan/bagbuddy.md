# BagBuddy — Implementation Handoff

## Context

BagBuddy is a packing-list app for trips and vacations. The repo (`E:\DEV\BagBuddy`) is a fresh SvelteKit template (single "Initial commit"). Each trip gets its own named list, built quickly by pulling in whole categories of items from a reusable catalog. Clothing-type quantities scale with trip length and can be overridden by hand. No authentication for now.

## Project conventions (read `AGENTS.md` first)

- SvelteKit + Svelte 5 **runes**, TypeScript, Tailwind CSS.
- Package manager: **pnpm**. Prefer `package.json` scripts over `pnpx`/`npx`.
- Validate with `pnpm run check`. Use the Svelte MCP server (docs + `svelte-autofixer`) for all Svelte code.
- Near-zero comments; only a short "why" comment when genuinely non-obvious.
- Conventional commits (`feat:`, `fix:`, `chore:` …). Keep it simple (YAGNI/DRY), lean on types.

## Tech decisions (fixed)

- **Data**: SQLite via **Drizzle ORM** (use `sv add drizzle`, SQLite + libsql driver to avoid native builds on Windows). Migrations via drizzle-kit scripts.
- **Server access**: SvelteKit **remote functions only** (`*.remote.ts`). No `+page.server.ts` loads/actions, no `+server.ts` REST endpoints.
  - `query` for reads (trip list, trip detail, catalog).
  - `form` for create/edit flows (new trip, catalog CRUD, custom item).
  - `command` for quick interactions (toggle packed, set/reset quantity override, change days, add category, remove item, duplicate trip), refreshing affected queries; optimistic updates where it feels snappier (packed toggle).
  - Enable `kit.experimental.remoteFunctions` and `compilerOptions.experimental.async` in `svelte.config.js`.
- **Validation**: Standard Schema validator (Valibot) for all remote function inputs.
- **UI**: mobile-first (packing happens next to a bag), Tailwind only, no component library.

## Domain model

**Catalog (reusable, editable)**

- `category`: id, name, sort order.
- `catalog_item`: id, category_id, name, quantity rule:
  - fixed: `base_quantity` (tent = 1), or
  - scaling: `per_day` (may be fractional) + optional `max`.

**Trips**

- `trip`: id, name, days, optional notes, created_at.
- `trip_item`: id, trip_id, category name/id snapshot, name, quantity rule snapshot (`base_quantity` / `per_day` / `max`), `quantity_override` (nullable), `packed` (bool), `source_catalog_item_id` (nullable, only used to dedupe when re-adding a category; null for custom items).

**Snapshot semantics**: adding a category _copies_ its items into the trip. Editing the catalog never alters existing trips; editing a trip never alters the catalog.

**Quantity** — one pure, shared function (unit-tested):

```
computeQuantity({ base, perDay, max }, days, override):
  override ?? (perDay ? min(ceil(perDay × days), max ?? ∞) : base)
```

## Features / user flows

1. **Create trip** — name + days.
2. **Add category to trip** — copies all its catalog items; items already present (same `source_catalog_item_id`) are skipped.
3. **Days change** — every item without an override recomputes automatically.
4. **Override quantity** — set manually; "reset to auto" clears it.
5. **Custom trip items** — add a one-off item (pick category, fixed quantity) directly to a trip.
6. **Remove / rename items** on the trip only.
7. **Packed checkboxes** — progress per category and overall.
8. **Duplicate trip** — copies items and overrides, resets packed, prompts for new name.
9. **Delete trip.**
10. **Catalog management** — CRUD categories and their items including quantity rules. Deleting a category deletes its catalog items (trips unaffected).

## Pages

- `/` — trip cards (name, days, packed progress) + create trip.
- `/trips/[id]` — packing list grouped by category; days input; add-category picker; custom item input; packed toggles; per-item quantity with override/reset; duplicate/delete actions.
- `/catalog` — categories and their template items, editable inline.

## Seed catalog

Idempotent seed script (runs via a `package.json` script, e.g. `pnpm run db:seed`; skips if categories exist). Notation: `n` = fixed quantity, `r/d ≤ max` = scaling rule.

- **Basics** — Passport/ID 1, Wallet 1, Phone 1, Phone charger 1, Keys 1, Travel insurance docs 1, Tickets/booking confirmations 1, Credit/debit card 1, Cash 1, Reusable water bottle 1, Sunglasses 1, Daypack 1
- **Clothing** — T-shirts 1/d ≤ 7, Underwear 1/d ≤ 8, Socks 1/d ≤ 8, Pants/trousers 0.3/d ≤ 3, Shorts 0.3/d ≤ 3, Sweater/hoodie 1, Light jacket 1, Pajamas 0.15/d ≤ 2, Belt 1, Casual shoes 1, Flip-flops 1, Swimwear 1, Cap/hat 1
- **Cold Weather** — Winter jacket 1, Thermal base layer 0.3/d ≤ 3, Warm socks 1/d ≤ 5, Beanie 1, Gloves 1, Scarf 1, Winter boots 1, Fleece 1
- **Hygiene & Cleaning** — Toothbrush 1, Toothpaste 1, Floss 1, Deodorant 1, Shampoo 1, Shower gel/soap 1, Hairbrush/comb 1, Razor 1, Nail clipper 1, Sunscreen 1, Lip balm 1, Hand sanitizer 1, Wet wipes 1, Tissues 1, Toilet paper 1, Contact lenses 1/d ≤ 30, Laundry bag 1, Travel detergent 1, Microfiber towel 1
- **Health & First Aid** — Personal medication 1/d, Painkillers 1, Band-aids 1, Blister plasters 1, Disinfectant 1, Insect repellent 1, Antihistamines 1, Motion-sickness pills 1, Tick tweezers 1, Thermometer 1
- **Electronics** — Power bank 1, Charging cables 2, Travel adapter 1, Headphones 1, E-reader 1, Laptop + charger 1, Camera 1, Memory cards 2, Spare batteries 1
- **Camping** — Tent 1, Sleeping bag 1, Sleeping pad 1, Camping pillow 1, Headlamp 1, Lantern 1, Camping stove 1, Gas canister 0.3/d ≤ 4, Lighter/matches 2, Cookware set 1, Cutlery/spork 1, Mug 1, Plates/bowls 1, Dish sponge 1, Biodegradable soap 1, Trash bags 3, Cooler box 1, Camping chair 1, Tarp 1, Rope/paracord 1, Multi-tool 1, Water filter 1, Tent repair kit 1, Mallet 1
- **Hiking** — Hiking boots 1, Hiking socks 1/d ≤ 5, Backpack 1, Rain jacket 1, Rain cover 1, Trekking poles 1, Map/offline maps 1, Compass 1, Hydration bladder 1, Snacks/energy bars 2/d, Emergency blanket 1, Whistle 1, Sun hat 1, Quick-dry shirt 0.5/d ≤ 3
- **Beach** — Beach towel 1, Swimwear 2, Beach bag 1, After-sun lotion 1, Snorkel set 1, Beach umbrella 1, Waterproof phone pouch 1, Water shoes 1
- **Business** — Suit/blazer 1, Dress shirts 1/d ≤ 5, Dress shoes 1, Tie 1, Business cards 1, Notebook & pen 1, Laptop bag 1
- **Winter Sports** — Ski jacket 1, Ski pants 1, Ski goggles 1, Helmet 1, Ski gloves 1, Neck gaiter 1, Ski socks 1/d ≤ 5, Hand warmers 1/d
- **Travel Comfort** — Neck pillow 1, Eye mask 1, Earplugs 1, Book 1, Travel snacks 1, Pen (for forms) 1, Luggage lock 1, Luggage tags 1
- **Kids** — Diapers 6/d, Baby wipes 1, Kids' clothes 2/d ≤ 10, Favorite toy 1, Kids' snacks 1/d, Kids' sunscreen 1, Stroller 1, Kids' medication 1
- **Pets** — Pet food 1/d, Food & water bowls 1, Leash 1, Poop bags 1/d, Pet bed/blanket 1, Pet vaccination papers 1, Pet toys 1

## Suggested build order

1. Add Drizzle + SQLite, schema, migration, seed script.
2. Enable remote functions; `computeQuantity` + unit test (Vitest, if not present add via `sv add vitest`).
3. Catalog remote functions + `/catalog` page.
4. Trip remote functions + `/` and `/trips/[id]` pages.
5. Packed progress, duplicate, polish for mobile.

## Out of scope (v1)

Auth/multi-user, sharing, destination/weather suggestions, offline mode, i18n.

## Verification

- `pnpm run check` passes; `computeQuantity` unit tests pass.
- Manual run-through: create 5-day trip → add Basics + Clothing + Camping (T-shirts = 5, Pants = 2) → change to 10 days (T-shirts capped at 7) → override Socks to 4, then reset → add a custom item → pack items and watch progress → duplicate trip (packed reset) → edit catalog and confirm the existing trip is unchanged → re-add Camping and confirm no duplicates.
