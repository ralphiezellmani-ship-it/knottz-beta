-- Core tables for real multi-user beta

create extension if not exists "uuid-ossp";

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  account_type text not null check (account_type in ('family','solo')),
  parent1_name text,
  parent2_name text
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid not null,
  household_id uuid not null references public.households(id) on delete cascade,
  email text not null,
  display_name text,
  bio text,
  avatar_url text,
  location text,
  household_name text,
  expected_due_date date,
  personal_number text,
  has_children boolean default false,
  is_private boolean default false,
  inviter_id uuid,
  is_admin boolean default false
);

create unique index if not exists profiles_user_id_unique on public.profiles(user_id);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text,
  birth_date date not null
);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  follower_id uuid not null,
  followee_id uuid not null
);

create unique index if not exists follows_unique on public.follows(follower_id, followee_id);

create table if not exists public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid not null,
  post_id text not null,
  post_snapshot jsonb
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  created_at timestamptz default now(),
  created_by uuid,
  redeemed_at timestamptz,
  redeemed_by uuid
);

alter table public.households enable row level security;
alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.follows enable row level security;
alter table public.saved_posts enable row level security;
alter table public.invites enable row level security;

create policy if not exists "households_select_own" on public.households
for select using (
  id in (select household_id from public.profiles where user_id = auth.uid())
);

create policy if not exists "households_insert_own" on public.households
for insert with check (true);

create policy if not exists "profiles_select_own" on public.profiles
for select using (true);

create policy if not exists "profiles_insert_own" on public.profiles
for insert with check (user_id = auth.uid());

create policy if not exists "profiles_update_own" on public.profiles
for update using (user_id = auth.uid());

create policy if not exists "children_select_own" on public.children
for select using (
  household_id in (select household_id from public.profiles where user_id = auth.uid())
);

create policy if not exists "children_insert_own" on public.children
for insert with check (
  household_id in (select household_id from public.profiles where user_id = auth.uid())
);

create policy if not exists "follows_select_own" on public.follows
for select using (
  follower_id = auth.uid() OR followee_id = auth.uid()
);

create policy if not exists "follows_insert_own" on public.follows
for insert with check (follower_id = auth.uid());

create policy if not exists "follows_delete_own" on public.follows
for delete using (follower_id = auth.uid());

create policy if not exists "saved_posts_select_own" on public.saved_posts
for select using (user_id = auth.uid());

create policy if not exists "saved_posts_insert_own" on public.saved_posts
for insert with check (user_id = auth.uid());

create policy if not exists "invites_select" on public.invites
for select using (true);

create policy if not exists "invites_insert" on public.invites
for insert with check (true);

create policy if not exists "invites_update" on public.invites
for update using (true);
