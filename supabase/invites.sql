create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  created_at timestamp with time zone default now(),
  created_by uuid,
  redeemed_at timestamp with time zone,
  redeemed_by uuid
);

alter table public.invites enable row level security;

-- Allow anyone to check if a code exists (read-only for invite validation)
create policy "invite_check" on public.invites
for select
using (true);
