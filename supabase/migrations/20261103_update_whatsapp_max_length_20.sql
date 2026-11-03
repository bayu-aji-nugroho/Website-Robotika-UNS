-- ==============================================================================
-- Migrasi: Perbarui Batas Maksimal Nomor WhatsApp Menjadi 20 Digit (10-20 digit)
-- UKM Robotika Universitas Sebelas Maret (UNS)
-- ==============================================================================

ALTER TABLE public.applicants
  DROP CONSTRAINT IF EXISTS applicants_whatsapp_check;

ALTER TABLE public.applicants
  ADD CONSTRAINT applicants_whatsapp_check
  CHECK (whatsapp IS NULL OR (whatsapp ~ '^08[0-9]{8,18}$'));

