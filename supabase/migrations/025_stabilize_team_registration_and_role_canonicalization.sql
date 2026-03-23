-- Stabilize collaborator registration, canonical team roles, and team/profile consistency.

-- Merge legacy "Acessor" role records into canonical "Assessor" records before renaming.
do $$
declare
  r record;
begin
  for r in
    select legacy.id as legacy_id,
           canonical.id as canonical_id
      from public.haras_roles legacy
      join public.haras_roles canonical
        on canonical.haras_id = legacy.haras_id
       and canonical.id <> legacy.id
     where lower(legacy.name) = 'acessor'
       and lower(canonical.name) = 'assessor'
  loop
    update public.haras_members
       set role_id = r.canonical_id,
           updated_at = now()
     where role_id = r.legacy_id;

    delete from public.haras_roles
     where id = r.legacy_id;
  end loop;
end $$;

update public.haras_roles
   set name = 'Assessor',
       updated_at = now()
 where lower(name) = 'acessor';

create or replace function public.normalize_app_role(p_role text)
returns text
language sql
immutable
set search_path to 'public'
as $function$
  select case lower(trim(coalesce(p_role, '')))
    when 'advisor' then 'assessor'
    when 'acessor' then 'assessor'
    when 'assessor' then 'assessor'
    when 'breeder' then 'criador'
    when 'employee' then 'funcionario'
    when '' then null
    else lower(trim(p_role))
  end;
$function$;

create or replace function public.default_haras_role_name(p_role text)
returns text
language sql
immutable
set search_path to 'public'
as $function$
  select case public.normalize_app_role(p_role)
    when 'admin' then 'Administrador'
    when 'criador' then 'Administrador'
    when 'assessor' then 'Assessor'
    when 'veterinario' then 'Veterinário'
    when 'peao' then 'Peão'
    when 'funcionario' then 'Colaborador'
    else 'Colaborador'
  end;
$function$;

create or replace function public.default_team_permissions(p_role text)
returns jsonb
language sql
immutable
set search_path to 'public'
as $function$
  select case public.normalize_app_role(p_role)
    when 'admin' then jsonb_build_object(
      'viewHerd', true,
      'registerActivities', true,
      'healthManagement', true,
      'reproduction', true,
      'financialManagement', true,
      'trainingManagement', true,
      'teamManagement', true,
      'documentManagement', true,
      'fullAdministrative', true
    )
    when 'criador' then jsonb_build_object(
      'viewHerd', true,
      'registerActivities', true,
      'healthManagement', true,
      'reproduction', true,
      'financialManagement', true,
      'trainingManagement', true,
      'teamManagement', true,
      'documentManagement', true,
      'fullAdministrative', true
    )
    when 'assessor' then jsonb_build_object(
      'viewHerd', true,
      'registerActivities', true,
      'healthManagement', true,
      'reproduction', true,
      'financialManagement', true,
      'trainingManagement', true,
      'teamManagement', true,
      'documentManagement', true,
      'fullAdministrative', false
    )
    when 'veterinario' then jsonb_build_object(
      'viewHerd', true,
      'registerActivities', true,
      'healthManagement', true,
      'reproduction', true,
      'financialManagement', false,
      'trainingManagement', false,
      'teamManagement', false,
      'documentManagement', true,
      'fullAdministrative', false
    )
    when 'peao' then jsonb_build_object(
      'viewHerd', true,
      'registerActivities', true,
      'healthManagement', true,
      'reproduction', false,
      'financialManagement', false,
      'trainingManagement', false,
      'teamManagement', false,
      'documentManagement', false,
      'fullAdministrative', false
    )
    else jsonb_build_object(
      'viewHerd', true,
      'registerActivities', false,
      'healthManagement', false,
      'reproduction', false,
      'financialManagement', false,
      'trainingManagement', false,
      'teamManagement', false,
      'documentManagement', false,
      'fullAdministrative', false
    )
  end;
$function$;

create or replace function public.ensure_default_haras_role(
  p_haras_id uuid,
  p_role text,
  p_created_by uuid default null
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_role_name text;
  v_role_permissions jsonb;
  v_role_id uuid;
begin
  if p_haras_id is null then
    return null;
  end if;

  v_role_name := public.default_haras_role_name(p_role);
  v_role_permissions := public.default_team_permissions(p_role);

  insert into public.haras_roles (
    haras_id,
    name,
    description,
    user_type,
    permissions,
    can_edit,
    can_view,
    can_delete,
    created_by,
    created_at,
    updated_at
  )
  values (
    p_haras_id,
    v_role_name,
    'Função padrão gerenciada automaticamente pelo sistema.',
    'Interno',
    v_role_permissions,
    true,
    true,
    false,
    p_created_by,
    now(),
    now()
  )
  on conflict (haras_id, name)
  do update set
    updated_at = now()
  returning id into v_role_id;

  return v_role_id;
end;
$function$;

update public.profiles
   set role = public.normalize_app_role(role),
       status = case when status = 'Inativo' then 'Inativo' else 'Ativo' end,
       updated_at = now()
 where role is distinct from public.normalize_app_role(role)
    or status not in ('Ativo', 'Inativo');

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (
    role = any (array['admin', 'criador', 'assessor', 'veterinario', 'peao', 'funcionario'])
  );

update public.haras_members
   set status = case when status = 'Inativo' then 'Inativo' else 'Ativo' end,
       updated_at = now()
 where status not in ('Ativo', 'Inativo');

with ranked_memberships as (
  select hm.user_id,
         hm.haras_id,
         row_number() over (
           partition by hm.user_id
           order by
             case when hm.status = 'Ativo' then 0 else 1 end,
             hm.updated_at desc,
             hm.created_at desc,
             hm.id
         ) as rn
    from public.haras_members hm
)
update public.profiles p
   set haras_id = rm.haras_id,
       updated_at = now()
  from ranked_memberships rm
 where rm.rn = 1
   and p.id = rm.user_id
   and p.haras_id is distinct from rm.haras_id;

insert into public.haras_members (
  id,
  haras_id,
  user_id,
  role_id,
  permissions,
  status,
  created_by,
  created_at,
  updated_at
)
select gen_random_uuid(),
       p.haras_id,
       p.id,
       public.ensure_default_haras_role(p.haras_id, p.role, null),
       public.default_team_permissions(p.role),
       case when p.status = 'Inativo' then 'Inativo' else 'Ativo' end,
       null,
       now(),
       now()
  from public.profiles p
 where p.haras_id is not null
   and not exists (
     select 1
       from public.haras_members hm
      where hm.haras_id = p.haras_id
        and hm.user_id = p.id
   );

update public.haras_members hm
   set role_id = public.ensure_default_haras_role(hm.haras_id, p.role, hm.created_by),
       updated_at = now()
  from public.profiles p
 where p.id = hm.user_id
   and hm.role_id is null;

update public.haras_members hm
   set permissions = coalesce(
         (
           select r.permissions
             from public.haras_roles r
            where r.id = hm.role_id
         ),
         public.default_team_permissions(p.role)
       ),
       updated_at = now()
  from public.profiles p
 where p.id = hm.user_id
   and (hm.permissions is null or hm.permissions = '{}'::jsonb);

update public.haras_members hm
   set status = case when p.status = 'Inativo' then 'Inativo' else 'Ativo' end,
       updated_at = now()
  from public.profiles p
 where p.id = hm.user_id
   and hm.status is distinct from case when p.status = 'Inativo' then 'Inativo' else 'Ativo' end;

create or replace function public.create_collaborator(
  p_email text,
  p_password text,
  p_full_name text,
  p_role text,
  p_haras_id uuid,
  p_role_id uuid default null,
  p_permissions jsonb default null,
  p_status text default 'Ativo',
  p_created_by uuid default null,
  p_phone text default null
)
returns json
language plpgsql
security definer
set search_path to 'public', 'extensions'
as $function$
declare
  v_user_id uuid;
  v_caller_id uuid;
  v_caller_role text;
  v_caller_haras_id uuid;
  v_target_role text;
  v_target_status text;
  v_target_role_id uuid;
  v_target_permissions jsonb;
begin
  v_caller_id := auth.uid();

  if v_caller_id is null then
    return json_build_object('error', 'Usuário não autenticado.');
  end if;

  select public.normalize_app_role(role), haras_id
    into v_caller_role, v_caller_haras_id
    from public.profiles
   where id = v_caller_id;

  if v_caller_role is null then
    return json_build_object('error', 'Perfil do usuário não encontrado.');
  end if;

  if v_caller_haras_id is null then
    return json_build_object('error', 'Haras do usuário não identificado.');
  end if;

  if p_haras_id is null then
    return json_build_object('error', 'Haras não identificado.');
  end if;

  if v_caller_haras_id <> p_haras_id then
    return json_build_object('error', 'Você não pode cadastrar usuários em outro haras.');
  end if;

  v_target_role := public.normalize_app_role(p_role);
  v_target_status := case when p_status = 'Inativo' then 'Inativo' else 'Ativo' end;

  if v_target_role is null then
    return json_build_object('error', 'Perfil de acesso inválido para criação.');
  end if;

  if v_target_role in ('admin', 'criador') then
    return json_build_object('error', 'Não é permitido criar administrador ou criador.');
  end if;

  if v_caller_role in ('admin', 'criador') then
    if v_target_role not in ('assessor', 'veterinario', 'peao', 'funcionario') then
      return json_build_object('error', 'Perfil de acesso inválido para criação.');
    end if;
  elsif v_caller_role = 'assessor' then
    if v_target_role not in ('veterinario', 'peao') then
      return json_build_object('error', 'Assessor só pode cadastrar Peão ou Veterinário.');
    end if;
  else
    return json_build_object('error', 'Apenas criadores ou assessores podem adicionar colaboradores.');
  end if;

  if p_role_id is not null then
    select id, permissions
      into v_target_role_id, v_target_permissions
      from public.haras_roles
     where id = p_role_id
       and haras_id = p_haras_id;

    if v_target_role_id is null then
      return json_build_object('error', 'Função da equipe inválida para este haras.');
    end if;
  else
    v_target_role_id := public.ensure_default_haras_role(p_haras_id, v_target_role, coalesce(p_created_by, v_caller_id));

    select permissions
      into v_target_permissions
      from public.haras_roles
     where id = v_target_role_id;
  end if;

  if p_permissions is not null then
    v_target_permissions := p_permissions;
  end if;

  if v_target_permissions is null then
    v_target_permissions := public.default_team_permissions(v_target_role);
  end if;

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(),
    json_build_object('full_name', p_full_name, 'role', v_target_role),
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  returning id into v_user_id;

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    haras_id,
    phone,
    status,
    created_at,
    updated_at
  )
  values (
    v_user_id,
    p_email,
    p_full_name,
    v_target_role,
    p_haras_id,
    nullif(trim(coalesce(p_phone, '')), ''),
    v_target_status,
    now(),
    now()
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        role = excluded.role,
        haras_id = excluded.haras_id,
        phone = excluded.phone,
        status = excluded.status,
        updated_at = now();

  insert into public.haras_members (
    id,
    haras_id,
    user_id,
    role_id,
    permissions,
    status,
    created_by,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    p_haras_id,
    v_user_id,
    v_target_role_id,
    v_target_permissions,
    v_target_status,
    coalesce(p_created_by, v_caller_id),
    now(),
    now()
  )
  on conflict (haras_id, user_id) do update
    set role_id = excluded.role_id,
        permissions = excluded.permissions,
        status = excluded.status,
        created_by = coalesce(public.haras_members.created_by, excluded.created_by),
        updated_at = now();

  return json_build_object(
    'success', true,
    'user_id', v_user_id,
    'haras_id', p_haras_id,
    'role', v_target_role,
    'status', v_target_status,
    'role_id', v_target_role_id,
    'permissions', v_target_permissions
  );
exception
  when unique_violation then
    return json_build_object('error', 'Email já cadastrado');
  when others then
    return json_build_object('error', sqlerrm);
end;
$function$;

create or replace function public.set_haras_member_status(
  p_user_id uuid,
  p_haras_id uuid,
  p_status text
)
returns json
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_caller_id uuid;
  v_caller_role text;
  v_caller_haras_id uuid;
  v_target_role text;
  v_target_status text;
begin
  v_caller_id := auth.uid();

  if v_caller_id is null then
    return json_build_object('error', 'Usuário não autenticado.');
  end if;

  select public.normalize_app_role(role), haras_id
    into v_caller_role, v_caller_haras_id
    from public.profiles
   where id = v_caller_id;

  if v_caller_role is null or v_caller_haras_id is null then
    return json_build_object('error', 'Perfil do usuário não encontrado.');
  end if;

  if v_caller_haras_id <> p_haras_id then
    return json_build_object('error', 'Você não pode alterar usuários de outro haras.');
  end if;

  if p_user_id = v_caller_id then
    return json_build_object('error', 'Você não pode alterar o próprio status.');
  end if;

  select public.normalize_app_role(role)
    into v_target_role
    from public.profiles
   where id = p_user_id
     and haras_id = p_haras_id;

  if v_target_role is null then
    return json_build_object('error', 'Usuário não encontrado no haras informado.');
  end if;

  if v_target_role in ('admin', 'criador') then
    return json_build_object('error', 'O status do criador principal não pode ser alterado por este fluxo.');
  end if;

  if v_caller_role = 'assessor' and v_target_role not in ('peao', 'veterinario') then
    return json_build_object('error', 'Assessor só pode alterar Peão ou Veterinário.');
  end if;

  if v_caller_role not in ('admin', 'criador', 'assessor') then
    return json_build_object('error', 'Você não tem permissão para alterar o status deste usuário.');
  end if;

  v_target_status := case when p_status = 'Inativo' then 'Inativo' else 'Ativo' end;

  update public.profiles
     set status = v_target_status,
         updated_at = now()
   where id = p_user_id
     and haras_id = p_haras_id;

  insert into public.haras_members (
    id,
    haras_id,
    user_id,
    role_id,
    permissions,
    status,
    created_by,
    created_at,
    updated_at
  )
  select gen_random_uuid(),
         p_haras_id,
         p_user_id,
         public.ensure_default_haras_role(p_haras_id, v_target_role, v_caller_id),
         public.default_team_permissions(v_target_role),
         v_target_status,
         v_caller_id,
         now(),
         now()
  on conflict (haras_id, user_id) do update
    set status = excluded.status,
        role_id = coalesce(public.haras_members.role_id, excluded.role_id),
        permissions = case
          when public.haras_members.permissions is null or public.haras_members.permissions = '{}'::jsonb
            then excluded.permissions
          else public.haras_members.permissions
        end,
        updated_at = now();

  return json_build_object(
    'success', true,
    'user_id', p_user_id,
    'haras_id', p_haras_id,
    'status', v_target_status
  );
exception
  when others then
    return json_build_object('error', sqlerrm);
end;
$function$;

create or replace function public.remove_haras_member(
  p_user_id uuid,
  p_haras_id uuid
)
returns json
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_caller_id uuid;
  v_caller_role text;
  v_caller_haras_id uuid;
  v_target_role text;
begin
  v_caller_id := auth.uid();

  if v_caller_id is null then
    return json_build_object('error', 'Usuário não autenticado.');
  end if;

  select public.normalize_app_role(role), haras_id
    into v_caller_role, v_caller_haras_id
    from public.profiles
   where id = v_caller_id;

  if v_caller_role is null or v_caller_haras_id is null then
    return json_build_object('error', 'Perfil do usuário não encontrado.');
  end if;

  if v_caller_haras_id <> p_haras_id then
    return json_build_object('error', 'Você não pode remover usuários de outro haras.');
  end if;

  if p_user_id = v_caller_id then
    return json_build_object('error', 'Você não pode remover o próprio acesso.');
  end if;

  select public.normalize_app_role(role)
    into v_target_role
    from public.profiles
   where id = p_user_id
     and haras_id = p_haras_id;

  if v_target_role is null then
    return json_build_object('error', 'Usuário não encontrado no haras informado.');
  end if;

  if v_target_role in ('admin', 'criador') then
    return json_build_object('error', 'O criador principal não pode ser removido por este fluxo.');
  end if;

  if v_caller_role = 'assessor' and v_target_role not in ('peao', 'veterinario') then
    return json_build_object('error', 'Assessor só pode remover Peão ou Veterinário.');
  end if;

  if v_caller_role not in ('admin', 'criador', 'assessor') then
    return json_build_object('error', 'Você não tem permissão para remover este usuário.');
  end if;

  update public.profiles
     set haras_id = null,
         status = 'Inativo',
         updated_at = now()
   where id = p_user_id
     and haras_id = p_haras_id;

  delete from public.haras_members
   where user_id = p_user_id
     and haras_id = p_haras_id;

  return json_build_object(
    'success', true,
    'user_id', p_user_id,
    'haras_id', p_haras_id
  );
exception
  when others then
    return json_build_object('error', sqlerrm);
end;
$function$;

drop policy if exists pending_validations_insert_policy on public.pending_validations;
drop policy if exists pending_validations_update_policy on public.pending_validations;

create policy pending_validations_insert_policy
on public.pending_validations
for insert
to authenticated
with check (
  exists (
    select 1
      from public.profiles p
     where p.id = (select auth.uid())
       and p.haras_id = pending_validations.haras_id
       and p.role = any (array['admin', 'criador', 'assessor', 'veterinario', 'peao', 'funcionario'])
  )
);

create policy pending_validations_update_policy
on public.pending_validations
for update
to authenticated
using (
  exists (
    select 1
      from public.profiles p
     where p.id = (select auth.uid())
       and p.haras_id = pending_validations.haras_id
       and p.role = any (array['admin', 'criador', 'assessor'])
  )
)
with check (
  exists (
    select 1
      from public.profiles p
     where p.id = (select auth.uid())
       and p.haras_id = pending_validations.haras_id
       and p.role = any (array['admin', 'criador', 'assessor'])
  )
);
