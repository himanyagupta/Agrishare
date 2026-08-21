-- ============================================================================
-- AgriShare — Supabase schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible, but on
-- a fresh project just run it top to bottom.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('farmer', 'buyer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type resource_category as enum ('machinery', 'crop_residue');
exception when duplicate_object then null; end $$;

do $$ begin
  create type resource_status as enum ('available', 'upcoming', 'booked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type request_status as enum ('open', 'matched', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type demand_status as enum ('open', 'fulfilled', 'closed');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- users — public profile row, one-to-one with an auth.users row.
-- id is NOT auto-generated: it's set to match auth.users.id via the trigger
-- below, so public.users.id === auth.uid() for the owning user.
-- ----------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  role user_role not null default 'farmer',
  location text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- resources — machinery and crop-residue listings
-- ----------------------------------------------------------------------------
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users (id) on delete cascade,
  type text not null,               -- specific type, e.g. "Tractor", "Wheat Straw (Bhusa)"
  category resource_category not null,
  name text not null,
  description text,
  quantity text,                    -- e.g. "50 quintals" (residue) or condition note (machinery)
  unit text,                        -- e.g. "quintal", "hour", "acre"
  price numeric(10, 2) not null check (price >= 0),
  price_unit text not null,         -- e.g. "per hour", "per quintal"
  location text not null,
  latitude double precision,
  longitude double precision,
  available_from date,
  available_until date,
  status resource_status not null default 'available',
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- requests — a user's personal, structured need (distinct from the public
-- community demand board below). Not yet exposed for creation in the UI.
-- ----------------------------------------------------------------------------
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.users (id) on delete cascade,
  resource_type text not null,
  category resource_category not null,
  quantity text,
  budget text,
  required_date date,
  latitude double precision,
  longitude double precision,
  status request_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- bookings — a confirmed or proposed exchange between two users over a
-- resource. Schema only for now; not yet wired to the UI.
-- ----------------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources (id) on delete cascade,
  requester_id uuid not null references public.users (id) on delete cascade,
  owner_id uuid not null references public.users (id) on delete cascade,
  requested_from date,
  requested_until date,
  agreed_price numeric(10, 2) check (agreed_price >= 0),
  status booking_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- demand_posts — the public Community Demand board
-- ----------------------------------------------------------------------------
create table if not exists public.demand_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  resource_type text not null,
  category resource_category not null,
  quantity text,
  budget text,
  required_date date,
  location text not null,
  latitude double precision,
  longitude double precision,
  status demand_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Indexes for the read patterns the app actually uses
-- ----------------------------------------------------------------------------
create index if not exists idx_resources_owner on public.resources (owner_id);
create index if not exists idx_resources_category on public.resources (category);
create index if not exists idx_resources_status on public.resources (status);
create index if not exists idx_requests_requester on public.requests (requester_id);
create index if not exists idx_bookings_resource on public.bookings (resource_id);
create index if not exists idx_bookings_requester on public.bookings (requester_id);
create index if not exists idx_bookings_owner on public.bookings (owner_id);
create index if not exists idx_demand_posts_user on public.demand_posts (user_id);
create index if not exists idx_demand_posts_status on public.demand_posts (status);

-- ----------------------------------------------------------------------------
-- Auto-create a public.users row whenever someone signs up via Supabase Auth.
-- The signup form passes name/phone/role/location as auth metadata; this
-- trigger copies them into the public profile row.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name, email, phone, role, location)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'farmer'),
    new.raw_user_meta_data ->> 'location'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
