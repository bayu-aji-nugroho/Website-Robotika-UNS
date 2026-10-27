# Spesifikasi Backend: Data Registrasi Calon Anggota Robotika UNS (Edge Function & Zero Trust)

Dokumentasi ini adalah spesifikasi teknis implementasi backend Supabase Edge Function (`registration-step`) dan database PostgreSQL untuk pendaftaran calon anggota baru UKM Robotika UNS. Sistem dirancang dengan arsitektur **Zero Trust** dan penyimpanan bertahap (*multi-stage persistent draft*).

---

## 1. Arsitektur & Keamanan (Zero Trust)

Sistem pendaftaran menerapkan prinsip **Zero Trust Architecture**:
1. **Autentikasi Wajib**: Setiap request (kecuali preflight OPTIONS) memerlukan *Bearer JWT Token* pengguna yang didapat dari Supabase Auth (Google OAuth).
2. **Server-Side Validation**: Seluruh data divalidasi dan disanitasi di sisi backend Edge Function sebelum menyentuh database.
3. **Database Constraints (Defense in Depth)**: PostgreSQL menerapkan aturan keras:
   - `chk_fullname_no_numbers`: Nama tidak boleh mengandung angka.
   - `chk_angkatan_allowed`: Angkatan hanya diperbolehkan `2025` dan `2026`.
   - `idx_applicants_nim`: NIM unik (tidak boleh dobel).
4. **Row Level Security (RLS)**: Hanya pengguna pemilik data (`auth.uid() = user_id`) yang dapat membaca atau mengupdate draft pendaftarannya.

---

## 2. Spesifikasi Endpoint Supabase Edge Function

- **Nama Function**: `registration-step`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <SUPABASE_JWT_TOKEN>`
  - `apikey: <SUPABASE_ANON_KEY>`
  - `Content-Type: application/json` (untuk action step 3, step 4, cek NIM, get progress)
  - `Content-Type: multipart/form-data` (khusus action submit final berkas CV)

### Action 1: `get_progress`
Mengambil data pendaftaran akun pengguna saat ini untuk memulihkan form (*auto-restore*).
- **Request Body**: `{ "action": "get_progress" }`
- **Response**: `{ "success": true, "data": SupabaseRegistrationRecord | null }`

### Action 2: `check_nim`
Memeriksa ketersediaan NIM secara real-time.
- **Request Body**: `{ "action": "check_nim", "payload": { "nim": "I0724018" } }`
- **Response Sukses (Tersedia)**: `{ "available": true, "message": "NIM I0724018 tersedia." }`
- **Response Konflik (Dobel)**: Status `409 Conflict`, `{ "available": false, "error": "NIM I0724018 sudah digunakan oleh pendaftar lain." }`

### Action 3: `save_step_3` (Simpan Permanen Identitas)
Menyimpan data identitas mahasiswa ke tabel database dengan status `draft` dan `current_step = 3`.
- **Request Body**:
  ```json
  {
    "action": "save_step_3",
    "payload": {
      "fullName": "Dimas Arya Prasetya",
      "nim": "I0724018",
      "angkatan": "2025",
      "prodi": "S1 Teknik Elektro",
      "whatsapp": "081234567891"
    }
  }
  ```
- **Aturan Validasi & Penolakan Anomali**:
  - `fullName`: Minimal 3 karakter. **Ditolak (422)** jika terdapat angka (`/\d/`) atau simbol ilegal (`<>;$%\`).
  - `angkatan`: **Hanya** `"2025"` atau `"2026"`. **Ditolak (422)** jika angkatan 2023, 2024, dll.
  - `nim`: Format UNS resmi diawali huruf fakultas valid (`F, G, H, I, D, E, B, K, M, V, L, Z, C, P`), panjang 7-12 karakter. **Ditolak (409)** jika NIM sudah digunakan oleh akun lain.
  - `whatsapp`: Disanitasi (awalan `+628`/`628` -> `08`), panjang 10-15 digit angka.
- **Response**: Status `200 OK`, `{ "success": true, "message": "Data identitas berhasil disimpan permanen.", "data": ... }`

### Action 4: `save_step_4` (Simpan Permanen Pilihan Divisi)
Memperbarui pilihan divisi dan alasan ke tabel database dengan `current_step = 4`.
- **Request Body**:
  ```json
  {
    "action": "save_step_4",
    "payload": {
      "primaryDivisionId": "werkudara-pemrograman",
      "primaryDivisionName": "Werkudara - Pemrograman",
      "primaryDivisionCategory": "teknis",
      "primaryReason": "Memiliki dasar pemrograman C++...",
      "secondaryDivisionId": "werkudara-elektronika",
      "secondaryDivisionName": "Werkudara - Elektronika",
      "secondaryDivisionCategory": "teknis",
      "secondaryReason": "Tertarik mempelajari PCB layout..."
    }
  }
  ```
- **Aturan Validasi**:
  - Divisi 1 dan Divisi 2 harus terdaftar di whitelist resmi UKM.
  - Divisi 1 dan Divisi 2 **tidak boleh sama** (Ditolak 422 jika sama).
  - Alasan minimal 15 karakter bermakna.

### Action 5: `submit_final` (Upload CV & Finalisasi Pendaftaran)
Menerima `multipart/form-data`, memverifikasi magic bytes PDF, mengunggah ke bucket storage `cv-uploads`, generate kode registrasi resmi, dan mengubah status menjadi `submitted`.
- **Form Data Fields**:
  - `action`: `"submit_final"`
  - `cv_file`: File biner PDF (maksimal 1.0 MB / 1.048.576 bytes)
  - `agreed_requirements`: `"true"`
  - `agreed_truth`: `"true"`
- **Response**: Status `201 Created`, `{ "success": true, "registrationCode": "ROB-UNS-2026-XXXXXX", "data": ... }` (Suffix 6 karakter Crockford Base32 dengan 1 miliar kombinasi unik)

---

## 3. Desain Skema Database PostgreSQL Supabase (Normalisasi 3NF)

Arsitektur database telah dinormalisasi ke bentuk **Third Normal Form (3NF)** untuk skalabilitas dan integritas relasional:

```sql
-- 1. Master Divisi
CREATE TABLE public.divisions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Biodata Pendaftar (Applicants)
CREATE TABLE public.applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  registration_code VARCHAR(32) UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  current_step INT NOT NULL DEFAULT 3 CHECK (current_step BETWEEN 1 AND 6),
  
  -- Identitas
  full_name VARCHAR(255) CHECK (full_name IS NULL OR full_name !~ '[0-9]'),
  nim VARCHAR(30),
  fakultas VARCHAR(100),
  prodi VARCHAR(150),
  angkatan VARCHAR(10) CHECK (angkatan IS NULL OR angkatan IN ('2025', '2026')),
  whatsapp VARCHAR(30) CHECK (whatsapp IS NULL OR whatsapp ~ '^08[0-9]{8,13}$'),
  
  -- Berkas CV & Persetujuan
  cv_file_name VARCHAR(255),
  cv_storage_path TEXT,
  agreed_requirements BOOLEAN DEFAULT FALSE,
  agreed_truth BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE UNIQUE INDEX idx_applicants_user_id ON public.applicants(user_id);
CREATE UNIQUE INDEX idx_applicants_nim ON public.applicants(UPPER(nim)) WHERE nim IS NOT NULL;
CREATE INDEX idx_applicants_status ON public.applicants(status);

-- 3. Pivot Pilihan Divisi (Applicant Divisions - Relasional Scalable)
CREATE TABLE public.applicant_divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES public.applicants(id) ON DELETE CASCADE,
  division_id VARCHAR(50) NOT NULL REFERENCES public.divisions(id) ON DELETE RESTRICT,
  priority INT NOT NULL CHECK (priority >= 1),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT uq_applicant_priority UNIQUE (applicant_id, priority),
  CONSTRAINT uq_applicant_division UNIQUE (applicant_id, division_id)
);

CREATE INDEX idx_applicant_divisions_lookup ON public.applicant_divisions(division_id, priority);
CREATE INDEX idx_applicant_divisions_applicant ON public.applicant_divisions(applicant_id);

-- 4. Tabel Assessment (Penilaian Kelulusan)
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES public.applicants(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'pertimbangan' CHECK (status IN ('diterima', 'ditolak', 'pertimbangan')),
  notes TEXT,
  assessed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT uq_assessment_applicant UNIQUE (applicant_id)
);

CREATE INDEX idx_assessments_applicant ON public.assessments(applicant_id);
CREATE INDEX idx_assessments_status ON public.assessments(status);

-- 5. View Kompatibilitas Relasional & Reporting
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
```

---

## 4. Format Respons Kesalahan (Error Payload)

| Kasus | HTTP Status | Format JSON |
| :--- | :--- | :--- |
| **Nama Mengandung Angka** | `422 Unprocessable` | `{"success": false, "field": "fullName", "error": "Nama tidak valid: nama lengkap tidak boleh mengandung angka."}` |
| **Angkatan Bukan 2025/2026** | `422 Unprocessable` | `{"success": false, "field": "angkatan", "error": "Pendaftaran hanya dibuka untuk mahasiswa angkatan 2025 dan 2026. Angkatan '2023' tidak memenuhi syarat."}` |
| **NIM Duplikat** | `409 Conflict` | `{"success": false, "field": "nim", "error": "NIM I0724018 sudah digunakan oleh pendaftar lain. Silakan periksa kembali NIM Anda."}` |
| **Format NIM Bukan Fakultas UNS** | `422 Unprocessable` | `{"success": false, "field": "nim", "error": "Format NIM tidak valid: inisial 'X' bukan kode fakultas resmi UNS (contoh valid: I0724018)."}` |
| **Ukuran Berkas CV Melebihi 1 MB**| `413 Payload Too Large`| `{"success": false, "error": "Ukuran berkas CV melebihi batas 1.0 MB (terdeteksi: 1.45 MB)."}` |
| **Rate Limit Terlampaui (Spam/Bruteforce)** | `429 Too Many Requests` | `{"success": false, "error": "Terlalu banyak permintaan pemeriksaan NIM. Silakan tunggu 58 detik sebelum mencoba kembali.", "retryAfter": 58}` |
| **Token Tidak Ada / Kedaluwarsa** | `401 Unauthorized` | `{"success": false, "error": "Akses ditolak: Token autentikasi tidak ditemukan."}` |
