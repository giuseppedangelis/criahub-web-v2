create table if not exists public.animal_ownership_shares (
  id uuid primary key default gen_random_uuid(),
  haras_id uuid not null references public.haras(id) on delete cascade,
  animal_id uuid not null references public.animals(id) on delete cascade,
  owner_name text not null,
  owner_profile_id uuid null references public.profiles(id) on delete set null,
  percentage numeric(5,2) not null check (percentage > 0 and percentage <= 100),
  is_primary boolean not null default false,
  start_date date null,
  end_date date null,
  notes text null,
  source text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists animal_ownership_shares_haras_idx
  on public.animal_ownership_shares (haras_id);

create index if not exists animal_ownership_shares_animal_idx
  on public.animal_ownership_shares (animal_id);

create index if not exists animal_ownership_shares_active_idx
  on public.animal_ownership_shares (animal_id, end_date);

create table if not exists public.animal_link_queue (
  id uuid primary key default gen_random_uuid(),
  haras_id uuid not null references public.haras(id) on delete cascade,
  provisional_animal_id uuid not null references public.animals(id) on delete cascade,
  official_animal_id uuid null references public.animals(id) on delete set null,
  official_abccmm_rowid text null,
  official_registry text null,
  match_type text not null default 'manual' check (match_type in ('manual','name_birth_sex','registro','chip','mixed')),
  confidence numeric(5,2) null,
  status text not null default 'pending' check (status in ('pending','linked','dismissed')),
  payload jsonb not null default '{}'::jsonb,
  created_by uuid null references public.profiles(id) on delete set null,
  resolved_by uuid null references public.profiles(id) on delete set null,
  resolved_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (haras_id, provisional_animal_id, official_abccmm_rowid, status)
);

create index if not exists animal_link_queue_haras_status_idx
  on public.animal_link_queue (haras_id, status, created_at desc);

create index if not exists animal_link_queue_provisional_idx
  on public.animal_link_queue (provisional_animal_id);

create index if not exists animal_link_queue_official_idx
  on public.animal_link_queue (official_animal_id);
