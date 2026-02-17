-- Knottz: admin moderation policies + admin bootstrap

-- 1) Update celebrity_tips policies so admins can review all rows and moderate.
drop policy if exists "celebrity_tips_select_approved_or_own" on public.celebrity_tips;
create policy "celebrity_tips_select_approved_or_own_or_admin" on public.celebrity_tips
for select using (
  status = 'approved'
  or created_by = auth.uid()
  or exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.is_admin = true
  )
);

drop policy if exists "celebrity_tips_update_own_pending" on public.celebrity_tips;
create policy "celebrity_tips_update_own_or_admin" on public.celebrity_tips
for update using (
  created_by = auth.uid()
  or exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.is_admin = true
  )
)
with check (
  created_by = auth.uid()
  or exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.is_admin = true
  )
);

-- 2) (Optional) mark a specific account as admin.
-- Replace with your real email before running this block.
-- update public.profiles
-- set is_admin = true
-- where lower(email) = 'din-admin-email@exempel.com';
