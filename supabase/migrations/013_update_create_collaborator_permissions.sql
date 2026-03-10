-- Update create_collaborator to allow Assessor to create Peão/Veterinário
-- and prevent creation of Administrador/Criador.

create or replace function public.create_collaborator(
  p_email text,
  p_password text,
  p_full_name text,
  p_role text,
  p_haras_id uuid
)
returns json
language plpgsql
security definer
set search_path to 'public', 'extensions'
as $function$
declare
  v_user_id uuid;
  v_caller_role text;
  v_caller_haras_id uuid;
  v_normalized_role text;
begin
  if auth.uid() is null then
    return json_build_object('error', 'Usuário não autenticado.');
  end if;

  select role, haras_id
    into v_caller_role, v_caller_haras_id
    from public.profiles
   where id = auth.uid();

  if v_caller_role is null then
    return json_build_object('error', 'Perfil do usuário não encontrado.');
  end if;

  if v_caller_haras_id is null then
    return json_build_object('error', 'Haras do usuário não identificado.');
  end if;

  if p_haras_id is null then
    return json_build_object('error', 'Haras não identificado.');
  end if;

  if v_caller_haras_id <> p_haras_id then
    return json_build_object('error', 'Você não pode cadastrar usuários em outro haras.');
  end if;

  v_normalized_role := lower(trim(p_role));
  if v_normalized_role in ('assessor', 'advisor') then
    v_normalized_role := 'assessor';
  end if;

  if v_normalized_role in ('admin', 'criador', 'breeder') then
    return json_build_object('error', 'Não é permitido criar administrador ou criador.');
  end if;

  if lower(v_caller_role) in ('criador', 'breeder', 'admin') then
    if v_normalized_role not in ('assessor', 'veterinario', 'peao', 'funcionario') then
      return json_build_object('error', 'Perfil de acesso inválido para criação.');
    end if;
  elsif lower(v_caller_role) in ('assessor', 'advisor') then
    if v_normalized_role not in ('veterinario', 'peao') then
      return json_build_object('error', 'Assessor só pode cadastrar Peão ou Veterinário.');
    end if;
  else
    return json_build_object('error', 'Apenas criadores ou assessores podem adicionar colaboradores.');
  end if;

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(),
    json_build_object('full_name', p_full_name, 'role', v_normalized_role),
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  returning id into v_user_id;

  insert into public.profiles (id, email, full_name, role, haras_id)
  values (v_user_id, p_email, p_full_name, v_normalized_role, p_haras_id)
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        role = excluded.role,
        haras_id = excluded.haras_id;

  return json_build_object('user_id', v_user_id, 'success', true);
exception
  when unique_violation then
    return json_build_object('error', 'Email já cadastrado');
  when others then
    return json_build_object('error', sqlerrm);
end;
$function$;
