# AgriShare — SIH Prototype

A rural resource-exchange platform connecting farmers with underused machinery and crop
residue. Built for Smart India Hackathon.

**Status:** frontend + Supabase backend (auth, database, RLS). No maps or real matching yet.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up Supabase (see below) and create `.env.local` from `.env.local.example`.
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000.

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Project Settings → API → copy the **Project URL** and **anon public key**.
3. Copy `.env.local.example` to `.env.local` and paste both values in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. In the Supabase SQL Editor, run `supabase/schema.sql`, then `supabase/rls_policies.sql`.
   `supabase/seed.sql` is optional — see the comments inside it (needs real user IDs from
   accounts you've already signed up).
5. Restart `npm run dev` if it was already running so the new env vars load.

Then walk through **TESTING.md** — a step-by-step checklist for verifying auth, listings, and
demand posts against your own project.

## Pages

| Route | Purpose | Auth |
|---|---|---|
| `/` | Landing page — hero, categories, live featured listings | Public |
| `/login`, `/signup` | Email/password auth | Public |
| `/dashboard` | Your stats, your listings, your requests | Protected |
| `/profile` | View/edit your profile | Protected |
| `/find-resources` | Browse & filter all live listings | Public |
| `/resource/[id]` | Full listing detail; Edit button if you're the owner | Public |
| `/list-resource` | Create a listing | Protected |
| `/list-resource/[id]/edit` | Edit your own listing (owner-only) | Protected |
| `/smart-match` | Rule-based matching demo — still sample data, not live listings | Public |
| `/community-demand` | Public demand board; posting requires login | Public read |

## Project structure

```
app/                          Next.js App Router pages
components/                    Reusable UI components (Navbar, ResourceCard, badges, etc.)
hooks/useUser.ts                Client hook: current auth user + profile, live-updating
lib/types.ts                   UI-facing domain types (unchanged from the frontend phase)
lib/mockData.ts                Sample data — still used by Smart Match only
lib/utils.ts                    Formatting helpers + the Smart Match scoring engine
lib/supabase/client.ts          Browser Supabase client
lib/supabase/server.ts          Server Supabase client (Server Components, Route Handlers)
lib/supabase/types.ts           Hand-written Database types matching schema.sql
lib/supabase/queries.ts         Typed query helpers (getResources, createResource, etc.)
lib/supabase/adapters.ts        Maps raw DB rows -> the UI's Resource/DemandPost shapes
middleware.ts                   Session refresh + route protection
supabase/schema.sql              Tables, enums, indexes, the auto-profile trigger
supabase/rls_policies.sql        Row Level Security policies for every table
supabase/seed.sql                Optional demo data (needs real user IDs)
```

## How the backend is wired in

The existing UI components (`ResourceCard`, `DemandCard`, badges, etc.) were built in the
frontend-only phase against a `Resource`/`DemandPost` shape defined in `lib/types.ts`. Rather
than rewrite those components, `lib/supabase/adapters.ts` maps raw Supabase rows into that same
shape — so the visual design is untouched, only the data source changed.

A few UI fields don't have a column in the database yet (star ratings, "years farming",
responder counts on demand posts) — these are defaulted or hidden gracefully rather than
faked. See the comments in `adapters.ts` for exactly which fields and why.

## Row Level Security summary

- **users**: any signed-in user can read profiles (needed to show an owner's name); you can
  only update your own row.
- **resources**: public read (even logged out); only the owner can create/update/delete their
  own listings.
- **demand_posts**: public read; only the author can create/update/delete their own posts.
- **requests**, **bookings**: private — visible only to the people involved (requester/owner),
  or an admin.

Full policies are in `supabase/rls_policies.sql` with comments on the reasoning for each.

## Known gaps (intentional, not bugs)

- **Smart Match** still runs on `lib/mockData.ts`, not live listings — matching logic was
  explicitly out of scope for this round.
- **"Request this Resource"** and **"I can supply this"** are still UI-only. The `bookings`
  table exists with RLS ready, just not wired to the UI yet.
- **Maps** (Leaflet/OpenStreetMap) aren't integrated — resource detail pages show an honest
  "coming soon" placeholder instead of a fake map.
- **Photo upload** on the listing form is UI-only; files aren't stored.
- The **`requests`** table (personal requests, distinct from the public `demand_posts` board)
  has RLS and is read in the dashboard, but has no creation form yet.

## Note on this build

This project was built in a sandboxed environment without live internet access, so I couldn't
create a real Supabase project or test the auth/CRUD flows against a live database myself. The
SQL and TypeScript were written and reviewed carefully, but you should work through
`TESTING.md` yourself once your project is set up — if anything errors, share the message and
I'll fix it.
