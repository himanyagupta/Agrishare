-- ============================================================================
-- AgriShare — Row Level Security policies
-- Run this AFTER schema.sql. Safe to re-run: drops each policy before
-- recreating it.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- users
--   - Anyone signed in can read profiles (needed to show an owner's name on
--     a resource card / demand post). No public (anonymous) read of profiles.
--   - A user can only insert/update their own row. Inserts normally happen
--     via the handle_new_user trigger, but the policy is here as a fallback
--     and to make the intent explicit.
-- ----------------------------------------------------------------------------
alter table public.users enable row level security;

drop policy if exists "users_select_authenticated" on public.users;
create policy "users_select_authenticated"
  on public.users for select
  to authenticated
  using (true);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own"
  on public.users for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
  on public.users for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- resources
--   - Public marketplace: anyone (including logged-out visitors) can browse.
--   - Only an authenticated user can create a listing, and only as themselves.
--   - Only the owner can update or delete their own listing.
-- ----------------------------------------------------------------------------
alter table public.resources enable row level security;

drop policy if exists "resources_select_public" on public.resources;
create policy "resources_select_public"
  on public.resources for select
  to anon, authenticated
  using (true);

drop policy if exists "resources_insert_own" on public.resources;
create policy "resources_insert_own"
  on public.resources for insert
  to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "resources_update_own" on public.resources;
create policy "resources_update_own"
  on public.resources for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "resources_delete_own" on public.resources;
create policy "resources_delete_own"
  on public.resources for delete
  to authenticated
  using (auth.uid() = owner_id);

-- ----------------------------------------------------------------------------
-- requests — personal, not a public board. Only the requester (or an admin)
-- can see or manage their own requests.
-- ----------------------------------------------------------------------------
alter table public.requests enable row level security;

drop policy if exists "requests_select_own_or_admin" on public.requests;
create policy "requests_select_own_or_admin"
  on public.requests for select
  to authenticated
  using (
    auth.uid() = requester_id
    or exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

drop policy if exists "requests_insert_own" on public.requests;
create policy "requests_insert_own"
  on public.requests for insert
  to authenticated
  with check (auth.uid() = requester_id);

drop policy if exists "requests_update_own" on public.requests;
create policy "requests_update_own"
  on public.requests for update
  to authenticated
  using (auth.uid() = requester_id)
  with check (auth.uid() = requester_id);

-- ----------------------------------------------------------------------------
-- bookings — visible to the two participants only (requester and owner).
-- ----------------------------------------------------------------------------
alter table public.bookings enable row level security;

drop policy if exists "bookings_select_participant" on public.bookings;
create policy "bookings_select_participant"
  on public.bookings for select
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = owner_id);

drop policy if exists "bookings_insert_requester" on public.bookings;
create policy "bookings_insert_requester"
  on public.bookings for insert
  to authenticated
  with check (auth.uid() = requester_id);

drop policy if exists "bookings_update_participant" on public.bookings;
create policy "bookings_update_participant"
  on public.bookings for update
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = owner_id)
  with check (auth.uid() = requester_id or auth.uid() = owner_id);

-- ----------------------------------------------------------------------------
-- demand_posts — public Community Demand board.
--   - Anyone can browse open requests (helps a logged-out visitor see demand
--     before signing up).
--   - Only an authenticated user can post, and only as themselves.
--   - Only the author can edit or close their own post.
-- ----------------------------------------------------------------------------
alter table public.demand_posts enable row level security;

drop policy if exists "demand_posts_select_public" on public.demand_posts;
create policy "demand_posts_select_public"
  on public.demand_posts for select
  to anon, authenticated
  using (true);

drop policy if exists "demand_posts_insert_own" on public.demand_posts;
create policy "demand_posts_insert_own"
  on public.demand_posts for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "demand_posts_update_own" on public.demand_posts;
create policy "demand_posts_update_own"
  on public.demand_posts for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "demand_posts_delete_own" on public.demand_posts;
create policy "demand_posts_delete_own"
  on public.demand_posts for delete
  to authenticated
  using (auth.uid() = user_id);
