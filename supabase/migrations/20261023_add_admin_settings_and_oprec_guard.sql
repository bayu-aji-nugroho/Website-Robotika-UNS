-- ==============================================================================
-- Migrasi: Tabel Pengaturan Admin & Proteksi Zero-Trust OPREC Robotika UNS
-- ==============================================================================

-- 1. Buat Tabel Singleton admin_settings
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  is_oprec BOOLEAN NOT NULL DEFAULT false,
  label TEXT NOT NULL DEFAULT 'Informasi pendaftaran segera diumumkan',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Sisipkan Rekor Awal (Default: Oprec Nonaktif / False)
INSERT INTO public.admin_settings (id, is_oprec, label)
VALUES (1, false, 'Informasi pendaftaran segera diumumkan')
ON CONFLICT (id) DO UPDATE 
SET is_oprec = EXCLUDED.is_oprec,
    label = EXCLUDED.label,
    updated_at = now();

-- 3. Konfigurasi Row Level Security (RLS)
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Izinkan publik (anon dan authenticated) membaca konfigurasi untuk tampilan frontend
DROP POLICY IF EXISTS "admin_settings_select_public" ON public.admin_settings;
CREATE POLICY "admin_settings_select_public" 
  ON public.admin_settings 
  FOR SELECT 
  USING (true);

-- Blokir mutasi langsung dari pengguna publik (hanya service_role / admin database)
DROP POLICY IF EXISTS "admin_settings_mutation_service_only" ON public.admin_settings;
CREATE POLICY "admin_settings_mutation_service_only" 
  ON public.admin_settings 
  FOR ALL 
  USING (false);

-- 4. Fungsi & Trigger Pertahanan Basis Data (Database Defense-in-Depth)
-- Mencegah penambahan atau pembaruan data registrasi sama sekali jika OPREC ditutup
CREATE OR REPLACE FUNCTION public.check_registration_oprec_open()
RETURNS TRIGGER AS $$
DECLARE
  v_is_oprec BOOLEAN;
BEGIN
  SELECT is_oprec INTO v_is_oprec FROM public.admin_settings WHERE id = 1 LIMIT 1;
  IF v_is_oprec IS NOT TRUE THEN
    RAISE EXCEPTION 'Akses ditolak: Pendaftaran calon anggota sedang ditutup (Oprec Inactive). Tidak diperkenankan menyimpan atau memodifikasi data.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.check_registration_oprec_open() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_registration_oprec_open() TO postgres, service_role;

DROP TRIGGER IF EXISTS trg_enforce_oprec_active ON public.registrations;
CREATE TRIGGER trg_enforce_oprec_active
BEFORE INSERT OR UPDATE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.check_registration_oprec_open();
