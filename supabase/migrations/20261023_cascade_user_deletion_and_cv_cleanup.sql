-- ==============================================================================
-- Migrasi: Keterikatan Integritas 100% Antara auth.users dan public.registrations
-- UKM Robotika Universitas Sebelas Maret (UNS)
-- ==============================================================================

-- 1. Tambahkan Foreign Key dari public.registrations(user_id) ke auth.users(id) dengan ON DELETE CASCADE
ALTER TABLE public.registrations
  ADD CONSTRAINT fk_registrations_user
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Catatan: Supabase secara ketat melarang perintah SQL langsung 'DELETE FROM storage.objects'
-- (SQLSTATE 42501: Direct deletion from storage tables is not allowed).
-- Penghapusan berkas CV fisik di storage dilakukan melalui Supabase Storage API:
-- supabase.storage.from('cv-uploads').remove([storagePath])
