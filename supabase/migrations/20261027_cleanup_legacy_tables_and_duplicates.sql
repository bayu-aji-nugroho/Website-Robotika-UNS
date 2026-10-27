-- ==============================================================================
-- Migrasi: Pembersihan Tabel Legacy dan Data Uji Coba Duplikat
-- Tanggal: 2026-10-27
-- Deskripsi:
-- 1. Menghapus tabel uji coba 'test_tab' yang sudah tidak digunakan.
-- 2. Menghapus tabel flat 'registrations' (legacy) dan trigger sinkronisasinya
--    karena sistem telah bermigrasi 100% ke Third Normal Form (3NF):
--    - public.divisions
--    - public.applicants
--    - public.applicant_divisions
--    - public.view_registrations
-- 3. Menghapus baris data uji coba yang berduplikasi dan draf tidak tuntas.
-- ==============================================================================

-- 1. Hapus trigger sinkronisasi lama ke tabel registrations
DROP TRIGGER IF EXISTS trg_sync_applicants_to_registrations ON public.applicants;
DROP TRIGGER IF EXISTS trg_sync_applicant_divisions_to_registrations ON public.applicant_divisions;
DROP FUNCTION IF EXISTS public.sync_applicant_to_registrations() CASCADE;

-- 2. Hapus tabel legacy registrations dan tabel test_tab
DROP TABLE IF EXISTS public.registrations CASCADE;
DROP TABLE IF EXISTS public.test_tab CASCADE;

-- 3. Hardening Keamanan View & Functions (Menghilangkan Warning UNRESTRICTED)
ALTER VIEW public.view_registrations SET (security_invoker = true);
REVOKE ALL ON public.view_registrations FROM anon;
GRANT SELECT ON public.view_registrations TO authenticated;
GRANT ALL ON public.view_registrations TO service_role;

ALTER FUNCTION public.enforce_applicant_divisions_immutability() SET search_path = public;
ALTER FUNCTION public.check_registration_oprec_open() SET search_path = public;
ALTER FUNCTION public.handle_admin_settings_updated_at() SET search_path = public;
ALTER FUNCTION public.enforce_applicants_immutability() SET search_path = public;

