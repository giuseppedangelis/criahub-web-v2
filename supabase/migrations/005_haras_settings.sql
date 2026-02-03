-- Add haras settings table and profile status for team management

create table if not exists public.haras_settings (
  haras_id uuid primary key references public.haras(id) on delete cascade,
  notification_settings jsonb not null default '{"agenda": true, "reproduction": true, "system": true}',
  privacy_settings jsonb not null default '{"publicPlantel": true, "shareAnalytics": true, "allowSearch": true}',
  backup_settings jsonb not null default '{"autoBackup": true, "frequency": "daily"}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'status'
  ) then
    alter table public.profiles
      add column status text not null default 'Ativo';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_status_check'
  ) then
    alter table public.profiles
      add constraint profiles_status_check
      check (status in ('Ativo', 'Inativo'));
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'update_haras_settings_updated_at'
  ) then
    create trigger update_haras_settings_updated_at
      before update on public.haras_settings
      for each row execute function public.update_updated_at_column();
  end if;
end $$;
