-- ============================================================
--  WK Pool 2026 — Supabase schema
--  Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run
--  (It is safe to run more than once.)
-- ============================================================

-- 1) PARTICIPANTS / USERS ------------------------------------
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  username      text unique not null,
  password_hash text not null,
  is_admin      boolean not null default false,
  paid          boolean not null default false,
  group_points  integer not null default 0,   -- stand na de groepsfase (door admin ingevuld)
  created_at    timestamptz not null default now()
);

-- 2) PREDICTIONS (one row per user) --------------------------
create table if not exists public.predictions (
  user_id      uuid primary key references public.users(id) on delete cascade,
  sel16        text[]  not null default '{}',  -- 16 team codes (laatste 16)
  quarter      text[]  not null default '{}',  -- 8 kwartfinalisten
  semi         text[]  not null default '{}',  -- 4 halve finalisten
  finalists    text[]  not null default '{}',  -- 2 finalisten
  winner       text,                           -- wereldkampioen (team code)
  topscorers   text[]  not null default '{}',  -- 3 player ids
  status       text    not null default 'concept', -- 'concept' | 'ingeleverd'
  submitted_at timestamptz,
  updated_at   timestamptz not null default now()
);

-- 3) POOL SETTINGS (single row, id = 'pool') -----------------
create table if not exists public.settings (
  id         text primary key default 'pool',
  deadline   timestamptz,
  entry_fee  integer not null default 10,
  prize_pct  integer[] not null default '{70,20,10}',
  teams      jsonb not null default '[]'::jsonb,   -- [{code,name,flag}]
  players    jsonb not null default '[]'::jsonb,   -- [{id,name,club,flag}]
  results    jsonb not null default '{}'::jsonb,   -- {sel16:[],quarter:[],semi:[],finalists:[],winner:null,goals:{}}
  updated_at timestamptz not null default now()
);

-- ============================================================
--  Row Level Security
--  This is a low-stakes internal office pool with no e-mail / no
--  sensitive data, so we allow the public (anon) key full access.
--  Everything runs client-side against these permissive policies.
-- ============================================================
alter table public.users       enable row level security;
alter table public.predictions enable row level security;
alter table public.settings    enable row level security;

drop policy if exists "wkpool_all_users"       on public.users;
drop policy if exists "wkpool_all_predictions" on public.predictions;
drop policy if exists "wkpool_all_settings"    on public.settings;

create policy "wkpool_all_users"       on public.users       for all using (true) with check (true);
create policy "wkpool_all_predictions" on public.predictions for all using (true) with check (true);
create policy "wkpool_all_settings"    on public.settings    for all using (true) with check (true);

-- Done. Your two values for assets/js/config.js are under:
--   Supabase Dashboard → Project Settings → Data API (or API)
--     • Project URL        → SUPABASE_URL
--     • anon / public key  → SUPABASE_ANON_KEY
