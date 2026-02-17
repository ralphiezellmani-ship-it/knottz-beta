-- Knottz: permanent persistence for friend notes, comments, and groups

create extension if not exists "pgcrypto";

create table if not exists public.friend_notes (
  user_id uuid not null,
  target_user_id text not null,
  wish text default '',
  favorite text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id, target_user_id)
);

create table if not exists public.community_groups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  created_by uuid not null,
  name text not null,
  description text,
  icon text default '💬'
);

create table if not exists public.community_group_members (
  group_id uuid not null references public.community_groups(id) on delete cascade,
  user_id uuid not null,
  created_at timestamptz default now(),
  primary key (group_id, user_id)
);

create table if not exists public.entity_comments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  entity_type text not null check (entity_type in ('musthave', 'tip')),
  entity_id text not null,
  user_id uuid not null,
  user_name text not null,
  content text not null,
  upvotes integer not null default 0,
  downvotes integer not null default 0
);

create index if not exists entity_comments_lookup_idx
  on public.entity_comments(entity_type, entity_id, created_at desc);

create table if not exists public.entity_comment_votes (
  comment_id uuid not null references public.entity_comments(id) on delete cascade,
  entity_type text not null check (entity_type in ('musthave', 'tip')),
  voter_id uuid not null,
  vote_type text not null check (vote_type in ('up', 'down')),
  created_at timestamptz default now(),
  primary key (comment_id, voter_id)
);

alter table public.friend_notes enable row level security;
alter table public.community_groups enable row level security;
alter table public.community_group_members enable row level security;
alter table public.entity_comments enable row level security;
alter table public.entity_comment_votes enable row level security;

drop policy if exists "friend_notes_select_own" on public.friend_notes;
create policy "friend_notes_select_own" on public.friend_notes
for select using (user_id = auth.uid());

drop policy if exists "friend_notes_upsert_own" on public.friend_notes;
create policy "friend_notes_upsert_own" on public.friend_notes
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "community_groups_select_all" on public.community_groups;
create policy "community_groups_select_all" on public.community_groups
for select using (true);

drop policy if exists "community_groups_insert_auth" on public.community_groups;
create policy "community_groups_insert_auth" on public.community_groups
for insert with check (created_by = auth.uid());

drop policy if exists "community_groups_update_owner" on public.community_groups;
create policy "community_groups_update_owner" on public.community_groups
for update using (created_by = auth.uid());

drop policy if exists "community_groups_delete_owner" on public.community_groups;
create policy "community_groups_delete_owner" on public.community_groups
for delete using (created_by = auth.uid());

drop policy if exists "community_group_members_select_all" on public.community_group_members;
create policy "community_group_members_select_all" on public.community_group_members
for select using (true);

drop policy if exists "community_group_members_insert_self" on public.community_group_members;
create policy "community_group_members_insert_self" on public.community_group_members
for insert with check (user_id = auth.uid());

drop policy if exists "community_group_members_delete_self" on public.community_group_members;
create policy "community_group_members_delete_self" on public.community_group_members
for delete using (user_id = auth.uid());

drop policy if exists "entity_comments_select_all" on public.entity_comments;
create policy "entity_comments_select_all" on public.entity_comments
for select using (true);

drop policy if exists "entity_comments_insert_auth" on public.entity_comments;
create policy "entity_comments_insert_auth" on public.entity_comments
for insert with check (user_id = auth.uid());

drop policy if exists "entity_comments_update_owner" on public.entity_comments;
create policy "entity_comments_update_owner" on public.entity_comments
for update using (user_id = auth.uid());

drop policy if exists "entity_comment_votes_select_all" on public.entity_comment_votes;
create policy "entity_comment_votes_select_all" on public.entity_comment_votes
for select using (true);

drop policy if exists "entity_comment_votes_insert_self" on public.entity_comment_votes;
create policy "entity_comment_votes_insert_self" on public.entity_comment_votes
for insert with check (voter_id = auth.uid());

drop policy if exists "entity_comment_votes_delete_self" on public.entity_comment_votes;
create policy "entity_comment_votes_delete_self" on public.entity_comment_votes
for delete using (voter_id = auth.uid());
