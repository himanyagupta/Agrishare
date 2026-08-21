# Testing checklist — Supabase integration

I couldn't run this against a live Supabase project myself (no network access in the
environment I built this in), so please walk through this checklist once you've set up your
project and env vars. It covers all 10 items from the brief. Expect this to take ~15 minutes.

## 0. One-time setup

1. Create a project at supabase.com (free tier is fine).
2. Project Settings → API → copy the Project URL and anon public key.
3. Copy `.env.local.example` to `.env.local` and paste both values in.
4. SQL Editor → New query → paste the full contents of `supabase/schema.sql` → Run.
5. New query again → paste `supabase/rls_policies.sql` → Run.
6. `npm install && npm run dev`.

If any SQL step errors, stop and paste me the error — likely an easy fix.

## 1–5. Auth: signup, login, logout, profile

- [ ] Go to `/signup`, fill the form (use a real-ish email), submit.
  - If your Supabase project has "Confirm email" ON (default), you'll see a "check your email"
    screen. Go to Supabase → Authentication → Users and confirm the account manually if you
    don't want to wire up a real inbox (click the user → "Confirm email").
  - If confirm-email is OFF, you should land straight on `/dashboard`.
- [ ] Authentication → Users in Supabase: confirm a new row appeared, and Table Editor → `users`:
      confirm a matching profile row appeared (name/phone/role/location filled in). This proves
      the `handle_new_user` trigger worked.
- [ ] Go to `/login`, log out first if needed, log back in with the same credentials.
- [ ] Click your name in the navbar → `/profile` → change your name → Save Changes → refresh the
      page → confirm the change persisted.
- [ ] Click "Log Out" in the navbar → confirm you're redirected and the navbar shows
      Login/Signup again.

## 6. Protected dashboard

- [ ] While logged out, visit `/dashboard` directly in the URL bar → should redirect to
      `/login`.
- [ ] Log in → should land on `/dashboard` and show your name/stats (all zero at first).
- [ ] Same check for `/profile` and `/list-resource` while logged out.

## 7. Creating a resource listing

- [ ] Log in, go to `/list-resource`, fill out the form (try one machinery + one residue
      listing), submit.
- [ ] Confirm you see "Listing published" and the "View Listing" link works.
- [ ] Table Editor → `resources`: confirm the row exists with your user id as `owner_id`.

## 8. Reading resource listings

- [ ] Go to `/find-resources` (logged out is fine too) → both listings you created should
      appear. Try the filters (category, type, distance slider, availability).
- [ ] Click into one → `/resource/[id]` should show full details.

## 9. Updating your own listing

- [ ] While logged in as the owner, open one of your listings → you should see an "Edit
      Listing" button (only owners see this).
- [ ] Change the price or description → Save Changes → confirm it updated on the details page.
- [ ] Log in as a second test account → open the first account's listing → confirm there is
      **no** Edit button, and going directly to `/list-resource/<id>/edit` redirects you away
      (RLS + the page's own ownership check both enforce this).

## 10. Creating demand posts

- [ ] Go to `/community-demand` while logged out → confirm you can see posts (public read) but
      the button says "Log in to Post a Demand" instead of "+ Post a Demand".
- [ ] Log in → "+ Post a Demand" → fill the form → submit → confirm it appears in the list.
- [ ] Table Editor → `demand_posts`: confirm the row exists with your user id.

## Row Level Security spot-checks (optional but worth doing once)

- [ ] In the Supabase SQL editor, run `select * from resources;` — this uses the service role
      and bypasses RLS, so it should show everything regardless of who's logged in. That's
      expected and fine.
- [ ] Table Editor → RLS is enabled (little padlock icon) on all 5 tables — if any show
      "RLS disabled", re-run `rls_policies.sql`.
- [ ] Try editing someone else's resource via the browser dev console
      (`supabase.from('resources').update({price: 1}).eq('id', 'someone-elses-id')`) while
      logged in as a different user — it should silently affect 0 rows, not error, because RLS
      filters it out rather than throwing.

## Known gaps (by design, not bugs)

- Smart Match still runs on sample data, not your real listings — intentionally out of scope
  for this phase.
- "Request this Resource" and "I can supply this" are still UI-only — bookings/responses aren't
  wired up yet (the `bookings` table exists and has RLS ready, just not connected to the UI).
- Photo upload on the listing form is UI-only.
- The `requests` table (distinct from `demand_posts`) has RLS and read support in the dashboard,
  but no creation form yet — only `demand_posts` creation was in scope this round.
