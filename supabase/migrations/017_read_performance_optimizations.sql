create extension if not exists pg_trgm with schema extensions;

create index if not exists idx_animals_haras_nome
on public.animals using btree (haras_id, nome);

create index if not exists idx_animals_haras_status_created_at_desc
on public.animals using btree (haras_id, status, created_at desc);

create index if not exists idx_animals_nome_trgm
on public.animals using gin (nome extensions.gin_trgm_ops);

create index if not exists idx_animals_registro_trgm
on public.animals using gin (registro extensions.gin_trgm_ops);

create index if not exists idx_events_haras_data_inicio_asc
on public.events using btree (haras_id, data_inicio asc);

create index if not exists idx_events_haras_origem_origem_id_created_at_desc
on public.events using btree (haras_id, origem, origem_id, created_at desc);

create index if not exists idx_transactions_haras_data_transacao_desc
on public.transactions using btree (haras_id, data_transacao desc);

create index if not exists idx_transactions_haras_tipo_data_transacao_desc
on public.transactions using btree (haras_id, tipo, data_transacao desc);

create index if not exists idx_health_records_haras_proximadata
on public.health_records using btree (haras_id, proximadata);

create index if not exists idx_notifications_user_id_lida
on public.notifications using btree (user_id, lida);

create index if not exists idx_coverings_haras_data_cobertura_desc
on public.coverings using btree (haras_id, data_cobertura desc);

create index if not exists idx_gestations_haras_status_data_diagnostico_desc
on public.gestations using btree (haras_id, status, data_diagnostico desc);

create or replace function public.user_belongs_to_haras(p_haras_id uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $function$
  select
    exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.haras_id = p_haras_id
    )
    or exists (
      select 1
      from public.haras_members hm
      where hm.user_id = (select auth.uid())
        and hm.haras_id = p_haras_id
        and lower(coalesce(hm.status, '')) like 'ativo%'
    );
$function$;

create or replace function public.user_can_manage_haras_data(p_haras_id uuid)
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
        and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario', 'assessor', 'acessor'])
    );
$function$;

drop policy if exists health_records_write_policy on public.health_records;
create policy health_records_insert_policy
on public.health_records
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = health_records.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy health_records_update_policy
on public.health_records
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = health_records.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = health_records.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

create policy health_records_delete_policy
on public.health_records
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.haras_id = health_records.haras_id
      and p.role = any (array['admin', 'criador', 'veterinario', 'funcionario'])
  )
);

drop policy if exists notifications_write_policy on public.notifications;
create policy notifications_insert_policy
on public.notifications
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy notifications_update_policy
on public.notifications
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy notifications_delete_policy
on public.notifications
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists service_orders_write_policy on public.service_orders;
create policy service_orders_insert_policy
on public.service_orders
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy service_orders_update_policy
on public.service_orders
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy service_orders_delete_policy
on public.service_orders
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

drop policy if exists transactions_write_policy on public.transactions;
create policy transactions_insert_policy
on public.transactions
for insert
to public
with check (public.user_can_manage_haras_data(haras_id));

create policy transactions_update_policy
on public.transactions
for update
to public
using (public.user_can_manage_haras_data(haras_id))
with check (public.user_can_manage_haras_data(haras_id));

create policy transactions_delete_policy
on public.transactions
for delete
to public
using (public.user_can_manage_haras_data(haras_id));

create or replace function public.get_dashboard_snapshot(
  p_haras_id uuid,
  p_months int default 6,
  p_events_limit int default 5,
  p_activities_limit int default 5
)
returns jsonb
language plpgsql
stable
set search_path to 'public'
as $function$
declare
  v_today date := current_date;
  v_months int := greatest(coalesce(p_months, 6), 1);
  v_events_limit int := greatest(coalesce(p_events_limit, 5), 1);
  v_activities_limit int := greatest(coalesce(p_activities_limit, 5), 1);
  v_current_user_id uuid := (select auth.uid());
  v_month_start date := date_trunc('month', current_date)::date;
  v_month_end date := (date_trunc('month', current_date) + interval '1 month - 1 day')::date;
  v_stats jsonb;
  v_category_distribution jsonb;
  v_pelagem_distribution jsonb;
  v_growth_data jsonb;
  v_age_distribution jsonb;
  v_upcoming_events jsonb;
  v_recent_activities jsonb;
begin
  if p_haras_id is null then
    raise exception 'p_haras_id is required';
  end if;

  select jsonb_build_object(
    'totalAnimals', coalesce((
      select count(*)
      from public.animals a
      where a.haras_id = p_haras_id
        and a.status = 'Ativo'
    ), 0),
    'totalMales', coalesce((
      select count(*)
      from public.animals a
      where a.haras_id = p_haras_id
        and a.status = 'Ativo'
        and a.sexo = 'Macho'
    ), 0),
    'totalFemales', coalesce((
      select count(*)
      from public.animals a
      where a.haras_id = p_haras_id
        and a.status = 'Ativo'
        and a.sexo = 'Fêmea'
    ), 0),
    'activeGestations', coalesce((
      select count(*)
      from public.gestations g
      where g.haras_id = p_haras_id
        and g.status = 'Em andamento'
    ), 0),
    'pendingServices', coalesce((
      select count(*)
      from public.service_orders so
      where so.haras_id = p_haras_id
        and so.status in ('pendente', 'em_andamento')
    ), 0),
    'scheduledEventsToday', coalesce((
      select count(*)
      from public.events e
      where e.haras_id = p_haras_id
        and e.data_inicio >= v_today::timestamp
        and e.data_inicio < (v_today + 1)::timestamp
        and coalesce(e.status, '') <> 'Cancelado'
    ), 0),
    'animalsNeedingCare', coalesce((
      select count(*)
      from public.health_records hr
      where hr.haras_id = p_haras_id
        and hr.proximadata >= v_today
        and hr.proximadata <= (v_today + 7)
    ), 0),
    'monthlyRevenue', coalesce((
      select sum(t.valor)
      from public.transactions t
      where t.haras_id = p_haras_id
        and t.data_transacao >= v_month_start
        and t.data_transacao <= v_month_end
        and t.tipo = 'Receita'
    ), 0),
    'monthlyExpenses', coalesce((
      select sum(t.valor)
      from public.transactions t
      where t.haras_id = p_haras_id
        and t.data_transacao >= v_month_start
        and t.data_transacao <= v_month_end
        and t.tipo <> 'Receita'
    ), 0),
    'unreadNotifications', case
      when v_current_user_id is null then 0
      else coalesce((
        select count(*)
        from public.notifications n
        where n.user_id = v_current_user_id
          and coalesce(n.lida, false) = false
      ), 0)
    end
  )
  into v_stats;

  with grouped as (
    select coalesce(a.categoria, 'Outros') as category_name, count(*) as total
    from public.animals a
    where a.haras_id = p_haras_id
      and a.status = 'Ativo'
    group by coalesce(a.categoria, 'Outros')
  )
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'name', case grouped.category_name
        when 'Potranca' then 'Potra'
        else grouped.category_name
      end,
      'value', grouped.total,
      'color', case grouped.category_name
        when 'Potro' then '#10b981'
        when 'Potranca' then '#f59e0b'
        when 'Potra' then '#f59e0b'
        when 'Garanhão' then '#3b82f6'
        when 'Égua' then '#8b5cf6'
        when 'Castrado' then '#6b7280'
        else '#4b5563'
      end
    )
    order by grouped.total desc, grouped.category_name
  ), '[]'::jsonb)
  into v_category_distribution
  from grouped;

  with grouped as (
    select coalesce(a.pelagem, 'Outros') as coat_color, count(*) as total
    from public.animals a
    where a.haras_id = p_haras_id
      and a.status = 'Ativo'
    group by coalesce(a.pelagem, 'Outros')
  )
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'name', grouped.coat_color,
      'value', grouped.total,
      'color', case grouped.coat_color
        when 'Castanha' then '#92400e'
        when 'Tordilha' then '#9ca3af'
        when 'Alazã' then '#dc2626'
        when 'Preta' then '#1f2937'
        when 'Pampa' then '#f97316'
        when 'Baio' then '#d97706'
        when 'Rosilha' then '#a78bfa'
        else '#4b5563'
      end
    )
    order by grouped.total desc, grouped.coat_color
  ), '[]'::jsonb)
  into v_pelagem_distribution
  from grouped;

  with months as (
    select generate_series(
      date_trunc('month', current_date)::date - ((v_months - 1) * interval '1 month'),
      date_trunc('month', current_date)::date,
      interval '1 month'
    )::date as month_start
  )
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'month_start', months.month_start,
      'total', coalesce(counts.total, 0),
      'machos', coalesce(counts.machos, 0),
      'femeas', coalesce(counts.femeas, 0)
    )
    order by months.month_start
  ), '[]'::jsonb)
  into v_growth_data
  from months
  left join lateral (
    select
      count(*) as total,
      count(*) filter (where a.sexo = 'Macho') as machos,
      count(*) filter (where a.sexo = 'Fêmea') as femeas
    from public.animals a
    where a.haras_id = p_haras_id
      and a.status = 'Ativo'
      and a.created_at < (months.month_start + interval '1 month')
  ) counts on true;

  with ages as (
    select floor(extract(epoch from age(current_date, a.data_nascimento)) / 31557600)::int as age_years
    from public.animals a
    where a.haras_id = p_haras_id
      and a.status = 'Ativo'
      and a.data_nascimento is not null
  )
  select jsonb_build_array(
    jsonb_build_object('age', '0-2 anos', 'count', coalesce((select count(*) from ages where age_years between 0 and 2), 0)),
    jsonb_build_object('age', '3-5 anos', 'count', coalesce((select count(*) from ages where age_years between 3 and 5), 0)),
    jsonb_build_object('age', '6-10 anos', 'count', coalesce((select count(*) from ages where age_years between 6 and 10), 0)),
    jsonb_build_object('age', '11-15 anos', 'count', coalesce((select count(*) from ages where age_years between 11 and 15), 0)),
    jsonb_build_object('age', '16+ anos', 'count', coalesce((select count(*) from ages where age_years >= 16), 0))
  )
  into v_age_distribution;

  with upcoming as (
    select
      e.id,
      e.titulo,
      e.data_inicio,
      e.tipo,
      e.status
    from public.events e
    where e.haras_id = p_haras_id
      and e.data_inicio >= now()
      and coalesce(e.status, '') <> 'Cancelado'
    order by e.data_inicio asc
    limit v_events_limit
  )
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', upcoming.id,
      'title', upcoming.titulo,
      'starts_at', upcoming.data_inicio,
      'type', coalesce(upcoming.tipo, 'servico'),
      'status', upcoming.status
    )
    order by upcoming.data_inicio asc
  ), '[]'::jsonb)
  into v_upcoming_events
  from upcoming;

  with animal_activities as (
    select
      a.id,
      'Animal cadastrado'::text as title,
      coalesce(a.nome, 'Sem nome')::text as description,
      a.created_at,
      'animal'::text as type
    from public.animals a
    where a.haras_id = p_haras_id
    order by a.created_at desc
    limit 3
  ),
  transaction_activities as (
    select
      t.id,
      case when t.tipo = 'Receita' then 'Receita registrada' else 'Despesa registrada' end::text as title,
      (
        coalesce(t.descricao, 'Sem descrição') ||
        ' - R$ ' ||
        to_char(coalesce(t.valor, 0), 'FM999G999G999G990D00')
      )::text as description,
      t.created_at,
      'receita'::text as type
    from public.transactions t
    where t.haras_id = p_haras_id
    order by t.created_at desc
    limit 3
  ),
  combined as (
    select * from animal_activities
    union all
    select * from transaction_activities
  ),
  limited as (
    select *
    from combined
    order by created_at desc
    limit v_activities_limit
  )
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', limited.id,
      'title', limited.title,
      'description', limited.description,
      'created_at', limited.created_at,
      'type', limited.type
    )
    order by limited.created_at desc
  ), '[]'::jsonb)
  into v_recent_activities
  from limited;

  return jsonb_build_object(
    'stats', coalesce(v_stats, '{}'::jsonb),
    'categoryDistribution', coalesce(v_category_distribution, '[]'::jsonb),
    'pelagemDistribution', coalesce(v_pelagem_distribution, '[]'::jsonb),
    'growthData', coalesce(v_growth_data, '[]'::jsonb),
    'ageDistribution', coalesce(v_age_distribution, '[]'::jsonb),
    'upcomingEvents', coalesce(v_upcoming_events, '[]'::jsonb),
    'recentActivities', coalesce(v_recent_activities, '[]'::jsonb)
  );
end;
$function$;

grant execute on function public.get_dashboard_snapshot(uuid, int, int, int) to authenticated;
