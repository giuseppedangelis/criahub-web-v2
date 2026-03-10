create index if not exists idx_gestations_covering_id
  on public.gestations (covering_id);

create index if not exists idx_gestations_garanhao_id
  on public.gestations (garanhao_id);

create index if not exists idx_gestations_potro_id
  on public.gestations (potro_id);

create index if not exists idx_gestations_haras_data_prevista_parto_asc
  on public.gestations (haras_id, data_prevista_parto asc);

create index if not exists idx_reproduction_documents_haras_created_at_desc
  on public.reproduction_documents (haras_id, created_at desc);

create index if not exists idx_reproduction_documents_animal_id
  on public.reproduction_documents (animal_id);

create index if not exists idx_reproduction_documents_created_by
  on public.reproduction_documents (created_by);

create index if not exists idx_reproduction_documents_embryo_id
  on public.reproduction_documents (embryo_id);

create index if not exists idx_reproduction_documents_ovule_id
  on public.reproduction_documents (ovule_id);

create index if not exists idx_reproduction_protocols_haras_created_at_desc
  on public.reproduction_protocols (haras_id, created_at desc);

create index if not exists idx_reproduction_protocol_applications_haras_created_at_desc
  on public.reproduction_protocol_applications (haras_id, created_at desc);

create index if not exists idx_reproduction_protocol_applications_created_by
  on public.reproduction_protocol_applications (created_by);

create index if not exists idx_reproduction_protocol_applications_protocol_id
  on public.reproduction_protocol_applications (protocol_id);

create or replace function public.get_reproduction_stats(
  p_haras_id uuid,
  p_year integer default null
)
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
  with params as (
    select coalesce(p_year, extract(year from current_date)::int) as ref_year
  ),
  counts as (
    select
      count(*)::int as total_gestations,
      count(*) filter (where g.status = 'Em andamento')::int as confirmed_gestations,
      count(*) filter (where g.status = 'Parto realizado')::int as births,
      count(*) filter (where g.status = 'Abortada')::int as abortions
    from public.gestations g
    cross join params
    where g.haras_id = p_haras_id
      and g.data_diagnostico >= make_date(params.ref_year, 1, 1)
      and g.data_diagnostico < make_date(params.ref_year + 1, 1, 1)
  )
  select jsonb_build_object(
    'totalGestations', counts.total_gestations,
    'confirmedGestations', counts.confirmed_gestations,
    'births', counts.births,
    'abortions', counts.abortions,
    'successRate', case
      when counts.total_gestations > 0 then round((counts.births::numeric / counts.total_gestations::numeric) * 100, 2)
      else 0
    end
  )
  from counts;
$function$;

grant execute on function public.get_reproduction_stats(uuid, integer) to authenticated;

drop policy if exists coverings_write_policy on public.coverings;
drop policy if exists coverings_insert_policy on public.coverings;
drop policy if exists coverings_update_policy on public.coverings;
drop policy if exists coverings_delete_policy on public.coverings;
create policy coverings_insert_policy
on public.coverings
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy coverings_update_policy
on public.coverings
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy coverings_delete_policy
on public.coverings
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists reproduction_documents_write_policy on public.reproduction_documents;
drop policy if exists reproduction_documents_insert_policy on public.reproduction_documents;
drop policy if exists reproduction_documents_update_policy on public.reproduction_documents;
drop policy if exists reproduction_documents_delete_policy on public.reproduction_documents;
create policy reproduction_documents_insert_policy
on public.reproduction_documents
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = reproduction_documents.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy reproduction_documents_update_policy
on public.reproduction_documents
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = reproduction_documents.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = reproduction_documents.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy reproduction_documents_delete_policy
on public.reproduction_documents
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = reproduction_documents.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

drop policy if exists reproduction_protocols_write_policy on public.reproduction_protocols;
drop policy if exists reproduction_protocols_insert_policy on public.reproduction_protocols;
drop policy if exists reproduction_protocols_update_policy on public.reproduction_protocols;
drop policy if exists reproduction_protocols_delete_policy on public.reproduction_protocols;
create policy reproduction_protocols_insert_policy
on public.reproduction_protocols
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy reproduction_protocols_update_policy
on public.reproduction_protocols
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy reproduction_protocols_delete_policy
on public.reproduction_protocols
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists reproduction_protocol_applications_write_policy on public.reproduction_protocol_applications;
drop policy if exists reproduction_protocol_applications_insert_policy on public.reproduction_protocol_applications;
drop policy if exists reproduction_protocol_applications_update_policy on public.reproduction_protocol_applications;
drop policy if exists reproduction_protocol_applications_delete_policy on public.reproduction_protocol_applications;
create policy reproduction_protocol_applications_insert_policy
on public.reproduction_protocol_applications
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy reproduction_protocol_applications_update_policy
on public.reproduction_protocol_applications
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy reproduction_protocol_applications_delete_policy
on public.reproduction_protocol_applications
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists sales_write_policy on public.sales;
drop policy if exists sales_insert_policy on public.sales;
drop policy if exists sales_update_policy on public.sales;
drop policy if exists sales_delete_policy on public.sales;
create policy sales_insert_policy
on public.sales
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy sales_update_policy
on public.sales
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy sales_delete_policy
on public.sales
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists storage_files_write_policy on public.storage_files;
drop policy if exists storage_files_insert_policy on public.storage_files;
drop policy if exists storage_files_update_policy on public.storage_files;
drop policy if exists storage_files_delete_policy on public.storage_files;
create policy storage_files_insert_policy
on public.storage_files
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy storage_files_update_policy
on public.storage_files
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy storage_files_delete_policy
on public.storage_files
for delete
to public
using (public.user_can_manage_haras_data(haras_id));
