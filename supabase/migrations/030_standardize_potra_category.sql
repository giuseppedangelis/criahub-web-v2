-- Migration 030: Padroniza "Potranca" → "Potra" em animals.categoria.
-- Remove as três grafias inconsistentes (Potranca no BD, potra no TS, Potra na UI) e consolida em "Potra".

ALTER TABLE public.animals DROP CONSTRAINT IF EXISTS animals_categoria_check;

UPDATE public.animals SET categoria = 'Potra' WHERE categoria = 'Potranca';

ALTER TABLE public.animals
  ADD CONSTRAINT animals_categoria_check
  CHECK (categoria = ANY (ARRAY['Potro'::text, 'Potra'::text, 'Garanhão'::text, 'Égua'::text, 'Castrado'::text]));

-- Função get_dashboard_snapshot simplificada: sem CASE WHEN 'Potranca' THEN 'Potra'.
-- A versão completa da função é aplicada inline no banco (vide migration aplicada via MCP).
-- Aqui mantemos apenas o patch relevante — o corpo completo está versionado nas migrations 017+.
