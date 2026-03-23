-- Enforce canonical ingestion rules for animals and secure public support tables.

alter table public.animals
  add column if not exists ingestion_source text;

update public.animals
   set ingestion_source = case
     when abccmm_rowid is not null then 'abccmm_plantel'
     else 'manual'
   end
 where ingestion_source is null;

alter table public.animals
  alter column ingestion_source set default 'manual';

alter table public.animals
  alter column ingestion_source set not null;

alter table public.animals
  drop constraint if exists animals_ingestion_source_check;

alter table public.animals
  add constraint animals_ingestion_source_check
  check (ingestion_source = any (array['manual', 'abccmm_plantel']));

create or replace function public.user_can_manage_haras_team(p_haras_id uuid)
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
         and p.haras_id = p_haras_id
         and p.role = any (array['admin', 'criador', 'assessor'])
    );
$function$;

create or replace function public.enforce_animal_ingestion_rules()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
begin
  new.ingestion_source := lower(trim(coalesce(new.ingestion_source, 'manual')));
  new.abccmm_rowid := nullif(trim(coalesce(new.abccmm_rowid, '')), '');

  if new.ingestion_source = 'manual' and new.abccmm_rowid is not null then
    raise exception 'Animais oficiais do plantel só podem ser cadastrados via importação ABCCMM.';
  end if;

  if new.ingestion_source = 'abccmm_plantel' and new.abccmm_rowid is null then
    raise exception 'Importação oficial ABCCMM exige abccmm_rowid.';
  end if;

  return new;
end;
$function$;

drop trigger if exists animals_enforce_ingestion_rules on public.animals;

create trigger animals_enforce_ingestion_rules
before insert or update of abccmm_rowid, ingestion_source
on public.animals
for each row
execute function public.enforce_animal_ingestion_rules();

create or replace function public.enforce_condominium_share_import()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
declare
  v_is_official boolean;
begin
  new.source := nullif(trim(coalesce(new.source, '')), '');

  if coalesce(new.source, '') <> 'abccmm_condominio' then
    raise exception 'Animais em condomínio só podem ser vinculados via importação ABCCMM.';
  end if;

  select exists (
    select 1
      from public.animals a
     where a.id = new.animal_id
       and a.haras_id = new.haras_id
       and a.abccmm_rowid is not null
       and a.ingestion_source = 'abccmm_plantel'
  )
    into v_is_official;

  if not v_is_official then
    raise exception 'Cota de condomínio exige animal oficial previamente importado via ABCCMM.';
  end if;

  return new;
end;
$function$;

drop trigger if exists animal_ownership_shares_enforce_import on public.animal_ownership_shares;

create trigger animal_ownership_shares_enforce_import
before insert or update
on public.animal_ownership_shares
for each row
execute function public.enforce_condominium_share_import();

alter table public.animal_ownership_shares enable row level security;
alter table public.animal_link_queue enable row level security;

drop policy if exists animal_ownership_shares_select_policy on public.animal_ownership_shares;
drop policy if exists animal_ownership_shares_insert_policy on public.animal_ownership_shares;
drop policy if exists animal_ownership_shares_update_policy on public.animal_ownership_shares;
drop policy if exists animal_ownership_shares_delete_policy on public.animal_ownership_shares;

create policy animal_ownership_shares_select_policy
on public.animal_ownership_shares
for select
to authenticated
using (public.user_belongs_to_haras(haras_id));

create policy animal_ownership_shares_insert_policy
on public.animal_ownership_shares
for insert
to authenticated
with check (
  public.user_can_manage_haras_team(haras_id)
  and coalesce(source, '') = 'abccmm_condominio'
);

create policy animal_ownership_shares_update_policy
on public.animal_ownership_shares
for update
to authenticated
using (public.user_can_manage_haras_team(haras_id))
with check (
  public.user_can_manage_haras_team(haras_id)
  and coalesce(source, '') = 'abccmm_condominio'
);

create policy animal_ownership_shares_delete_policy
on public.animal_ownership_shares
for delete
to authenticated
using (public.user_can_manage_haras_team(haras_id));

drop policy if exists animal_link_queue_select_policy on public.animal_link_queue;
drop policy if exists animal_link_queue_insert_policy on public.animal_link_queue;
drop policy if exists animal_link_queue_update_policy on public.animal_link_queue;
drop policy if exists animal_link_queue_delete_policy on public.animal_link_queue;

create policy animal_link_queue_select_policy
on public.animal_link_queue
for select
to authenticated
using (public.user_belongs_to_haras(haras_id));

create policy animal_link_queue_insert_policy
on public.animal_link_queue
for insert
to authenticated
with check (public.user_can_manage_haras_team(haras_id));

create policy animal_link_queue_update_policy
on public.animal_link_queue
for update
to authenticated
using (public.user_can_manage_haras_team(haras_id))
with check (public.user_can_manage_haras_team(haras_id));

create policy animal_link_queue_delete_policy
on public.animal_link_queue
for delete
to authenticated
using (public.user_can_manage_haras_team(haras_id));
