-- ================================================
-- CRIAHUB - MIGRATIONS SQL
-- Execute estas queries no Supabase SQL Editor
-- ================================================

-- 1. Create enum for user roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'breeder', 'advisor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'breeder',
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  cpf_cnpj TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create haras table
CREATE TABLE IF NOT EXISTS haras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  address JSONB,
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  description TEXT,
  subscription_plan TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create haras_members table (for advisors linked to haras)
CREATE TABLE IF NOT EXISTS haras_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  haras_id UUID REFERENCES haras(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'advisor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(haras_id, user_id)
);

-- 5. Create animals table
CREATE TABLE IF NOT EXISTS animals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  haras_id UUID REFERENCES haras(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  registry_abccmm TEXT,
  chip_rfid TEXT,
  marca TEXT,
  sex TEXT NOT NULL CHECK (sex IN ('Macho', 'Fêmea')),
  birth_date DATE,
  haras_origem TEXT,
  category TEXT,
  pelagem TEXT,
  altura DECIMAL(5,2),
  peso DECIMAL(6,2),
  status_atividade TEXT DEFAULT 'Ativo' CHECK (status_atividade IN ('Ativo', 'Vendido', 'Falecido', 'Transferido')),
  status_atual TEXT,
  localizacao TEXT,
  tipo_reprodutivo TEXT,
  ativo_reproducao BOOLEAN DEFAULT true,
  father_id UUID REFERENCES animals(id),
  mother_id UUID REFERENCES animals(id),
  images JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create reproductive_events table
CREATE TABLE IF NOT EXISTS reproductive_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cobertura', 'ia', 'ovulacao')),
  date DATE NOT NULL,
  partner_id UUID REFERENCES animals(id),
  veterinarian TEXT,
  semen_type TEXT CHECK (semen_type IN ('fresco', 'refrigerado', 'congelado')),
  details JSONB DEFAULT '{}',
  status TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create pregnancies table
CREATE TABLE IF NOT EXISTS pregnancies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mare_id UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  stallion_id UUID REFERENCES animals(id),
  reproductive_event_id UUID REFERENCES reproductive_events(id),
  coverage_date DATE,
  confirmation_date DATE,
  estimated_birth_date DATE,
  confirmed BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa', 'finalizada', 'abortada')),
  birth_id UUID REFERENCES animals(id),
  veterinarian TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create transactions table (financial)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  haras_id UUID REFERENCES haras(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  category TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'recebido', 'agendado')),
  animal_id UUID REFERENCES animals(id),
  supplier TEXT,
  attachments JSONB DEFAULT '[]',
  observations TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create service_orders table
CREATE TABLE IF NOT EXISTS service_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  haras_id UUID REFERENCES haras(id) ON DELETE CASCADE NOT NULL,
  number TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  estimated_value DECIMAL(12,2),
  final_value DECIMAL(12,2),
  supplier JSONB,
  status TEXT DEFAULT 'aberta' CHECK (status IN ('aberta', 'em_andamento', 'concluida', 'cancelada')),
  scheduled_date DATE,
  completion_date DATE,
  animals JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create pending_validations table
CREATE TABLE IF NOT EXISTS pending_validations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  haras_id UUID REFERENCES haras(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('nascimento', 'ocorrencia')),
  data JSONB NOT NULL,
  photos JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'validado', 'rejeitado', 'correcao_solicitada')),
  created_by UUID REFERENCES profiles(id),
  validated_by UUID REFERENCES profiles(id),
  validated_at TIMESTAMPTZ,
  validation_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baixa')),
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Create veterinary_procedures table
CREATE TABLE IF NOT EXISTS veterinary_procedures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  veterinarian TEXT,
  cost DECIMAL(12,2),
  next_date DATE,
  attachments JSONB DEFAULT '[]',
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DO $$
DECLARE
    tables TEXT[] := ARRAY['profiles', 'haras', 'animals', 'pregnancies', 'service_orders'];
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', tbl, tbl);
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', tbl, tbl);
    END LOOP;
END $$;

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'breeder'),
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Generate service order number
CREATE OR REPLACE FUNCTION generate_service_order_number()
RETURNS TRIGGER AS $$
DECLARE
  year_count INT;
  new_number TEXT;
BEGIN
  SELECT COUNT(*) + 1 INTO year_count
  FROM service_orders
  WHERE haras_id = NEW.haras_id
  AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  new_number := 'OS-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(year_count::TEXT, 4, '0');
  NEW.number := new_number;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS generate_os_number ON service_orders;
CREATE TRIGGER generate_os_number
  BEFORE INSERT ON service_orders
  FOR EACH ROW
  WHEN (NEW.number IS NULL OR NEW.number = '')
  EXECUTE FUNCTION generate_service_order_number();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_animals_haras_id ON animals(haras_id);
CREATE INDEX IF NOT EXISTS idx_animals_status ON animals(status_atividade);
CREATE INDEX IF NOT EXISTS idx_transactions_haras_id ON transactions(haras_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_pending_validations_status ON pending_validations(status);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_pregnancies_status ON pregnancies(status);
