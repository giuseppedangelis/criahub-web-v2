-- Migration 029: Presença no haras + extensões de condomínio + notificações de prazo.

-- 1. Colunas de presença no haras
ALTER TABLE public.animals
  ADD COLUMN IF NOT EXISTS is_at_haras boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS presence_manual_override boolean NOT NULL DEFAULT false;

-- 2. Extensões para gestão de condomínio
ALTER TABLE public.animal_ownership_shares
  ADD COLUMN IF NOT EXISTS termination_type text,
  ADD COLUMN IF NOT EXISTS termination_date date,
  ADD COLUMN IF NOT EXISTS termination_age_years integer,
  ADD COLUMN IF NOT EXISTS physical_location text,
  ADD COLUMN IF NOT EXISTS is_external boolean NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid='public.animal_ownership_shares'::regclass
      AND conname='animal_ownership_shares_termination_type_check'
  ) THEN
    ALTER TABLE public.animal_ownership_shares
      ADD CONSTRAINT animal_ownership_shares_termination_type_check
      CHECK (termination_type IS NULL OR termination_type IN ('date','age'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid='public.animal_ownership_shares'::regclass
      AND conname='animal_ownership_shares_termination_age_check'
  ) THEN
    ALTER TABLE public.animal_ownership_shares
      ADD CONSTRAINT animal_ownership_shares_termination_age_check
      CHECK (termination_age_years IS NULL OR (termination_age_years > 0 AND termination_age_years <= 40));
  END IF;
END $$;

-- 3. Relaxar RLS para permitir gestão manual (além de ABCCMM)
DROP POLICY IF EXISTS animal_ownership_shares_insert_policy ON public.animal_ownership_shares;
DROP POLICY IF EXISTS animal_ownership_shares_update_policy ON public.animal_ownership_shares;

CREATE POLICY animal_ownership_shares_insert_policy
  ON public.animal_ownership_shares
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.user_can_manage_haras_team(haras_id)
    AND COALESCE(source, 'manual') IN ('manual','abccmm_condominio')
  );

CREATE POLICY animal_ownership_shares_update_policy
  ON public.animal_ownership_shares
  FOR UPDATE
  TO authenticated
  USING (public.user_can_manage_haras_team(haras_id))
  WITH CHECK (
    public.user_can_manage_haras_team(haras_id)
    AND COALESCE(source, 'manual') IN ('manual','abccmm_condominio')
  );

-- 4. RPC para gerar notificações de prazo de condomínio (idempotente por dia).
CREATE OR REPLACE FUNCTION public.generate_condominio_notifications(p_haras_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
DECLARE
  v_today date := current_date;
  v_inserted integer := 0;
  r_share record;
  v_due_date date;
  v_days_until integer;
  v_milestone text;
  v_title text;
  v_message text;
  v_priority text;
  v_link text;
  r_user record;
BEGIN
  IF NOT public.user_can_manage_haras_team(p_haras_id) THEN
    RETURN 0;
  END IF;

  FOR r_share IN
    SELECT
      s.animal_id,
      s.termination_type,
      s.termination_date,
      s.termination_age_years,
      a.nome AS animal_name,
      a.data_nascimento
    FROM public.animal_ownership_shares s
    JOIN public.animals a ON a.id = s.animal_id
    WHERE s.haras_id = p_haras_id
      AND (s.end_date IS NULL OR s.end_date > v_today)
      AND s.termination_type IS NOT NULL
      AND s.is_primary = true
  LOOP
    IF r_share.termination_type = 'date' THEN
      v_due_date := r_share.termination_date;
    ELSIF r_share.termination_type = 'age'
          AND r_share.data_nascimento IS NOT NULL
          AND r_share.termination_age_years IS NOT NULL THEN
      v_due_date := (r_share.data_nascimento + (r_share.termination_age_years || ' years')::interval)::date;
    ELSE
      v_due_date := NULL;
    END IF;

    IF v_due_date IS NULL THEN CONTINUE; END IF;

    v_days_until := v_due_date - v_today;

    IF v_days_until = 30 THEN
      v_milestone := '30d-antes';
      v_title := 'Condomínio vence em 30 dias';
      v_message := 'O condomínio de ' || r_share.animal_name || ' vence em ' || to_char(v_due_date, 'DD/MM/YYYY') || '.';
      v_priority := 'normal';
    ELSIF v_days_until BETWEEN 1 AND 29 AND (v_days_until % 7 = 0) THEN
      v_milestone := 'sem-' || v_days_until;
      v_title := 'Condomínio vence em ' || v_days_until || ' dias';
      v_message := 'O condomínio de ' || r_share.animal_name || ' vence em ' || to_char(v_due_date, 'DD/MM/YYYY') || '.';
      v_priority := 'normal';
    ELSIF v_days_until = 0 THEN
      v_milestone := 'hoje';
      v_title := 'Condomínio vence hoje';
      v_message := 'O condomínio de ' || r_share.animal_name || ' vence hoje.';
      v_priority := 'alta';
    ELSIF v_days_until < 0 AND (abs(v_days_until) % 15 = 0) THEN
      v_milestone := 'atraso-' || abs(v_days_until);
      v_title := 'Condomínio vencido há ' || abs(v_days_until) || ' dias';
      v_message := 'O condomínio de ' || r_share.animal_name || ' está vencido há ' || abs(v_days_until) || ' dias — animal ainda não retornou.';
      v_priority := 'alta';
    ELSE
      CONTINUE;
    END IF;

    v_link := '/plantel/' || r_share.animal_id || '?alert=condominio-' || v_milestone;

    FOR r_user IN
      SELECT p.id AS user_id
      FROM public.profiles p
      WHERE p.haras_id = p_haras_id
        AND p.role = ANY (ARRAY['admin','criador','assessor'])
    LOOP
      IF NOT EXISTS (
        SELECT 1 FROM public.notifications n
        WHERE n.user_id = r_user.user_id
          AND n.haras_id = p_haras_id
          AND n.link = v_link
          AND n.created_at::date = v_today
      ) THEN
        INSERT INTO public.notifications
          (user_id, haras_id, titulo, mensagem, tipo, categoria, prioridade, link)
        VALUES
          (r_user.user_id, p_haras_id, v_title, v_message, 'warning', 'Geral', v_priority, v_link);
        v_inserted := v_inserted + 1;
      END IF;
    END LOOP;
  END LOOP;

  RETURN v_inserted;
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.generate_condominio_notifications(uuid) TO authenticated;

CREATE INDEX IF NOT EXISTS idx_notifications_user_link_date
  ON public.notifications (user_id, link, created_at);
