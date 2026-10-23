-- ==============================================================================
-- Migrasi Keamanan Produksi: Supabase PostgreSQL & Storage Hardening
-- UKM Robotika Universitas Sebelas Maret (UNS)
-- ==============================================================================

-- 1. Pertahanan Level Basis Data (Defense in Depth Constraints)
ALTER TABLE public.registrations
  ADD CONSTRAINT chk_status_allowed CHECK (status IN ('draft', 'submitted')),
  ADD CONSTRAINT chk_current_step_range CHECK (current_step BETWEEN 1 AND 6),
  ADD CONSTRAINT chk_nim_format CHECK (nim IS NULL OR (length(nim) BETWEEN 7 AND 12 AND nim ~* '^[FGTHIDEDBKMVLZCP][0-9A-Z]+$')),
  ADD CONSTRAINT chk_whatsapp_format CHECK (whatsapp IS NULL OR (whatsapp ~ '^08[0-9]{8,13}$'));

-- 2. Kunci Total Akses Mutasi Langsung dari Klien (Blokir Bypass Edge Function via PostgREST)
ALTER POLICY "registrations_user_insert" ON public.registrations WITH CHECK (false);
ALTER POLICY "registrations_user_update" ON public.registrations USING (false) WITH CHECK (false);

-- 3. Amankan Fungsi Trigger Immutability dari Eksekusi RPC Publik (Supabase Linter Fix)
REVOKE EXECUTE ON FUNCTION public.enforce_registration_immutability() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_registration_immutability() TO postgres, service_role;

-- 4. Kunci Bucket Storage 'cv-uploads' Menjadi Private (Perlindungan Data Pribadi / UU PDP)
UPDATE storage.buckets 
SET public = false 
WHERE id = 'cv-uploads';
