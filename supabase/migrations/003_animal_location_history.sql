-- ================================================
-- CRIAHUB - HISTORICO DE LOCALIZACAO DO ANIMAL
-- ================================================

CREATE TABLE IF NOT EXISTS animal_location_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  haras_id UUID REFERENCES haras(id) ON DELETE CASCADE NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN ('Baia', 'Pasto', 'Serviço')),
  location_name TEXT NOT NULL,
  service_type TEXT CHECK (service_type IN ('Reprodução', 'Trabalho', 'Repouso', 'Outro') OR service_type IS NULL),
  previous_location TEXT,
  new_location TEXT NOT NULL,
  reason TEXT,
  notes TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_animal_location_history_animal_id ON animal_location_history(animal_id);
CREATE INDEX IF NOT EXISTS idx_animal_location_history_haras_id ON animal_location_history(haras_id);
CREATE INDEX IF NOT EXISTS idx_animal_location_history_changed_at ON animal_location_history(changed_at);
