alter table public.haras_settings
add column if not exists location_settings jsonb not null default '{
  "baias": ["Baia 01", "Baia 02", "Baia 03"],
  "pastos": ["Pasto Maternidade", "Pasto Norte", "Pasto Sul"],
  "servicos": ["Centro de Treinamento", "Hospedagem Externa"]
}'::jsonb;
