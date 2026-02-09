create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  account_type text not null,
  created_at timestamp with time zone default now(),
  created_by uuid
);

create table if not exists public.profiles (
  id uuid primary key,
  household_id uuid references public.households(id) on delete cascade,
  parent_one text,
  parent_two text,
  due_date date,
  bio text default '',
  avatar_url text default '',
  verified_by_inviter boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade,
  name text,
  birth_date date
);

alter table public.households enable row level security;
alter table public.profiles enable row level security;
alter table public.children enable row level security;

create policy "households_insert" on public.households
for insert to authenticated
with check (true);

create policy "profiles_insert" on public.profiles
for insert to authenticated
with check (auth.uid() = id);

create policy "children_insert" on public.children
for insert to authenticated
with check (true);

create policy "profiles_read" on public.profiles
for select to authenticated
using (auth.uid() = id);
