create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  haras_id uuid not null references public.haras(id),
  nome text not null,
  tipo text not null check (tipo in ('animal','plantel','financeiro','saude','premiacoes','reproducao')),
  formato text not null check (formato in ('pdf','excel','csv','docx','html')),
  status text not null default 'Gerado' check (status in ('Gerado','Agendado','Processando','Erro')),
  parametros jsonb null,
  arquivo_url text null,
  tamanho_bytes bigint null,
  agendado_para timestamptz null,
  criado_por uuid null references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists reports_haras_id_created_at_idx on public.reports (haras_id, created_at desc);
create index if not exists reports_haras_id_status_idx on public.reports (haras_id, status);
