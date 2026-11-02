-- ==============================================================================
-- Migrasi: Hapus Persetujuan Syarat (agreed_requirements) dari Applicants & View
-- Tanggal: 2026-11-01
-- Deskripsi:
-- 1. Memperbarui view public.view_registrations agar tidak menyertakan kolom agreed_requirements.
-- 2. Menghapus kolom agreed_requirements dari tabel public.applicants.
-- ==============================================================================

-- 1. Perbarui view_registrations tanpa agreed_requirements
CREATE OR REPLACE VIEW public.view_registrations WITH (security_invoker = true) AS
SELECT 
  a.id, a.user_id, a.user_email, a.registration_code, a.status, a.current_step,
  a.full_name, a.nim, a.fakultas, a.prodi, a.angkatan, a.whatsapp,
  p1.division_id AS primary_division_id, d1.name AS primary_division_name, d1.category AS primary_division_category, p1.reason AS primary_reason,
  p2.division_id AS secondary_division_id, d2.name AS secondary_division_name, d2.category AS secondary_division_category, p2.reason AS secondary_reason,
  a.cv_file_name, a.cv_storage_path,
  a.agreed_truth, a.submitted_at, a.created_at, a.updated_at,
  COALESCE(ass.status, 'pertimbangan') AS assessment_status,
  ass.notes AS assessment_notes,
  ass.accepted_division_id,
  ad.name AS accepted_division_name,
  ad.category AS accepted_division_category
FROM public.applicants a
LEFT JOIN public.applicant_divisions p1 ON p1.applicant_id = a.id AND p1.priority = 1
LEFT JOIN public.divisions d1 ON d1.id = p1.division_id
LEFT JOIN public.applicant_divisions p2 ON p2.applicant_id = a.id AND p2.priority = 2
LEFT JOIN public.divisions d2 ON d2.id = p2.division_id
LEFT JOIN public.assessments ass ON ass.applicant_id = a.id
LEFT JOIN public.divisions ad ON ad.id = ass.accepted_division_id;

-- 2. Hapus kolom agreed_requirements dari tabel public.applicants
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'applicants' 
      AND column_name = 'agreed_requirements'
  ) THEN
    ALTER TABLE public.applicants DROP COLUMN agreed_requirements;
  END IF;
END $$;
