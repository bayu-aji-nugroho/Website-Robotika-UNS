-- Migrasi: Perbaikan Trigger Function check_registration_oprec_open dan enforce_applicant_divisions_immutability
-- Masalah sebelumnya: Kedua fungsi trigger menggunakan 'RETURN NEW;' tanpa memeriksa 'TG_OP = ''DELETE'''.
-- Pada operasi DELETE di PostgreSQL, 'NEW' bernilai NULL. Mengembalikan NULL pada BEFORE DELETE menyebabkan PostgreSQL membatalkan operasi DELETE secara diam-diam.
-- Akibatnya relasi divisi lama tidak terhapus dan memicu 'duplicate key value violates unique constraint "uq_applicant_priority"' saat insert pilihan baru.

CREATE OR REPLACE FUNCTION public.check_registration_oprec_open()
RETURNS TRIGGER AS $$
DECLARE
  v_is_oprec BOOLEAN;
BEGIN
  SELECT is_oprec INTO v_is_oprec FROM public.admin_settings WHERE id = 1 LIMIT 1;
  IF v_is_oprec IS NOT TRUE THEN
    RAISE EXCEPTION 'Akses ditolak: Pendaftaran calon anggota sedang ditutup (Oprec Inactive). Tidak diperkenankan menyimpan atau memodifikasi data.';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.enforce_applicant_divisions_immutability()
RETURNS TRIGGER AS $$
DECLARE
  v_status VARCHAR(20);
BEGIN
  SELECT status INTO v_status FROM public.applicants WHERE id = COALESCE(NEW.applicant_id, OLD.applicant_id);
  IF v_status = 'submitted' THEN
    RAISE EXCEPTION 'Pilihan divisi tidak dapat diubah atau dihapus karena berkas pendaftaran telah dikirim.';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
