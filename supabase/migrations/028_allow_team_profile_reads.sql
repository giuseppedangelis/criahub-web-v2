-- Allow team managers to read profile data for members within the same haras
-- without causing RLS recursion on public.profiles.

create or replace function public.user_can_read_haras_profiles(p_haras_id uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $function$
  select
    public.user_belongs_to_haras(p_haras_id)
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and public.normalize_app_role(p.role) = any (array['admin', 'criador', 'assessor'])
    );
$function$;

drop policy if exists profiles_select_own_policy on public.profiles;
drop policy if exists profiles_select_team_policy on public.profiles;

create policy profiles_select_team_policy
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
  or (
    haras_id is not null
    and public.user_can_read_haras_profiles(haras_id)
  )
);
