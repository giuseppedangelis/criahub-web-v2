create table if not exists public.haras_roles (
  id uuid primary key default gen_random_uuid(),
  haras_id uuid not null references public.haras(id) on delete cascade,
  name text not null,
  description text,
  user_type text not null default 'Interno',
  permissions jsonb not null default '{}'::jsonb,
  can_edit boolean not null default true,
  can_view boolean not null default true,
  can_delete boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (haras_id, name)
);

create table if not exists public.haras_members (
  id uuid primary key default gen_random_uuid(),
  haras_id uuid not null references public.haras(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid references public.haras_roles(id) on delete set null,
  permissions jsonb not null default '{}'::jsonb,
  status text not null default 'Ativo' check (status = any (array['Ativo','Inativo'])),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (haras_id, user_id)
);

create index if not exists haras_roles_haras_id_idx on public.haras_roles(haras_id);
create index if not exists haras_members_haras_id_idx on public.haras_members(haras_id);
create index if not exists haras_members_role_id_idx on public.haras_members(role_id);
create index if not exists haras_members_user_id_idx on public.haras_members(user_id);

with roles as (
  select h.id as haras_id,
         'Administrador'::text as name,
         'Interno'::text as user_type,
         jsonb_build_object(
           'viewHerd', true,
           'registerActivities', true,
           'healthManagement', true,
           'reproduction', true,
           'financialManagement', true,
           'trainingManagement', true,
           'teamManagement', true,
           'documentManagement', true,
           'fullAdministrative', true
         ) as permissions,
         true as can_view,
         true as can_edit,
         true as can_delete
    from public.haras h
  union all
  select h.id,
         'Assessor',
         'Interno',
         jsonb_build_object(
           'viewHerd', true,
           'registerActivities', true,
           'healthManagement', true,
           'reproduction', true,
           'financialManagement', true,
           'trainingManagement', true,
           'teamManagement', true,
           'documentManagement', true,
           'fullAdministrative', false
         ),
         true,
         true,
         false
    from public.haras h
  union all
  select h.id,
         'Veterinário',
         'Interno',
         jsonb_build_object(
           'viewHerd', true,
           'registerActivities', true,
           'healthManagement', true,
           'reproduction', true,
           'financialManagement', false,
           'trainingManagement', false,
           'teamManagement', false,
           'documentManagement', true,
           'fullAdministrative', false
         ),
         true,
         true,
         false
    from public.haras h
  union all
  select h.id,
         'Peão',
         'Interno',
         jsonb_build_object(
           'viewHerd', true,
           'registerActivities', true,
           'healthManagement', true,
           'reproduction', false,
           'financialManagement', false,
           'trainingManagement', false,
           'teamManagement', false,
           'documentManagement', false,
           'fullAdministrative', false
         ),
         true,
         true,
         false
    from public.haras h
  union all
  select h.id,
         'Colaborador',
         'Interno',
         jsonb_build_object(
           'viewHerd', true,
           'registerActivities', false,
           'healthManagement', false,
           'reproduction', false,
           'financialManagement', false,
           'trainingManagement', false,
           'teamManagement', false,
           'documentManagement', false,
           'fullAdministrative', false
         ),
         true,
         false,
         false
    from public.haras h
)
insert into public.haras_roles (haras_id, name, user_type, permissions, can_view, can_edit, can_delete)
select haras_id, name, user_type, permissions, can_view, can_edit, can_delete
  from roles
on conflict (haras_id, name) do nothing;

insert into public.haras_members (haras_id, user_id, role_id, permissions, status)
select p.haras_id,
       p.id as user_id,
       r.id as role_id,
       coalesce(r.permissions, '{}'::jsonb) as permissions,
       coalesce(p.status, 'Ativo') as status
  from public.profiles p
  left join public.haras_roles r
    on r.haras_id = p.haras_id
   and r.name = case
     when p.role = 'criador' then 'Administrador'
     when p.role = 'assessor' then 'Assessor'
     when p.role = 'veterinario' then 'Veterinário'
     when p.role = 'peao' then 'Peão'
     else 'Colaborador'
   end
 where p.haras_id is not null
on conflict (haras_id, user_id) do nothing;
