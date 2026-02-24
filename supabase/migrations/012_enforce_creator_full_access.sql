-- Garante que apenas o criador (owner_id) tenha acesso total

update public.haras_members m
set permissions = jsonb_set(coalesce(m.permissions, '{}'::jsonb), '{fullAdministrative}', 'false'::jsonb, true)
from public.haras h
where m.haras_id = h.id
  and m.user_id <> h.owner_id
  and coalesce((m.permissions->>'fullAdministrative')::boolean, false) = true;

-- Remove acesso total de funções que não são "Administrador"
update public.haras_roles
set permissions = jsonb_set(coalesce(permissions, '{}'::jsonb), '{fullAdministrative}', 'false'::jsonb, true)
where coalesce((permissions->>'fullAdministrative')::boolean, false) = true
  and lower(name) <> 'administrador';
