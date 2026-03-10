create index if not exists idx_animal_ownership_shares_owner_profile_id
  on public.animal_ownership_shares (owner_profile_id);

create index if not exists idx_health_audit_logs_changed_by
  on public.health_audit_logs (changed_by);

create index if not exists idx_pending_validations_created_by
  on public.pending_validations (created_by);

create index if not exists idx_pending_validations_validated_by
  on public.pending_validations (validated_by);

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $function$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$function$;

create or replace function public.user_can_manage_haras_admin(p_haras_id uuid)
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
        and p.role = any (array['admin', 'criador'])
    );
$function$;

drop policy if exists profiles_select_own_policy on public.profiles;
drop policy if exists profiles_update_own_policy on public.profiles;
create policy profiles_select_own_policy
on public.profiles
for select
to authenticated
using (id = (select auth.uid()));

create policy profiles_update_own_policy
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (
  id = (select auth.uid())
  and role = (
    select p.role
    from public.profiles p
    where p.id = (select auth.uid())
  )
  and not (
    haras_id is distinct from (
      select p.haras_id
      from public.profiles p
      where p.id = (select auth.uid())
    )
  )
);

drop policy if exists animals_insert_policy on public.animals;
drop policy if exists animals_update_policy on public.animals;
create policy animals_insert_policy
on public.animals
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = animals.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy animals_update_policy
on public.animals
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = animals.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = animals.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists events_insert_policy on public.events;
drop policy if exists events_update_policy on public.events;
create policy events_insert_policy
on public.events
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy events_update_policy
on public.events
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists gestations_insert_policy on public.gestations;
drop policy if exists gestations_update_policy on public.gestations;
create policy gestations_insert_policy
on public.gestations
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = gestations.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy gestations_update_policy
on public.gestations
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = gestations.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = gestations.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists vaccines_select_policy on public.vaccines;
drop policy if exists vaccines_insert_policy on public.vaccines;
drop policy if exists vaccines_update_policy on public.vaccines;
drop policy if exists vaccines_delete_policy on public.vaccines;
create policy vaccines_select_policy
on public.vaccines
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = vaccines.haras_id
  )
);

create policy vaccines_insert_policy
on public.vaccines
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
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
    where p.id = (select auth.uid())
      and p.haras_id = vaccines.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
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
    where p.id = (select auth.uid())
      and p.haras_id = vaccines.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists exams_select_policy on public.exams;
drop policy if exists exams_insert_policy on public.exams;
drop policy if exists exams_update_policy on public.exams;
drop policy if exists exams_delete_policy on public.exams;
create policy exams_select_policy
on public.exams
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = exams.haras_id
  )
);

create policy exams_insert_policy
on public.exams
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
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
    where p.id = (select auth.uid())
      and p.haras_id = exams.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
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
    where p.id = (select auth.uid())
      and p.haras_id = exams.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists animal_location_history_select_policy on public.animal_location_history;
drop policy if exists animal_location_history_insert_policy on public.animal_location_history;
drop policy if exists animal_location_history_update_policy on public.animal_location_history;
drop policy if exists animal_location_history_delete_policy on public.animal_location_history;
create policy animal_location_history_select_policy
on public.animal_location_history
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = animal_location_history.haras_id
  )
);

create policy animal_location_history_insert_policy
on public.animal_location_history
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
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
    where p.id = (select auth.uid())
      and p.haras_id = animal_location_history.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
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
    where p.id = (select auth.uid())
      and p.haras_id = animal_location_history.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists animal_videos_select_policy on public.animal_videos;
drop policy if exists animal_videos_insert_policy on public.animal_videos;
drop policy if exists animal_videos_update_policy on public.animal_videos;
drop policy if exists animal_videos_delete_policy on public.animal_videos;
create policy animal_videos_select_policy
on public.animal_videos
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = animal_videos.haras_id
  )
);

create policy animal_videos_insert_policy
on public.animal_videos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
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
    where p.id = (select auth.uid())
      and p.haras_id = animal_videos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
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
    where p.id = (select auth.uid())
      and p.haras_id = animal_videos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

drop policy if exists awards_select_policy on public.awards;
drop policy if exists awards_write_policy on public.awards;
drop policy if exists awards_insert_policy on public.awards;
drop policy if exists awards_update_policy on public.awards;
drop policy if exists awards_delete_policy on public.awards;
create policy awards_select_policy
on public.awards
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = awards.haras_id
  )
);

create policy awards_insert_policy
on public.awards
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = awards.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy awards_update_policy
on public.awards
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = awards.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = awards.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy awards_delete_policy
on public.awards
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = awards.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

drop policy if exists documents_select_policy on public.documents;
drop policy if exists documents_write_policy on public.documents;
drop policy if exists documents_insert_policy on public.documents;
drop policy if exists documents_update_policy on public.documents;
drop policy if exists documents_delete_policy on public.documents;
create policy documents_select_policy
on public.documents
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = documents.haras_id
  )
);

create policy documents_insert_policy
on public.documents
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = documents.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy documents_update_policy
on public.documents
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = documents.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = documents.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy documents_delete_policy
on public.documents
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = documents.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

drop policy if exists reproduction_documents_select_policy on public.reproduction_documents;
create policy reproduction_documents_select_policy
on public.reproduction_documents
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = reproduction_documents.haras_id
  )
);

drop policy if exists embryos_select_policy on public.embryos;
drop policy if exists embryos_write_policy on public.embryos;
drop policy if exists embryos_insert_policy on public.embryos;
drop policy if exists embryos_update_policy on public.embryos;
drop policy if exists embryos_delete_policy on public.embryos;
create policy embryos_select_policy
on public.embryos
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = embryos.haras_id
  )
);

create policy embryos_insert_policy
on public.embryos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = embryos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy embryos_update_policy
on public.embryos
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = embryos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = embryos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

create policy embryos_delete_policy
on public.embryos
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = embryos.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario'])
  )
);

drop policy if exists reproductive_events_insert_policy on public.reproductive_events;
drop policy if exists reproductive_events_update_policy on public.reproductive_events;
create policy reproductive_events_insert_policy
on public.reproductive_events
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = reproductive_events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy reproductive_events_update_policy
on public.reproductive_events
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = reproductive_events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = reproductive_events.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists admin_notifications_write_admin_policy on public.admin_notifications;
drop policy if exists admin_notifications_insert_admin_policy on public.admin_notifications;
drop policy if exists admin_notifications_update_admin_policy on public.admin_notifications;
drop policy if exists admin_notifications_delete_admin_policy on public.admin_notifications;
create policy admin_notifications_insert_admin_policy
on public.admin_notifications
for insert
to public
with check (public.is_admin_user());

create policy admin_notifications_update_admin_policy
on public.admin_notifications
for update
to public
using (public.is_admin_user())
with check (public.is_admin_user());

create policy admin_notifications_delete_admin_policy
on public.admin_notifications
for delete
to public
using (public.is_admin_user());

drop policy if exists auction_registrations_write_policy on public.auction_registrations;
drop policy if exists auction_registrations_insert_policy on public.auction_registrations;
drop policy if exists auction_registrations_update_policy on public.auction_registrations;
drop policy if exists auction_registrations_delete_policy on public.auction_registrations;
create policy auction_registrations_insert_policy
on public.auction_registrations
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy auction_registrations_update_policy
on public.auction_registrations
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy auction_registrations_delete_policy
on public.auction_registrations
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists auctions_write_policy on public.auctions;
drop policy if exists auctions_insert_policy on public.auctions;
drop policy if exists auctions_update_policy on public.auctions;
drop policy if exists auctions_delete_policy on public.auctions;
create policy auctions_insert_policy
on public.auctions
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy auctions_update_policy
on public.auctions
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy auctions_delete_policy
on public.auctions
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists haras_settings_write_policy on public.haras_settings;
drop policy if exists haras_settings_insert_policy on public.haras_settings;
drop policy if exists haras_settings_update_policy on public.haras_settings;
drop policy if exists haras_settings_delete_policy on public.haras_settings;
create policy haras_settings_insert_policy
on public.haras_settings
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy haras_settings_update_policy
on public.haras_settings
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy haras_settings_delete_policy
on public.haras_settings
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists import_history_write_policy on public.import_history;
drop policy if exists import_history_insert_policy on public.import_history;
drop policy if exists import_history_update_policy on public.import_history;
drop policy if exists import_history_delete_policy on public.import_history;
create policy import_history_insert_policy
on public.import_history
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy import_history_update_policy
on public.import_history
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy import_history_delete_policy
on public.import_history
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists platform_metrics_write_admin_policy on public.platform_metrics;
drop policy if exists platform_metrics_insert_admin_policy on public.platform_metrics;
drop policy if exists platform_metrics_update_admin_policy on public.platform_metrics;
drop policy if exists platform_metrics_delete_admin_policy on public.platform_metrics;
create policy platform_metrics_insert_admin_policy
on public.platform_metrics
for insert
to public
with check (public.is_admin_user());

create policy platform_metrics_update_admin_policy
on public.platform_metrics
for update
to public
using (public.is_admin_user())
with check (public.is_admin_user());

create policy platform_metrics_delete_admin_policy
on public.platform_metrics
for delete
to public
using (public.is_admin_user());

drop policy if exists profile_settings_select_own_policy on public.profile_settings;
drop policy if exists profile_settings_write_own_policy on public.profile_settings;
drop policy if exists profile_settings_insert_own_policy on public.profile_settings;
drop policy if exists profile_settings_update_own_policy on public.profile_settings;
drop policy if exists profile_settings_delete_own_policy on public.profile_settings;
create policy profile_settings_select_own_policy
on public.profile_settings
for select
to public
using (user_id = (select auth.uid()));

create policy profile_settings_insert_own_policy
on public.profile_settings
for insert
to public
with check (user_id = (select auth.uid()));

create policy profile_settings_update_own_policy
on public.profile_settings
for update
to public
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy profile_settings_delete_own_policy
on public.profile_settings
for delete
to public
using (user_id = (select auth.uid()));

drop policy if exists haras_insert_policy on public.haras;
create policy haras_insert_policy
on public.haras
for insert
to public
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = any (array['admin', 'criador'])
  )
);

drop policy if exists health_audit_logs_select_policy on public.health_audit_logs;
create policy health_audit_logs_select_policy
on public.health_audit_logs
for select
to public
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = health_audit_logs.haras_id
  )
);

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
      and p.role = any (array['admin', 'criador', 'assessor', 'acessor', 'veterinario', 'peao', 'funcionario'])
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
      and p.role = any (array['admin', 'criador', 'assessor', 'acessor'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = pending_validations.haras_id
      and p.role = any (array['admin', 'criador', 'assessor', 'acessor'])
  )
);

drop policy if exists tasks_insert_policy on public.tasks;
drop policy if exists tasks_update_policy on public.tasks;
create policy tasks_insert_policy
on public.tasks
for insert
to public
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = tasks.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy tasks_update_policy
on public.tasks
for update
to public
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = tasks.haras_id
      and (
        p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
        or (
          p.role = any (array['peao', 'employee'])
          and tasks.responsible_id = (select auth.uid())
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = tasks.haras_id
      and (
        p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
        or (
          p.role = any (array['peao', 'employee'])
          and tasks.responsible_id = (select auth.uid())
        )
      )
  )
);

drop policy if exists task_executions_insert_policy on public.task_executions;
create policy task_executions_insert_policy
on public.task_executions
for insert
to public
with check (
  exists (
    select 1
    from public.profiles p
    join public.tasks t
      on t.id = task_executions.task_id
     and t.haras_id = task_executions.haras_id
    where p.id = (select auth.uid())
      and p.haras_id = task_executions.haras_id
      and (
        p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
        or (
          p.role = any (array['peao', 'employee'])
          and task_executions.executed_by = (select auth.uid())
          and t.responsible_id = (select auth.uid())
        )
      )
  )
);
