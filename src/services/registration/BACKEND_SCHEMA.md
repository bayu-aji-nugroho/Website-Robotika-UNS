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
   - `idx_registrations_nim`: NIM unik (tidak boleh dobel).
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
- **Response**: Status `201 Created`, `{ "success": true, "registrationCode": "ROB-UNS-2026-XXXX", "data": ... }`

---

## 3. Desain Skema Database PostgreSQL Supabase

```sql
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  registration_code VARCHAR(32) UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  current_step INT NOT NULL DEFAULT 3,
  
  -- Identitas
  full_name VARCHAR(255),
  nim VARCHAR(30),
  fakultas VARCHAR(100),
  prodi VARCHAR(150),
  angkatan VARCHAR(10),
  whatsapp VARCHAR(30),
  
  -- Pilihan Divisi
  primary_division_id VARCHAR(100),
  primary_division_name VARCHAR(150),
  primary_division_category VARCHAR(20),
  primary_reason TEXT,
  secondary_division_id VARCHAR(100),
  secondary_division_name VARCHAR(150),
  secondary_division_category VARCHAR(20),
  secondary_reason TEXT,
  
  -- Berkas CV
  cv_file_name VARCHAR(255),
  cv_file_size_bytes BIGINT,
  cv_storage_path TEXT,
  cv_file_url TEXT,
  agreed_requirements BOOLEAN DEFAULT FALSE,
  agreed_truth BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hard Constraints
ALTER TABLE public.registrations 
  ADD CONSTRAINT chk_fullname_no_numbers CHECK (full_name IS NULL OR full_name !~ '[0-9]');

ALTER TABLE public.registrations 
  ADD CONSTRAINT chk_angkatan_allowed CHECK (angkatan IS NULL OR angkatan IN ('2025', '2026'));

-- Unique Indexes
CREATE UNIQUE INDEX idx_registrations_user_id ON public.registrations(user_id);
CREATE UNIQUE INDEX idx_registrations_nim ON public.registrations(UPPER(nim)) WHERE nim IS NOT NULL;
CREATE INDEX idx_registrations_status ON public.registrations(status);

-- RLS Policies
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "registrations_user_select" ON public.registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "registrations_user_insert" ON public.registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "registrations_user_update" ON public.registrations FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
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
| **Token Tidak Ada / Kedaluwarsa** | `401 Unauthorized` | `{"success": false, "error": "Akses ditolak: Token autentikasi tidak ditemukan."}` |
