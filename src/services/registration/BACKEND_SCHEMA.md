# Spesifikasi Backend: Data Registrasi Calon Anggota Robotika UNS

Dokumentasi ini adalah spesifikasi teknis untuk implementasi endpoint API dan penyimpanan database pendaftaran calon anggota baru UKM Robotika UNS. Dokumen ini dirancang sebagai pegangan backend secara umum (agnostik terhadap bahasa pemrograman, framework, dan vendor database).

Format dokumen cetak PDF tersedia di: `docs/DOKUMENTASI_BACKEND_REGISTRASI.pdf`.

---

## 1. Ruang Lingkup dan Batasan Sistem

Dokumentasi ini hanya mencakup alur penerimaan data (intake form), yaitu:
1. Menerima payload formulir pendaftaran dari frontend web.
2. Memvalidasi integritas data identitas, pilihan divisi, dan berkas fisik CV di sisi server.
3. Menyimpan berkas fisik CV ke storage (object storage atau server disk).
4. Menyimpan data pendaftaran ke tabel database relasional.
5. Mengembalikan status respons HTTP dan kode registrasi ke frontend.

Proses di luar penerimaan formulir (seperti dashboard seleksi, penilaian wawancara, atau pengumuman) ditangani pada modul terpisah setelah data tersimpan.

---

## 2. Alur Pengiriman Data (End-to-End Workflow)

1. **Pengisian Form di Frontend**: Calon anggota menyetujui syarat seleksi, mengisi data diri (Nama, NIM, Program Studi, Angkatan, nomor WhatsApp), memilih 2 divisi beserta alasan, mengunggah berkas CV format PDF (maksimal 1.0 MB), dan menyetujui keabsahan berkas.
2. **Validasi Awal di Klien**: Frontend memeriksa format dasar (ekstensi `.pdf`, batas ukuran 1 MB) dan men-generate kode registrasi sementara (`ROB-UNS-2026-XXXX`).
3. **Pengiriman Request**: Frontend mengirim HTTP POST request ke backend. Metode default menggunakan `multipart/form-data` karena menyertakan berkas fisik.
4. **Pemrosesan di Backend**:
   - Backend memverifikasi seluruh field wajib.
   - Backend memeriksa keunikan NIM (mencegah pendaftaran ganda).
   - Backend memvalidasi berkas CV (tipe MIME `application/pdf`, magic bytes `%PDF-`, ukuran <= 1 MB).
   - Backend menyimpan berkas CV ke storage dan membuat path referensi.
   - Backend menyimpan record pendaftaran ke database.
5. **Respons HTTP**: Backend mengembalikan status `201 Created`. Frontend menampilkan halaman tanda terima dan akses tautan grup WhatsApp.

---

## 3. Spesifikasi Endpoint API

- **Method**: `POST`
- **Path Rekomendasi**: `/api/v1/registrations`
- **Headers**:
  - `Accept: application/json`
  - `Content-Type: multipart/form-data` (default saat unggah berkas fisik) atau `application/json` (jika berkas diunggah via storage presigned URL)

### Daftar Field Multipart (`multipart/form-data`)

| Field Key | Tipe Data | Status | Keterangan & Validasi | Contoh Nilai |
| :--- | :--- | :--- | :--- | :--- |
| `registration_code` | String | Wajib | Kode registrasi unik pendaftar. Maksimal 32 karakter. | `ROB-UNS-2026-1042` |
| `full_name` | String | Wajib | Nama lengkap mahasiswa. Maksimal 255 karakter. | `Dimas Arya Prasetya` |
| `nim` | String | Wajib | NIM huruf kapital, unik di database. Maksimal 30 karakter. | `I0724018` |
| `prodi` | String | Wajib | Nama program studi. | `S1 Teknik Elektro` |
| `angkatan` | String | Wajib | Tahun masuk kuliah (4 digit angka). | `2025` |
| `whatsapp` | String | Wajib | Nomor telepon aktif tersanitasi (hanya angka, awalan `08`). | `081234567891` |
| `primary_division_id` | String | Wajib | Identifier divisi pilihan pertama. | `werkudara-pemrograman` |
| `primary_division_name` | String | Wajib | Nama divisi pilihan pertama. | `Werkudara - Pemrograman` |
| `primary_division_category` | String | Wajib | Nilai enum: `teknis` atau `non-teknis`. | `teknis` |
| `primary_reason` | Text | Wajib | Alasan memilih divisi pertama. | Alasan minat mikrokontroler... |
| `secondary_division_id` | String | Wajib | Identifier divisi pilihan kedua (tidak boleh sama dengan pilihan 1). | `werkudara-elektronika` |
| `secondary_division_name` | String | Wajib | Nama divisi pilihan kedua. | `Werkudara - Elektronika` |
| `secondary_division_category` | String | Wajib | Nilai enum: `teknis` atau `non-teknis`. | `teknis` |
| `secondary_reason` | Text | Wajib | Alasan memilih divisi kedua. | Alasan minat hardware PCB... |
| `agreed_requirements` | Boolean / String | Wajib | Nilai `true` (persetujuan syarat umum). | `true` |
| `agreed_truth` | Boolean / String | Wajib | Nilai `true` (pernyataan keabsahan dokumen). | `true` |
| `submitted_at` | String | Opsional | Timestamp ISO 8601 saat form dikirim dari browser. | `2026-10-18T08:15:30.000Z` |
| `payload_json` | String JSON | Opsional | Serialisasi payload terstruktur frontend untuk audit log. | `{"registrationCode":...}` |
| `cv_file` | File Biner | Wajib | Berkas fisik PDF kurikulum vitae, maksimal 1.048.576 bytes. | `berkas_cv.pdf` |

---

## 4. Format JSON Payload Alternatif

Bila arsitektur backend menggunakan pemisahan upload (misal frontend mengunggah berkas langsung ke S3 presigned URL), endpoint dapat menerima payload format `application/json`:

```json
{
  "registrationCode": "ROB-UNS-2026-1042",
  "applicant": {
    "fullName": "Dimas Arya Prasetya",
    "nim": "I0724018",
    "prodi": "S1 Teknik Elektro",
    "angkatan": "2025",
    "whatsapp": "081234567891"
  },
  "divisions": {
    "primary": {
      "id": "werkudara-pemrograman",
      "name": "Werkudara - Pemrograman",
      "category": "teknis",
      "reason": "Memiliki dasar pemrograman C++ dan minat pada robot tanding KRAI."
    },
    "secondary": {
      "id": "werkudara-elektronika",
      "name": "Werkudara - Elektronika",
      "category": "teknis",
      "reason": "Tertarik mempelajari layout skematik PCB dan perancangan sirkuit daya."
    }
  },
  "cvFileMetadata": {
    "fileName": "CV_Dimas_Arya_Prasetya.pdf",
    "fileSizeBytes": 624500,
    "fileSizeFormatted": "610 KB"
  },
  "consents": {
    "agreedToRequirements": true,
    "agreedToCvTruth": true
  },
  "metadata": {
    "submittedAt": "2026-10-18T08:15:30.000Z",
    "source": "web_registration_portal"
  }
}
```

---

## 5. Aturan Validasi Sisi Backend

1. **Pengecekan Duplikasi NIM**: Lakukan pengecekan sebelum simpan. Jika NIM sudah ada, kembalikan HTTP `409 Conflict`.
2. **Pilihan Divisi**: Pastikan `primary_division_id` tidak identik dengan `secondary_division_id`.
3. **Validasi Berkas CV**:
   - Ukuran maksimum: `1.048.576 bytes` (1.0 MB).
   - Tipe konten: `application/pdf`.
   - Magic byte header file: Wajib diawali string `%PDF-` (hex `25 50 44 46`).
4. **Sanitasi Nomor WhatsApp**: Hapus spasi dan tanda minus. Ganti awalan `+62` atau `62` menjadi `08`.
5. **Persetujuan Wajib**: Pastikan `agreed_requirements` dan `agreed_truth` keduanya bernilai `true`.

---

## 6. Desain Skema Database Relasional (SQL Standar)

Skema tabel berikut menggunakan standar ANSI SQL dan dapat digunakan langsung pada PostgreSQL, MySQL, MariaDB, SQLite, atau Supabase:

```sql
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_code VARCHAR(32) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  nim VARCHAR(30) NOT NULL UNIQUE,
  prodi VARCHAR(150) NOT NULL,
  angkatan VARCHAR(10) NOT NULL,
  whatsapp VARCHAR(30) NOT NULL,
  
  -- Pilihan Divisi Pertama
  primary_division_id VARCHAR(100) NOT NULL,
  primary_division_name VARCHAR(150) NOT NULL,
  primary_division_category VARCHAR(20) NOT NULL,
  primary_reason TEXT NOT NULL,
  
  -- Pilihan Divisi Kedua
  secondary_division_id VARCHAR(100) NOT NULL,
  secondary_division_name VARCHAR(150) NOT NULL,
  secondary_division_category VARCHAR(20) NOT NULL,
  secondary_reason TEXT NOT NULL,
  
  -- Metadata Berkas CV
  cv_file_name VARCHAR(255) NOT NULL,
  cv_file_size_bytes BIGINT NOT NULL,
  cv_storage_path TEXT NULL,
  cv_file_url TEXT NULL,
  
  -- Persetujuan dan Timestamp
  agreed_requirements BOOLEAN DEFAULT TRUE NOT NULL,
  agreed_truth BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indeks performa untuk pencarian identitas dan verifikasi
CREATE UNIQUE INDEX idx_registrations_nim ON registrations(nim);
CREATE UNIQUE INDEX idx_registrations_code ON registrations(registration_code);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
```

> **Catatan Portabilitas**: Pada MySQL / MariaDB, ganti tipe data `UUID DEFAULT gen_random_uuid()` menjadi `VARCHAR(36)` atau `id BIGINT AUTO_INCREMENT PRIMARY KEY`, serta sesuaikan `TIMESTAMP WITH TIME ZONE` menjadi `DATETIME DEFAULT CURRENT_TIMESTAMP`.

---

## 7. Manajemen Penyimpanan Berkas CV

- **Pola Penamaan File**:
  `cv-uploads/[angkatan]/[NIM]_[clean_filename].pdf`
  Contoh: `cv-uploads/2025/I0724018_Dimas_Arya_Prasetya_CV.pdf`
- **Tujuan Storage**:
  - *Object Storage (S3 / MinIO / GCS / Supabase)*: Simpan path bucket di kolom `cv_storage_path` dan URL akses di `cv_file_url`.
  - *Local Disk Server*: Simpan file di folder lokal server (misal `/var/storage/cv/...`) dan buat endpoint download atau dilayani lewat reverse proxy berizin.

---

## 8. Kode Respons HTTP dan Skema Respons

| Kode HTTP | Kondisi | Format Respons JSON |
| :--- | :--- | :--- |
| **`201 Created`** | Berhasil memvalidasi dan menyimpan ke database. | `{"success": true, "message": "Pendaftaran berhasil disimpan", "registrationCode": "ROB-UNS-2026-1042"}` |
| **`400 Bad Request`** | Data wajib belum lengkap atau berkas bukan PDF. | `{"success": false, "message": "Validasi gagal", "error": "Pilihan divisi pertama dan kedua tidak boleh sama"}` |
| **`409 Conflict`** | NIM sudah pernah didaftarkan sebelumnya. | `{"success": false, "message": "Data sudah terdaftar", "error": "NIM I0724018 sudah pernah didaftarkan"}` |
| **`413 Payload Too Large`** | Ukuran berkas CV melebihi batas 1.0 MB. | `{"success": false, "message": "Berkas terlalu besar", "error": "Ukuran berkas CV maksimal 1.0 MB"}` |
| **`500 Internal Error`** | Kesalahan koneksi database atau kegagalan disk storage. | `{"success": false, "message": "Terjadi kesalahan internal server", "error": "Gagal menyimpan record"}` |

---

## 9. Contoh Perintah Uji Endpoint (cURL)

```bash
curl -X POST "http://localhost:8000/api/v1/registrations" \
  -H "Accept: application/json" \
  -F "registration_code=ROB-UNS-2026-1042" \
  -F "full_name=Dimas Arya Prasetya" \
  -F "nim=I0724018" \
  -F "prodi=S1 Teknik Elektro" \
  -F "angkatan=2025" \
  -F "whatsapp=081234567891" \
  -F "primary_division_id=werkudara-pemrograman" \
  -F "primary_division_name=Werkudara - Pemrograman" \
  -F "primary_division_category=teknis" \
  -F "primary_reason=Memiliki dasar pemrograman C++ dan algoritma kontrol gerak robot." \
  -F "secondary_division_id=werkudara-elektronika" \
  -F "secondary_division_name=Werkudara - Elektronika" \
  -F "secondary_division_category=teknis" \
  -F "secondary_reason=Tertarik mendalami perancangan sirkuit daya dan layout PCB." \
  -F "agreed_requirements=true" \
  -F "agreed_truth=true" \
  -F "submitted_at=2026-10-18T08:15:30.000Z" \
  -F "cv_file=@/path/to/berkas_cv.pdf;type=application/pdf"
```
