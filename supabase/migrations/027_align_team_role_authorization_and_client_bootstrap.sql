-- Align team role authorization with the current UI model and remove legacy collaborator overload.

create or replace function public.user_can_manage_haras_roles(p_haras_id uuid)
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
        and public.normalize_app_role(p.role) = any (array['admin', 'criador'])
    );
$function$;

drop policy if exists haras_members_select_policy on public.haras_members;
create policy haras_members_select_policy
on public.haras_members
for select
to public
using (
  (user_id = (select auth.uid()))
  or (
    public.user_belongs_to_haras(haras_id)
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and public.normalize_app_role(p.role) = any (array['admin', 'criador', 'assessor', 'veterinario', 'funcionario'])
    )
  )
);

drop policy if exists haras_roles_insert_policy on public.haras_roles;
drop policy if exists haras_roles_update_policy on public.haras_roles;
drop policy if exists haras_roles_delete_policy on public.haras_roles;

create policy haras_roles_insert_policy
on public.haras_roles
for insert
to public
with check (public.user_can_manage_haras_roles(haras_id));

create policy haras_roles_update_policy
on public.haras_roles
for update
to public
using (public.user_can_manage_haras_roles(haras_id))
with check (public.user_can_manage_haras_roles(haras_id));

create policy haras_roles_delete_policy
on public.haras_roles
for delete
to public
using (public.user_can_manage_haras_roles(haras_id));

drop function if exists public.create_collaborator(text, text, text, text, uuid);
