alter table public.awards
  add column if not exists source text null,
  add column if not exists source_rowid text null,
  add column if not exists source_event_code text null,
  add column if not exists source_hash text null;

create index if not exists awards_haras_animal_source_idx
  on public.awards (haras_id, animal_id, source);

create unique index if not exists awards_source_hash_unique_idx
  on public.awards (haras_id, source_hash)
  where source_hash is not null;
