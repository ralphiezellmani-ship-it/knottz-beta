-- Knottz: celebrity tips with moderation

create extension if not exists "pgcrypto";

create table if not exists public.celebrity_tips (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  created_by uuid not null,
  celeb_name text not null,
  details text not null,
  source text,
  due_window text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected'))
);

create index if not exists celebrity_tips_status_idx
  on public.celebrity_tips(status, created_at desc);

alter table public.celebrity_tips enable row level security;

drop policy if exists "celebrity_tips_select_approved_or_own" on public.celebrity_tips;
create policy "celebrity_tips_select_approved_or_own" on public.celebrity_tips
for select using (
  status = 'approved' or created_by = auth.uid()
);

drop policy if exists "celebrity_tips_insert_auth" on public.celebrity_tips;
create policy "celebrity_tips_insert_auth" on public.celebrity_tips
for insert with check (
  created_by = auth.uid() and status = 'pending'
);

drop policy if exists "celebrity_tips_update_own_pending" on public.celebrity_tips;
create policy "celebrity_tips_update_own_pending" on public.celebrity_tips
for update using (
  created_by = auth.uid() and status = 'pending'
)
with check (
  created_by = auth.uid() and status = 'pending'
);
