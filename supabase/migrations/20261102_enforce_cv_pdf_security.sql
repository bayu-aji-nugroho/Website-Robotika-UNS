-- Migrasi: Pengetatan Keamanan Berkas CV & Bucket cv-uploads
-- Memastikan berkas CV hanya berformat PDF murni, menolak berkas eksekusi (.exe) atau manipulasi ekstensi ganda (.exe.pdf).

-- 1. Konfigurasi Batas Storage Bucket 'cv-uploads'
UPDATE storage.buckets 
SET 
  public = false,
  file_size_limit = 1048576, -- Maksimal 1 MB (1.048.576 bytes)
  allowed_mime_types = ARRAY['application/pdf']
WHERE id = 'cv-uploads';

-- 2. Check Constraint pada Tabel public.applicants
-- Memvalidasi bahwa nama berkas CV hanya berakhiran .pdf dan tidak mengandung ekstensi terlarang (double extension)
ALTER TABLE public.applicants 
  DROP CONSTRAINT IF EXISTS chk_applicants_cv_file_name_pdf;

ALTER TABLE public.applicants 
  ADD CONSTRAINT chk_applicants_cv_file_name_pdf 
  CHECK (
    cv_file_name IS NULL OR (
      lower(cv_file_name) LIKE '%.pdf'
      AND lower(cv_file_name) !~* '\.(exe|dll|bat|cmd|scr|pif|vbs|js|ps1|sh|bin|hta|msi|cpl|com|jar)\.'
    )
  );
