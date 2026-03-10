create index if not exists idx_animal_link_queue_created_by
  on public.animal_link_queue (created_by);

create index if not exists idx_animal_link_queue_resolved_by
  on public.animal_link_queue (resolved_by);

create index if not exists idx_animal_location_history_changed_by
  on public.animal_location_history (changed_by);

create index if not exists idx_animal_location_history_animal_changed_at_desc
  on public.animal_location_history (animal_id, changed_at desc);

create index if not exists idx_reports_criado_por
  on public.reports (criado_por);

create index if not exists idx_health_records_animal_data_procedimento_desc
  on public.health_records (animal_id, data_procedimento desc);

create index if not exists idx_vaccines_animal_data_aplicacao_desc
  on public.vaccines (animal_id, data_aplicacao desc);

create index if not exists idx_vaccines_haras_data_proxima_dose
  on public.vaccines (haras_id, data_proxima_dose);

create index if not exists idx_exams_animal_data_exame_desc
  on public.exams (animal_id, data_exame desc);

create index if not exists idx_animal_videos_animal_created_at_desc
  on public.animal_videos (animal_id, created_at desc);

drop policy if exists animal_location_history_write_policy on public.animal_location_history;
create policy animal_location_history_insert_policy
on public.animal_location_history
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = animal_location_history.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy animal_location_history_update_policy
on public.animal_location_history
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = animal_location_history.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = animal_location_history.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy animal_location_history_delete_policy
on public.animal_location_history
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = animal_location_history.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists reports_write_policy on public.reports;
create policy reports_insert_policy
on public.reports
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy reports_update_policy
on public.reports
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy reports_delete_policy
on public.reports
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists vaccines_write_policy on public.vaccines;
create policy vaccines_insert_policy
on public.vaccines
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = vaccines.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy vaccines_update_policy
on public.vaccines
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = vaccines.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = vaccines.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy vaccines_delete_policy
on public.vaccines
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = vaccines.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists animal_videos_write_policy on public.animal_videos;
create policy animal_videos_insert_policy
on public.animal_videos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = animal_videos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy animal_videos_update_policy
on public.animal_videos
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = animal_videos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = animal_videos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy animal_videos_delete_policy
on public.animal_videos
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = animal_videos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

drop policy if exists exams_write_policy on public.exams;
create policy exams_insert_policy
on public.exams
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = exams.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy exams_update_policy
on public.exams
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = exams.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = exams.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy exams_delete_policy
on public.exams
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.haras_id = exams.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);
