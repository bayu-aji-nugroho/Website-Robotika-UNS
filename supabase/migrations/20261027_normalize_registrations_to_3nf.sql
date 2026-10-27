-- ==============================================================================
-- Migrasi: Normalisasi Basis Data Pendaftaran (3NF / Relational Database)
-- UKM Robotika Universitas Sebelas Maret (UNS)
--
-- Memecah tabel flat registrations menjadi 3 tabel terpisah yang saling berelasi:
-- 1. public.divisions (Master Divisi)
-- 2. public.applicants (Biodata Pendaftar & Berkas)
-- 3. public.applicant_divisions (Tabel Pivot / Relasi Many-to-Many Pilihan Divisi)
-- + public.view_registrations (View Kompatibilitas & Reporting)
-- ==============================================================================

-- 1. MASTER DIVISI
CREATE TABLE IF NOT EXISTS public.divisions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed daftar divisi resmi UKM Robotika UNS
INSERT INTO public.divisions (id, name, category, is_active) VALUES
  ('werkudara-pemrograman', 'Werkudara - Pemrograman', 'teknis', true),
  ('werkudara-elektronika', 'Werkudara - Elektronika', 'teknis', true),
  ('werkudara-mekanika', 'Werkudara - Mekanika', 'teknis', true),
  ('cakrawala-pemrograman', 'Cakrawala - Pemrograman', 'teknis', true),
  ('cakrawala-elektronika', 'Cakrawala - Elektronika', 'teknis', true),
  ('cakrawala-mekanika', 'Cakrawala - Mekanika', 'teknis', true),
  ('administrasi', 'Administrasi', 'non-teknis', true),
  ('bendahara', 'Bendahara', 'non-teknis', true),
  ('pengembangan-organisasi', 'Pengembangan Organisasi', 'non-teknis', true),
  ('media-branding', 'Media Branding', 'non-teknis', true),
  ('humas', 'Humas (Hubungan Masyarakat)', 'non-teknis', true)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name,
    category = EXCLUDED.category,
    is_active = EXCLUDED.is_active;

-- 2. BIODATA PENDAFTAR (APPLICANTS)
CREATE TABLE IF NOT EXISTS public.applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  registration_code VARCHAR(32) UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  current_step INT NOT NULL DEFAULT 3 CHECK (current_step BETWEEN 1 AND 6),
  
  -- Identitas Pribadi
  full_name VARCHAR(255) CHECK (full_name IS NULL OR full_name !~ '[0-9]'),
  nim VARCHAR(30),
  fakultas VARCHAR(100),
  prodi VARCHAR(150),
  angkatan VARCHAR(10) CHECK (angkatan IS NULL OR angkatan IN ('2025', '2026')),
  whatsapp VARCHAR(30) CHECK (whatsapp IS NULL OR whatsapp ~ '^08[0-9]{8,13}$'),
  
  -- Berkas CV & Persetujuan
  cv_file_name VARCHAR(255),
  cv_file_size_bytes BIGINT,
  cv_storage_path TEXT,
  cv_file_url TEXT,
  agreed_requirements BOOLEAN DEFAULT FALSE,
  agreed_truth BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_applicants_user_id ON public.applicants(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_applicants_nim ON public.applicants(UPPER(nim)) WHERE nim IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_applicants_status ON public.applicants(status);

-- 3. PIVOT PILIHAN DIVISI (APPLICANT_DIVISIONS)
CREATE TABLE IF NOT EXISTS public.applicant_divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES public.applicants(id) ON DELETE CASCADE,
  division_id VARCHAR(50) NOT NULL REFERENCES public.divisions(id) ON DELETE RESTRICT,
  priority INT NOT NULL CHECK (priority >= 1),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT uq_applicant_priority UNIQUE (applicant_id, priority),
  CONSTRAINT uq_applicant_division UNIQUE (applicant_id, division_id)
);

CREATE INDEX IF NOT EXISTS idx_applicant_divisions_lookup ON public.applicant_divisions(division_id, priority);
CREATE INDEX IF NOT EXISTS idx_applicant_divisions_applicant ON public.applicant_divisions(applicant_id);

-- 4. MIGRASI DATA DARI REGISTRATIONS EXISTING
INSERT INTO public.applicants (
  id, user_id, user_email, registration_code, status, current_step,
  full_name, nim, fakultas, prodi, angkatan, whatsapp,
  cv_file_name, cv_file_size_bytes, cv_storage_path, cv_file_url,
  agreed_requirements, agreed_truth, submitted_at, created_at, updated_at
)
SELECT 
  id, user_id, user_email, registration_code, status, current_step,
  full_name, nim, fakultas, prodi, angkatan, whatsapp,
  cv_file_name, cv_file_size_bytes, cv_storage_path, cv_file_url,
  agreed_requirements, agreed_truth, submitted_at, created_at, updated_at
FROM public.registrations
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applicant_divisions (applicant_id, division_id, priority, reason, created_at)
SELECT 
  r.id,
  r.primary_division_id,
  1,
  COALESCE(r.primary_reason, 'Pilihan Divisi Utama'),
  r.created_at
FROM public.registrations r
WHERE r.primary_division_id IS NOT NULL 
  AND r.primary_division_id IN (SELECT id FROM public.divisions)
ON CONFLICT (applicant_id, priority) DO NOTHING;

INSERT INTO public.applicant_divisions (applicant_id, division_id, priority, reason, created_at)
SELECT 
  r.id,
  r.secondary_division_id,
  2,
  COALESCE(r.secondary_reason, 'Pilihan Divisi Kedua'),
  r.created_at
FROM public.registrations r
WHERE r.secondary_division_id IS NOT NULL 
  AND r.secondary_division_id IN (SELECT id FROM public.divisions)
ON CONFLICT (applicant_id, priority) DO NOTHING;

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'divisions' AND policyname = 'divisions_select_public') THEN
    CREATE POLICY "divisions_select_public" ON public.divisions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'divisions' AND policyname = 'divisions_mutation_service_only') THEN
    CREATE POLICY "divisions_mutation_service_only" ON public.divisions FOR ALL USING (false);
  END IF;
END $$;

ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applicants' AND policyname = 'applicants_user_select') THEN
    CREATE POLICY "applicants_user_select" ON public.applicants FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applicants' AND policyname = 'applicants_user_insert') THEN
    CREATE POLICY "applicants_user_insert" ON public.applicants FOR INSERT WITH CHECK (false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applicants' AND policyname = 'applicants_user_update') THEN
    CREATE POLICY "applicants_user_update" ON public.applicants FOR UPDATE USING (false) WITH CHECK (false);
  END IF;
END $$;

ALTER TABLE public.applicant_divisions ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applicant_divisions' AND policyname = 'applicant_divisions_user_select') THEN
    CREATE POLICY "applicant_divisions_user_select" ON public.applicant_divisions FOR SELECT TO authenticated 
      USING (EXISTS (SELECT 1 FROM public.applicants a WHERE a.id = applicant_id AND a.user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applicant_divisions' AND policyname = 'applicant_divisions_user_insert') THEN
    CREATE POLICY "applicant_divisions_user_insert" ON public.applicant_divisions FOR INSERT WITH CHECK (false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applicant_divisions' AND policyname = 'applicant_divisions_user_update') THEN
    CREATE POLICY "applicant_divisions_user_update" ON public.applicant_divisions FOR UPDATE USING (false) WITH CHECK (false);
  END IF;
END $$;

-- 6. TRIGGERS: OPREC GUARD & IMMUTABILITY
CREATE OR REPLACE FUNCTION public.enforce_applicants_immutability()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'submitted' THEN
    RAISE EXCEPTION 'Data pendaftaran yang sudah dikirim bersifat permanen dan tidak dapat diubah lagi.';
  END IF;

  IF OLD.nim IS NOT NULL AND NEW.nim IS DISTINCT FROM OLD.nim THEN
    RAISE EXCEPTION 'NIM yang telah disimpan bersifat permanen dan tidak dapat diubah.';
  END IF;

  IF OLD.full_name IS NOT NULL AND NEW.full_name IS DISTINCT FROM OLD.full_name THEN
    RAISE EXCEPTION 'Nama lengkap yang telah disimpan bersifat permanen dan tidak dapat diubah.';
  END IF;

  IF OLD.angkatan IS NOT NULL AND NEW.angkatan IS DISTINCT FROM OLD.angkatan THEN
    RAISE EXCEPTION 'Tahun angkatan yang telah disimpan bersifat permanen dan tidak dapat diubah.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.enforce_applicants_immutability() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_applicants_immutability() TO postgres, service_role;

CREATE OR REPLACE FUNCTION public.enforce_applicant_divisions_immutability()
RETURNS TRIGGER AS $$
DECLARE
  v_status VARCHAR(20);
BEGIN
  SELECT status INTO v_status FROM public.applicants WHERE id = COALESCE(NEW.applicant_id, OLD.applicant_id);
  IF v_status = 'submitted' THEN
    RAISE EXCEPTION 'Pilihan divisi tidak dapat diubah atau dihapus karena berkas pendaftaran telah dikirim.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.enforce_applicant_divisions_immutability() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_applicant_divisions_immutability() TO postgres, service_role;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_enforce_oprec_applicants') THEN
    CREATE TRIGGER trg_enforce_oprec_applicants
    BEFORE INSERT OR UPDATE ON public.applicants
    FOR EACH ROW
    EXECUTE FUNCTION public.check_registration_oprec_open();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_enforce_oprec_applicant_divisions') THEN
    CREATE TRIGGER trg_enforce_oprec_applicant_divisions
    BEFORE INSERT OR UPDATE OR DELETE ON public.applicant_divisions
    FOR EACH ROW
    EXECUTE FUNCTION public.check_registration_oprec_open();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_applicants_immutability') THEN
    CREATE TRIGGER trg_applicants_immutability
    BEFORE UPDATE ON public.applicants
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_applicants_immutability();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_applicant_divisions_immutability') THEN
    CREATE TRIGGER trg_applicant_divisions_immutability
    BEFORE INSERT OR UPDATE OR DELETE ON public.applicant_divisions
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_applicant_divisions_immutability();
  END IF;
END $$;

-- 7. VIEW KOMPATIBILITAS RELASIONAL
CREATE OR REPLACE VIEW public.view_registrations AS
SELECT 
  a.id,
  a.user_id,
  a.user_email,
  a.registration_code,
  a.status,
  a.current_step,
  a.full_name,
  a.nim,
  a.fakultas,
  a.prodi,
  a.angkatan,
  a.whatsapp,
  p1.division_id AS primary_division_id,
  d1.name AS primary_division_name,
  d1.category AS primary_division_category,
  p1.reason AS primary_reason,
  p2.division_id AS secondary_division_id,
  d2.name AS secondary_division_name,
  d2.category AS secondary_division_category,
  p2.reason AS secondary_reason,
  a.cv_file_name,
  a.cv_file_size_bytes,
  a.cv_storage_path,
  a.cv_file_url,
  a.agreed_requirements,
  a.agreed_truth,
  a.submitted_at,
  a.created_at,
  a.updated_at
FROM public.applicants a
LEFT JOIN public.applicant_divisions p1 ON p1.applicant_id = a.id AND p1.priority = 1
LEFT JOIN public.divisions d1 ON d1.id = p1.division_id
LEFT JOIN public.applicant_divisions p2 ON p2.applicant_id = a.id AND p2.priority = 2
LEFT JOIN public.divisions d2 ON d2.id = p2.division_id;
