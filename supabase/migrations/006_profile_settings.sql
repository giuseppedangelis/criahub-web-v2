-- Create profile settings table for user-level preferences

create table if not exists public.profile_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  notification_settings jsonb not null default '{"documents": true, "tasks": true, "calendar": true, "team": true, "system": true}',
  privacy_settings jsonb not null default '{"showEmail": true, "showPhone": true}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$ begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'update_profile_settings_updated_at'
  ) then
    create trigger update_profile_settings_updated_at
      before update on public.profile_settings
      for each row execute function public.update_updated_at_column();
  end if;
end $$;
