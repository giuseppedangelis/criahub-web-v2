create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  task_number bigserial not null,
  haras_id uuid not null references public.haras(id),
  title text not null,
  due_date date not null,
  status text not null default 'pendente' check (status in ('pendente','em_andamento','concluida')),
  priority text not null default 'media' check (priority in ('baixa','media','alta')),
  observations text null,
  animal_id uuid null references public.animals(id),
  responsible_id uuid null references public.profiles(id),
  documents jsonb null,
  photos jsonb null,
  created_by uuid null references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists tasks_task_number_idx on public.tasks (task_number);
create index if not exists tasks_haras_id_idx on public.tasks (haras_id);
create index if not exists tasks_haras_status_idx on public.tasks (haras_id, status);
create index if not exists tasks_haras_due_date_idx on public.tasks (haras_id, due_date);
