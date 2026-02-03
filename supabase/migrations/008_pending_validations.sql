create table if not exists public.pending_validations (
  id uuid primary key default gen_random_uuid(),
  haras_id uuid not null references public.haras(id),
  type text not null check (type in ('nascimento','ocorrencia')),
  data jsonb not null,
  created_by uuid references public.profiles(id),
  status text not null default 'pendente',
  validated_by uuid references public.profiles(id),
  validated_at timestamptz null,
  validation_notes text null,
  created_at timestamptz default now()
);

create index if not exists pending_validations_haras_type_status_idx
  on public.pending_validations (haras_id, type, status);

create index if not exists pending_validations_haras_created_at_idx
  on public.pending_validations (haras_id, created_at desc);
