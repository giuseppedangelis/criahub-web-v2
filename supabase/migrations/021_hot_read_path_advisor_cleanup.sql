create index if not exists idx_tasks_animal_id
  on public.tasks (animal_id);

create index if not exists idx_tasks_responsible_id
  on public.tasks (responsible_id);

create index if not exists idx_tasks_created_by
  on public.tasks (created_by);

create index if not exists idx_tasks_last_execution_id
  on public.tasks (last_execution_id);

create index if not exists idx_task_executions_task_id
  on public.task_executions (task_id);

create index if not exists idx_breeding_events_created_by
  on public.breeding_events (created_by);

create index if not exists idx_breeding_events_mare_id
  on public.breeding_events (mare_id);

create index if not exists idx_breeding_events_stallion_id
  on public.breeding_events (stallion_id);

create index if not exists idx_reproductive_exams_animal_id
  on public.reproductive_exams (animal_id);

create index if not exists idx_reproductive_exams_created_by
  on public.reproductive_exams (created_by);

create index if not exists idx_semen_inventory_stallion_stallion_id
  on public.semen_inventory_stallion (stallion_id);

create index if not exists idx_semen_movements_breeding_event_id
  on public.semen_movements (breeding_event_id);

create index if not exists idx_semen_movements_created_by
  on public.semen_movements (created_by);

create index if not exists idx_semen_movements_stallion_id
  on public.semen_movements (stallion_id);

create index if not exists idx_service_orders_created_by
  on public.service_orders (created_by);

create index if not exists idx_sync_logs_integration_id
  on public.sync_logs (integration_id);

create index if not exists idx_sync_logs_log_time_desc
  on public.sync_logs (log_time desc);

create index if not exists idx_system_alerts_haras_module_resolved_at
  on public.system_alerts (haras_id, module, resolved_at);

drop policy if exists semen_inventory_write_policy on public.semen_inventory_stallion;
drop policy if exists semen_inventory_insert_policy on public.semen_inventory_stallion;
drop policy if exists semen_inventory_update_policy on public.semen_inventory_stallion;
drop policy if exists semen_inventory_delete_policy on public.semen_inventory_stallion;
create policy semen_inventory_insert_policy
on public.semen_inventory_stallion
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = semen_inventory_stallion.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy semen_inventory_update_policy
on public.semen_inventory_stallion
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = semen_inventory_stallion.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = semen_inventory_stallion.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy semen_inventory_delete_policy
on public.semen_inventory_stallion
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = semen_inventory_stallion.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

drop policy if exists sync_logs_write_admin_policy on public.sync_logs;
drop policy if exists sync_logs_insert_admin_policy on public.sync_logs;
drop policy if exists sync_logs_update_admin_policy on public.sync_logs;
drop policy if exists sync_logs_delete_admin_policy on public.sync_logs;
create policy sync_logs_insert_admin_policy
on public.sync_logs
for insert
to public
with check (public.is_admin_user());

create policy sync_logs_update_admin_policy
on public.sync_logs
for update
to public
using (public.is_admin_user())
with check (public.is_admin_user());

create policy sync_logs_delete_admin_policy
on public.sync_logs
for delete
to public
using (public.is_admin_user());

drop policy if exists system_alerts_write_policy on public.system_alerts;
drop policy if exists system_alerts_insert_policy on public.system_alerts;
drop policy if exists system_alerts_update_policy on public.system_alerts;
drop policy if exists system_alerts_delete_policy on public.system_alerts;
create policy system_alerts_insert_policy
on public.system_alerts
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy system_alerts_update_policy
on public.system_alerts
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy system_alerts_delete_policy
on public.system_alerts
for delete
to public
using (public.user_can_manage_haras_data(haras_id));
