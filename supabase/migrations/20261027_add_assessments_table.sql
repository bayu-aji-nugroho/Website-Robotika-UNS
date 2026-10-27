-- ==============================================================================
-- Migrasi: Tabel Assessment (Penilaian Kelulusan Calon Anggota)
-- Tanggal: 2026-10-27
-- Deskripsi:
-- Menambahkan tabel 'assessments' untuk mencatat status kelulusan calon anggota:
-- - 'pertimbangan' (default)
-- - 'diterima'
-- - 'ditolak'
-- Siap diekstensi di masa depan dengan kolom skor/nilai, catatan, dan evaluator.
-- ==============================================================================

-- 1. Buat Tabel public.assessments
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES public.applicants(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'pertimbangan' CHECK (status IN ('diterima', 'ditolak', 'pertimbangan')),
  notes TEXT,
  assessed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT uq_assessment_applicant UNIQUE (applicant_id)
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_assessments_applicant ON public.assessments(applicant_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.assessments(status);

-- 3. Row Level Security (RLS)
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Pendaftar hanya bisa membaca status miliknya sendiri
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assessments' AND policyname = 'assessments_user_read_own'
  ) THEN
    CREATE POLICY "assessments_user_read_own" ON public.assessments
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.applicants a
          WHERE a.id = assessments.applicant_id AND a.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Admin memiliki akses penuh (CRUD)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assessments' AND policyname = 'assessments_admin_full_access'
  ) THEN
    CREATE POLICY "assessments_admin_full_access" ON public.assessments
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_whitelist aw
          WHERE aw.email = (auth.jwt() ->> 'email') AND aw.is_active = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.admin_whitelist aw
          WHERE aw.email = (auth.jwt() ->> 'email') AND aw.is_active = true
        )
      );
  END IF;
END $$;

-- 4. Trigger auto updated_at
CREATE OR REPLACE FUNCTION public.handle_assessments_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_assessments_updated_at ON public.assessments;
CREATE TRIGGER tr_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_assessments_updated_at();

-- 5. Trigger otomatis membuat record assessment saat berkas pendaftar disubmit
CREATE OR REPLACE FUNCTION public.handle_applicant_auto_assessment()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'submitted' THEN
    INSERT INTO public.assessments (applicant_id, status)
    VALUES (NEW.id, 'pertimbangan')
    ON CONFLICT (applicant_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_applicant_auto_assessment ON public.applicants;
CREATE TRIGGER trg_applicant_auto_assessment
  AFTER INSERT OR UPDATE OF status ON public.applicants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_applicant_auto_assessment();

-- 6. Perbarui view_registrations agar menampilkan status assessment
CREATE OR REPLACE VIEW public.view_registrations WITH (security_invoker = true) AS
SELECT 
  a.id, a.user_id, a.user_email, a.registration_code, a.status, a.current_step,
  a.full_name, a.nim, a.fakultas, a.prodi, a.angkatan, a.whatsapp,
  p1.division_id AS primary_division_id, d1.name AS primary_division_name, d1.category AS primary_division_category, p1.reason AS primary_reason,
  p2.division_id AS secondary_division_id, d2.name AS secondary_division_name, d2.category AS secondary_division_category, p2.reason AS secondary_reason,
  a.cv_file_name, a.cv_file_size_bytes, a.cv_storage_path, a.cv_file_url,
  a.agreed_requirements, a.agreed_truth, a.submitted_at, a.created_at, a.updated_at,
  COALESCE(ass.status, 'pertimbangan') AS assessment_status,
  ass.notes AS assessment_notes
FROM public.applicants a
LEFT JOIN public.applicant_divisions p1 ON p1.applicant_id = a.id AND p1.priority = 1
LEFT JOIN public.divisions d1 ON d1.id = p1.division_id
LEFT JOIN public.applicant_divisions p2 ON p2.applicant_id = a.id AND p2.priority = 2
LEFT JOIN public.divisions d2 ON d2.id = p2.division_id
LEFT JOIN public.assessments ass ON ass.applicant_id = a.id;
