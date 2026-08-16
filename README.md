# AgriShare — Frontend Prototype

A rural resource-exchange platform prototype for Smart India Hackathon. This phase is the
**frontend only** — realistic mock data, no auth, no database, no maps, no AI yet.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Pages

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, how it works, categories, featured listings, testimonials |
| `/dashboard` | Personal overview — stats, my resources, my requests, recent activity |
| `/find-resources` | Browse & filter all machinery/residue listings |
| `/resource/[id]` | Full detail view for a single listing |
| `/list-resource` | Form to list machinery or residue (validated, preview-only for now) |
| `/smart-match` | Rule-based matching engine demo with a transparent score breakdown |
| `/community-demand` | Open requests from the community, filterable by category/urgency |

## Project structure

```
app/                  Next.js App Router pages
components/            Reusable UI components (Navbar, ResourceCard, badges, etc.)
lib/types.ts           Shared TypeScript domain types
lib/mockData.ts        Realistic mock listings, demand posts, dashboard stats
lib/utils.ts            Formatting helpers + the Smart Match scoring engine
```

## Design notes

- **Visual identity**: deep field-green + turmeric-marigold accent + soil brown, paired with a
  Fraunces display face for headings and Inter for body/UI — meant to read as agricultural,
  not generic SaaS.
- **Smart Match** uses a deterministic, explainable scoring formula (see `scoreResource` in
  `lib/utils.ts`) — weighted by distance, availability, cost fit and demand match. This is a
  legitimate rule-based stand-in you can describe in your SIH pitch, and it's structured so a
  real ML/heuristic backend can later replace just that one function.
- Every "not built yet" surface (map view, message sending, form submission, photo upload) says
  so honestly in the UI rather than pretending to work — see the resource detail page and the
  list-resource confirmation screen.

## Next milestones (not built yet)

1. Supabase — auth + database, replacing `lib/mockData.ts` with real queries
2. Leaflet/OpenStreetMap — real location picking and the map view on resource details
3. Wiring `list-resource` and the "Request this Resource" button to real writes
4. Smarter matching once real usage/location data exists

## Note on this build

This project was generated in a sandboxed environment without npm registry access, so
dependencies could not be installed or the dev server test-run here. The code follows standard
Next.js 14 (App Router) + TypeScript + Tailwind conventions throughout — run `npm install` and
`npm run dev` locally to see it live. If you hit any issue, most likely culprit is a Node version
below 18; use Node 18+ or 20 LTS.
