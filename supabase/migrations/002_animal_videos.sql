-- ================================================
-- CRIAHUB - ANIMAL VIDEOS
-- Tabela de vídeos por animal (sem RLS)
-- ================================================

CREATE TABLE IF NOT EXISTS animal_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  haras_id UUID REFERENCES haras(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT DEFAULT 'link',
  type TEXT,
  visibility TEXT DEFAULT 'publico',
  caption TEXT,
  duration TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_animal_videos_updated_at ON animal_videos;
CREATE TRIGGER update_animal_videos_updated_at
  BEFORE UPDATE ON animal_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_animal_videos_animal_id ON animal_videos(animal_id);
CREATE INDEX IF NOT EXISTS idx_animal_videos_haras_id ON animal_videos(haras_id);
CREATE INDEX IF NOT EXISTS idx_animal_videos_created_at ON animal_videos(created_at);
