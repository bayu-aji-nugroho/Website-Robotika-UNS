-- Ganti nama tampilan divisi nonteknis (ID tetap agar relasi data pendaftar aman)
UPDATE public.divisions SET name = 'Keuangan' WHERE id = 'bendahara';
UPDATE public.divisions SET name = 'Hubeks (Hubungan Eksternal)' WHERE id = 'humas';
UPDATE public.divisions SET name = 'Media Visual' WHERE id = 'media-branding';
