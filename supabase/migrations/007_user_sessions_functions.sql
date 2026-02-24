-- Functions to expose current user sessions safely

create or replace function public.get_current_user_sessions()
returns table (
  id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  ip inet,
  user_agent text,
  refreshed_at timestamp,
  not_after timestamptz
)
language sql
security definer
set search_path = auth, public
as $$
  select
    s.id,
    s.created_at,
    s.updated_at,
    s.ip,
    s.user_agent,
    s.refreshed_at,
    s.not_after
  from auth.sessions s
  where s.user_id = auth.uid()
  order by s.updated_at desc;
$$;

create or replace function public.revoke_current_user_session(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = auth, public
as $$
begin
  delete from auth.sessions
  where id = p_session_id
    and user_id = auth.uid();
end;
$$;

grant execute on function public.get_current_user_sessions() to authenticated;
grant execute on function public.revoke_current_user_session(uuid) to authenticated;
