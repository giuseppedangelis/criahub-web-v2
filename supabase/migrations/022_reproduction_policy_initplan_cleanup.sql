create index if not exists idx_transactions_animal_id
  on public.transactions (animal_id);

drop policy if exists breeding_events_select_policy on public.breeding_events;
drop policy if exists breeding_events_insert_policy on public.breeding_events;
drop policy if exists breeding_events_update_policy on public.breeding_events;
create policy breeding_events_select_policy
on public.breeding_events
for select
to authenticated
using (public.user_belongs_to_haras(haras_id));

create policy breeding_events_insert_policy
on public.breeding_events
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = breeding_events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy breeding_events_update_policy
on public.breeding_events
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = breeding_events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = breeding_events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists reproductive_exams_insert_policy on public.reproductive_exams;
drop policy if exists reproductive_exams_update_policy on public.reproductive_exams;
create policy reproductive_exams_insert_policy
on public.reproductive_exams
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = reproductive_exams.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy reproductive_exams_update_policy
on public.reproductive_exams
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = reproductive_exams.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = reproductive_exams.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists semen_inventory_select_policy on public.semen_inventory_stallion;
create policy semen_inventory_select_policy
on public.semen_inventory_stallion
for select
to authenticated
using (public.user_belongs_to_haras(haras_id));

drop policy if exists semen_movements_select_policy on public.semen_movements;
drop policy if exists semen_movements_insert_policy on public.semen_movements;
create policy semen_movements_select_policy
on public.semen_movements
for select
to authenticated
using (public.user_belongs_to_haras(haras_id));

create policy semen_movements_insert_policy
on public.semen_movements
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = semen_movements.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);
