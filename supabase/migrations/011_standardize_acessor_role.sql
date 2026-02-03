-- Padroniza o papel "Acessor" no banco

do $$
begin
  if exists (
    select 1
      from pg_type
     where typname = 'user_role'
  ) then
    if not exists (
      select 1
        from pg_enum e
        join pg_type t on t.oid = e.enumtypid
       where t.typname = 'user_role'
         and e.enumlabel = 'acessor'
    ) then
      alter type user_role add value 'acessor';
    end if;
  end if;
end $$;

-- Normaliza valores antigos no profile (assessor/advisor -> acessor)
update public.profiles
   set role = 'acessor'
 where role::text in ('assessor', 'advisor');

-- Renomeia funções "Assessor" para "Acessor" e evita conflito de nomes
do $$
declare
  r record;
begin
  for r in
    select old_role.id as old_id,
           new_role.id as new_id
      from public.haras_roles old_role
      join public.haras_roles new_role
        on old_role.haras_id = new_role.haras_id
       and lower(new_role.name) = 'acessor'
     where lower(old_role.name) = 'assessor'
       and old_role.id <> new_role.id
  loop
    update public.haras_members
       set role_id = r.new_id
     where role_id = r.old_id;

    delete from public.haras_roles
     where id = r.old_id;
  end loop;

  update public.haras_roles
     set name = 'Acessor'
   where lower(name) = 'assessor';
end $$;
