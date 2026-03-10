create index if not exists idx_haras_members_created_by
  on public.haras_members (created_by);

create index if not exists idx_haras_roles_created_by
  on public.haras_roles (created_by);

create index if not exists idx_health_batch_events_created_by
  on public.health_batch_events (created_by);

create index if not exists idx_health_batch_event_animals_animal_id
  on public.health_batch_event_animals (animal_id);

create index if not exists idx_inseminations_garanhao_id
  on public.inseminations (garanhao_id);

create index if not exists idx_vet_tasks_animal_id
  on public.vet_tasks (animal_id);

create index if not exists idx_vet_tasks_created_by
  on public.vet_tasks (created_by);

drop policy if exists haras_members_select_policy on public.haras_members;
drop policy if exists haras_members_write_policy on public.haras_members;
drop policy if exists haras_members_insert_policy on public.haras_members;
drop policy if exists haras_members_update_policy on public.haras_members;
drop policy if exists haras_members_delete_policy on public.haras_members;
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
        and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
    )
  )
);

create policy haras_members_insert_policy
on public.haras_members
for insert
to public
with check (
  public.user_belongs_to_haras(haras_id)
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = any (array['admin', 'criador'])
  )
);

create policy haras_members_update_policy
on public.haras_members
for update
to public
using (
  public.user_belongs_to_haras(haras_id)
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = any (array['admin', 'criador'])
  )
)
with check (
  public.user_belongs_to_haras(haras_id)
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = any (array['admin', 'criador'])
  )
);

create policy haras_members_delete_policy
on public.haras_members
for delete
to public
using (
  public.user_belongs_to_haras(haras_id)
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = any (array['admin', 'criador'])
  )
);

drop policy if exists haras_roles_write_policy on public.haras_roles;
drop policy if exists haras_roles_insert_policy on public.haras_roles;
drop policy if exists haras_roles_update_policy on public.haras_roles;
drop policy if exists haras_roles_delete_policy on public.haras_roles;
create policy haras_roles_insert_policy
on public.haras_roles
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy haras_roles_update_policy
on public.haras_roles
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy haras_roles_delete_policy
on public.haras_roles
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists health_batch_events_select_policy on public.health_batch_events;
drop policy if exists health_batch_events_write_policy on public.health_batch_events;
drop policy if exists health_batch_events_insert_policy on public.health_batch_events;
drop policy if exists health_batch_events_update_policy on public.health_batch_events;
drop policy if exists health_batch_events_delete_policy on public.health_batch_events;
create policy health_batch_events_select_policy
on public.health_batch_events
for select
to authenticated
using (public.user_belongs_to_haras(haras_id));

create policy health_batch_events_insert_policy
on public.health_batch_events
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = health_batch_events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy health_batch_events_update_policy
on public.health_batch_events
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = health_batch_events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = health_batch_events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy health_batch_events_delete_policy
on public.health_batch_events
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = health_batch_events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists health_batch_animals_select_policy on public.health_batch_event_animals;
drop policy if exists health_batch_animals_insert_policy on public.health_batch_event_animals;
create policy health_batch_animals_select_policy
on public.health_batch_event_animals
for select
to authenticated
using (public.user_belongs_to_haras(haras_id));

create policy health_batch_animals_insert_policy
on public.health_batch_event_animals
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = health_batch_event_animals.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists inseminations_write_policy on public.inseminations;
drop policy if exists inseminations_insert_policy on public.inseminations;
drop policy if exists inseminations_update_policy on public.inseminations;
drop policy if exists inseminations_delete_policy on public.inseminations;
create policy inseminations_insert_policy
on public.inseminations
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy inseminations_update_policy
on public.inseminations
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy inseminations_delete_policy
on public.inseminations
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists integrations_write_admin_policy on public.integrations;
drop policy if exists integrations_insert_admin_policy on public.integrations;
drop policy if exists integrations_update_admin_policy on public.integrations;
drop policy if exists integrations_delete_admin_policy on public.integrations;
create policy integrations_insert_admin_policy
on public.integrations
for insert
to public
with check (public.is_admin_user());

create policy integrations_update_admin_policy
on public.integrations
for update
to public
using (public.is_admin_user())
with check (public.is_admin_user());

create policy integrations_delete_admin_policy
on public.integrations
for delete
to public
using (public.is_admin_user());

drop policy if exists ovulations_write_policy on public.ovulations;
drop policy if exists ovulations_insert_policy on public.ovulations;
drop policy if exists ovulations_update_policy on public.ovulations;
drop policy if exists ovulations_delete_policy on public.ovulations;
create policy ovulations_insert_policy
on public.ovulations
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy ovulations_update_policy
on public.ovulations
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy ovulations_delete_policy
on public.ovulations
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists ovules_select_policy on public.ovules;
drop policy if exists ovules_write_policy on public.ovules;
drop policy if exists ovules_insert_policy on public.ovules;
drop policy if exists ovules_update_policy on public.ovules;
drop policy if exists ovules_delete_policy on public.ovules;
create policy ovules_select_policy
on public.ovules
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = ovules.haras_id
  )
);

create policy ovules_insert_policy
on public.ovules
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = ovules.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy ovules_update_policy
on public.ovules
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = ovules.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = ovules.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy ovules_delete_policy
on public.ovules
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = ovules.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

drop policy if exists subscription_plans_select_authenticated_policy on public.subscription_plans;
drop policy if exists subscription_plans_write_admin_policy on public.subscription_plans;
drop policy if exists subscription_plans_insert_admin_policy on public.subscription_plans;
drop policy if exists subscription_plans_update_admin_policy on public.subscription_plans;
drop policy if exists subscription_plans_delete_admin_policy on public.subscription_plans;
create policy subscription_plans_select_authenticated_policy
on public.subscription_plans
for select
to public
using ((select auth.uid()) is not null);

create policy subscription_plans_insert_admin_policy
on public.subscription_plans
for insert
to public
with check (public.is_admin_user());

create policy subscription_plans_update_admin_policy
on public.subscription_plans
for update
to public
using (public.is_admin_user())
with check (public.is_admin_user());

create policy subscription_plans_delete_admin_policy
on public.subscription_plans
for delete
to public
using (public.is_admin_user());

drop policy if exists vet_tasks_insert_policy on public.vet_tasks;
drop policy if exists vet_tasks_update_policy on public.vet_tasks;
create policy vet_tasks_insert_policy
on public.vet_tasks
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = vet_tasks.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy vet_tasks_update_policy
on public.vet_tasks
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = vet_tasks.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = vet_tasks.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists videos_select_policy on public.videos;
drop policy if exists videos_write_policy on public.videos;
drop policy if exists videos_insert_policy on public.videos;
drop policy if exists videos_update_policy on public.videos;
drop policy if exists videos_delete_policy on public.videos;
create policy videos_select_policy
on public.videos
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = videos.haras_id
  )
);

create policy videos_insert_policy
on public.videos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = videos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy videos_update_policy
on public.videos
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = videos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = videos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy videos_delete_policy
on public.videos
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = videos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);
