-- ==============================================================================
-- Migrasi: Efisiensi Kolom Dokumen CV pada Tabel applicants
-- Tanggal: 2026-10-27
-- Deskripsi:
-- 1. Menghapus kolom 'cv_file_url' karena URL privat (Signed URL) kedaluwarsa
--    setiap 20 menit dan otomatis di-generate on-the-fly oleh Edge Function.
-- 2. Menghapus kolom 'cv_file_size_bytes' karena batas ukuran <= 1 MB telah
--    divalidasi secara ketat oleh Edge Function & frontend (Zero Trust).
-- 3. Memperbarui view_registrations agar hanya menyertakan cv_file_name dan cv_storage_path.
-- ==============================================================================

-- 1. Hapus kolom cv_file_url dan cv_file_size_bytes
ALTER TABLE public.applicants DROP COLUMN IF EXISTS cv_file_url CASCADE;
ALTER TABLE public.applicants DROP COLUMN IF EXISTS cv_file_size_bytes CASCADE;

-- 2. Perbarui view_registrations
CREATE OR REPLACE VIEW public.view_registrations WITH (security_invoker = true) AS
SELECT 
  a.id, a.user_id, a.user_email, a.registration_code, a.status, a.current_step,
  a.full_name, a.nim, a.fakultas, a.prodi, a.angkatan, a.whatsapp,
  p1.division_id AS primary_division_id, d1.name AS primary_division_name, d1.category AS primary_division_category, p1.reason AS primary_reason,
  p2.division_id AS secondary_division_id, d2.name AS secondary_division_name, d2.category AS secondary_division_category, p2.reason AS secondary_reason,
  a.cv_file_name, a.cv_storage_path,
  a.agreed_requirements, a.agreed_truth, a.submitted_at, a.created_at, a.updated_at,
  COALESCE(ass.status, 'pertimbangan') AS assessment_status,
  ass.notes AS assessment_notes
FROM public.applicants a
LEFT JOIN public.applicant_divisions p1 ON p1.applicant_id = a.id AND p1.priority = 1
LEFT JOIN public.divisions d1 ON d1.id = p1.division_id
LEFT JOIN public.applicant_divisions p2 ON p2.applicant_id = a.id AND p2.priority = 2
LEFT JOIN public.divisions d2 ON d2.id = p2.division_id
LEFT JOIN public.assessments ass ON ass.applicant_id = a.id;
