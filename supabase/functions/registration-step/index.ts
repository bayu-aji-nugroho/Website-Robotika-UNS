import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const VALID_FACULTY_CODES = ["F", "G", "H", "I", "D", "E", "B", "K", "M", "V", "L", "Z", "C", "P"];

const NIM_FACULTY_MAP: Record<string, string> = {
  F: "Fakultas Ekonomi dan Bisnis",
  G: "Fakultas Kedokteran",
  H: "Fakultas Pertanian",
  I: "Fakultas Teknik",
  D: "Fakultas Ilmu Sosial dan Ilmu Politik",
  E: "Fakultas Hukum",
  B: "Fakultas Ilmu Budaya",
  K: "Fakultas Keguruan dan Ilmu Pendidikan",
  M: "Fakultas Matematika dan Ilmu Pengetahuan Alam",
  V: "Sekolah Vokasi",
  L: "Fakultas Teknologi Informasi dan Sains Data",
  Z: "Fakultas Peternakan",
  C: "Fakultas Seni Rupa dan Desain",
  P: "Fakultas Psikologi",
};

const VALID_DIVISIONS = [
  "werkudara-pemrograman",
  "werkudara-elektronika",
  "werkudara-mekanika",
  "cakrawala-pemrograman",
  "cakrawala-elektronika",
  "cakrawala-mekanika",
  "administrasi",
  "bendahara",
  "pengembangan-organisasi",
  "media-branding",
  "humas",
];

function sanitizePhone(phone: string): string {
  const cleaned = phone.trim().replace(/[-\s]/g, "");
  if (cleaned.startsWith("+62")) return "0" + cleaned.slice(3);
  if (cleaned.startsWith("62")) return "0" + cleaned.slice(2);
  return cleaned;
}

function generateRegCode(prefix = "ROB-UNS-2026"): string {
  // Karakter aman Crockford Base32 (32 karakter, tanpa angka/huruf ambigu 0/O, 1/I)
  // Menghasilkan 32^6 = 1.073.741.824 kombinasi unik dengan distribusi probabilitas merata (zero bias)
  const CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += CHARS[bytes[i] % 32];
  }
  return `${prefix}-${suffix}`;
}

// ==============================================================================
// 1. Konfigurasi Keamanan: Durasi Kedaluwarsa Signed URL CV (20 Menit = 1.200 Detik)
// ==============================================================================
const CV_SIGNED_URL_EXPIRES_IN = 20 * 60; // 20 menit sesuai UU PDP & Zero Trust

// ==============================================================================
// 1b. Pengecekan Keamanan Berkas CV (Anti .exe, Double Extension, Polyglot, Magic Bytes)
// ==============================================================================
const FORBIDDEN_CV_EXTENSIONS = new Set([
  "exe", "dll", "com", "bat", "cmd", "scr", "pif", "hta", "cpl", "jar",
  "vbs", "vbe", "js", "jse", "wsf", "wsh", "ps1", "ps1xml", "ps2", "ps2xml",
  "psc1", "psc2", "msh", "msh1", "msh2", "mshxml", "msh1xml", "msh2xml",
  "sh", "bash", "bin", "elf", "apk", "app", "msi", "msp", "gadget", "reg",
  "action", "command", "run", "py", "php", "pl", "cgi", "iso", "img", "dmg",
  "vhd", "vmdk", "sys", "drv", "ocx", "class", "vb", "vba", "ws", "sct",
  "zip", "rar", "7z", "tar", "gz"
]);

interface CvValidationResult {
  isValid: boolean;
  error?: string;
}

function validateCvFileSecurity(file: File, fileBuffer: ArrayBuffer): CvValidationResult {
  const fileName = (file.name || "").trim();

  // 1. Validasi karakter manipulasi pada nama berkas (null bytes, control characters, path traversal)
  if (/[\x00-\x1F\x7F]/.test(fileName) || fileName.includes("%00") || fileName.includes("\0") || fileName.includes("..")) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Nama berkas mengandung karakter terlarang, path traversal, atau null byte.",
    };
  }

  // 2. Deteksi Unicode Right-To-Left Override (RLO) dan directional markers yang kerap dipakai menyamarkan ekstensi .exe
  if (/[\u202A-\u202E\u2066-\u2069]/.test(fileName)) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Terdeteksi karakter penyembunyi ekstensi (Unicode direction spoofing).",
    };
  }

  // 3. Validasi Ekstensi Utama (Wajib .pdf)
  const lowerName = fileName.toLowerCase();
  if (!lowerName.endsWith(".pdf")) {
    return {
      isValid: false,
      error: "Format berkas tidak didukung. Berkas CV wajib dalam format dokumen PDF murni (.pdf).",
    };
  }

  // 4. Deteksi Serangan Double Extension / Ekstensi Berbahaya Tersembunyi (contoh: cv.exe.pdf, cv.bat.pdf)
  const nameParts = lowerName.split(".");
  if (nameParts.length < 2) {
    return {
      isValid: false,
      error: "Format nama berkas tidak valid.",
    };
  }

  for (let i = 1; i < nameParts.length - 1; i++) {
    const part = nameParts[i].trim();
    if (FORBIDDEN_CV_EXTENSIONS.has(part)) {
      return {
        isValid: false,
        error: `Keamanan berkas terancam: Terdeteksi ekstensi berbahaya tersembunyi (".${part}"). Berkas CV harus berupa dokumen PDF asli dan bukan program eksekusi.`,
      };
    }
  }

  // 5. Pengecekan MIME Type
  if (file.type) {
    const lowerType = file.type.toLowerCase().trim();
    const disallowedTypes = [
      "application/x-msdownload",
      "application/x-executable",
      "application/x-dosexec",
      "application/x-bat",
      "application/x-sh",
      "application/x-php",
      "text/javascript",
      "application/javascript",
      "application/x-zip-compressed",
    ];
    if (disallowedTypes.some((t) => lowerType.includes(t))) {
      return {
        isValid: false,
        error: "Keamanan berkas terancam: Tipe konten berkas mengindikasikan program eksekusi atau skrip berbahaya.",
      };
    }
    if (lowerType !== "application/pdf" && lowerType !== "application/x-pdf") {
      return {
        isValid: false,
        error: `Tipe MIME berkas bukan PDF resmi (terdeteksi: ${file.type}).`,
      };
    }
  }

  // 6. Validasi Binary Buffer
  const bytes = new Uint8Array(fileBuffer);
  if (bytes.length < 16) {
    return {
      isValid: false,
      error: "Ukuran berkas terlalu kecil untuk dokumen PDF yang sah.",
    };
  }

  // 6a. Deteksi Tanda Tangan Berkas Eksekusi Windows (MZ / ZM)
  if ((bytes[0] === 0x4D && bytes[1] === 0x5A) || (bytes[0] === 0x5A && bytes[1] === 0x4D)) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Berkas terdeteksi sebagai program eksekusi Windows (.exe/.dll) yang disamarkan.",
    };
  }

  // 6b. Deteksi Tanda Tangan Berkas Eksekusi Linux (ELF binary: \x7FELF)
  if (bytes[0] === 0x7F && bytes[1] === 0x45 && bytes[2] === 0x4C && bytes[3] === 0x46) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Berkas terdeteksi sebagai biner eksekusi Linux (ELF binary).",
    };
  }

  // 6c. Deteksi Tanda Tangan Berkas Eksekusi macOS (Mach-O) & Java (.class)
  const isMachO =
    (bytes[0] === 0xFE && bytes[1] === 0xED && bytes[2] === 0xFA && (bytes[3] === 0xCE || bytes[3] === 0xCF)) ||
    (bytes[0] === 0xCE && bytes[1] === 0xFA && bytes[2] === 0xED && bytes[3] === 0xFE) ||
    (bytes[0] === 0xCF && bytes[1] === 0xFA && bytes[2] === 0xED && bytes[3] === 0xFE) ||
    (bytes[0] === 0xCA && bytes[1] === 0xFE && bytes[2] === 0xBA && bytes[3] === 0xBE);
  if (isMachO) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Berkas terdeteksi sebagai program eksekusi macOS atau bytecode Java.",
    };
  }

  // 6d. Deteksi Skrip Shell (Shebang #!)
  if (bytes[0] === 0x23 && bytes[1] === 0x21) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Berkas terdeteksi sebagai skrip executable (shebang script).",
    };
  }

  // 6e. Deteksi Arsip Zip / RAR / 7z yang disamarkan
  if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Berkas terdeteksi sebagai arsip ZIP/kontainer berkas yang disamarkan.",
    };
  }
  if (bytes[0] === 0x52 && bytes[1] === 0x61 && bytes[2] === 0x72 && bytes[3] === 0x21) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Berkas terdeteksi sebagai arsip RAR yang disamarkan.",
    };
  }
  if (bytes[0] === 0x37 && bytes[1] === 0x7A && bytes[2] === 0xBC && bytes[3] === 0xAF && bytes[4] === 0x27 && bytes[5] === 0x1C) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Berkas terdeteksi sebagai arsip 7-Zip yang disamarkan.",
    };
  }

  // 6f. Validasi Magic Byte PDF Murni (%PDF-)
  const isPdfHeader =
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2D;

  if (!isPdfHeader) {
    return {
      isValid: false,
      error: "Integritas berkas gagal: Header berkas bukan dokumen PDF yang sah (Magic bytes tidak sesuai).",
    };
  }

  // 6g. Validasi Standar Versi PDF (%PDF-1.x atau %PDF-2.x)
  const versionPrefix = String.fromCharCode(bytes[5], bytes[6]);
  if (versionPrefix !== "1." && versionPrefix !== "2.") {
    return {
      isValid: false,
      error: "Integritas berkas gagal: Versi format standar PDF tidak dikenali.",
    };
  }

  // 7. Deep Scanning Konten Teks Binary (Deteksi Polyglot Executable & DOS Stub)
  let textContent = "";
  try {
    textContent = new TextDecoder("latin1").decode(bytes);
  } catch {
    const limit = Math.min(bytes.length, 1048576);
    let str = "";
    for (let i = 0; i < limit; i++) {
      str += String.fromCharCode(bytes[i]);
    }
    textContent = str;
  }

  // 7a. DOS Stub Detection: Dokumen PDF resmi TIDAK PERNAH memiliki string stub Windows DOS
  if (
    textContent.includes("This program cannot be run in DOS mode") ||
    textContent.includes("This program must be run under Win32")
  ) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Terdeteksi DOS Stub program eksekusi Windows (.exe) tersembunyi di dalam berkas.",
    };
  }

  // 7b. Deteksi PE Header Signature (PE\0\0)
  if (textContent.includes("PE\0\0")) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Terdeteksi tanda tangan Portable Executable (PE Header) di dalam berkas.",
    };
  }

  // 7c. Deteksi Action Berbahaya pada PDF (/Launch action yang memicu eksekusi berkas eksternal)
  if (/\/Launch\s*[\/<\[\(\{]/.test(textContent)) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Terdeteksi perintah eksekusi aplikasi eksternal (/Launch action) di dalam dokumen PDF.",
    };
  }

  // 7d. Deteksi Embedded Executable Files dalam PDF Streams
  const suspiciousEmbedded = /\.(exe|dll|bat|cmd|scr|pif|vbs|js|ps1|sh|bin|hta|msi)\b/i;
  if (textContent.includes("/EmbeddedFiles") && suspiciousEmbedded.test(textContent)) {
    return {
      isValid: false,
      error: "Keamanan berkas terancam: Terdeteksi berkas program eksekusi yang disematkan di dalam PDF.",
    };
  }

  // 8. Validasi Penutup Dokumen PDF (%%EOF)
  // Spesifikasi ISO 32000-1 mewajibkan penanda %%EOF pada blok akhir berkas (2048 byte terakhir)
  const tailLength = Math.min(bytes.length, 2048);
  const tailBytes = bytes.slice(bytes.length - tailLength);
  let tailText = "";
  try {
    tailText = new TextDecoder("latin1").decode(tailBytes);
  } catch {
    for (let i = 0; i < tailBytes.length; i++) {
      tailText += String.fromCharCode(tailBytes[i]);
    }
  }

  if (!tailText.includes("%%EOF")) {
    return {
      isValid: false,
      error: "Integritas berkas gagal: Dokumen PDF tidak lengkap atau penanda akhir berkas (%%EOF) tidak ditemukan.",
    };
  }

  return { isValid: true };
}

// ==============================================================================
// 2. Konfigurasi Keamanan: Rate Limiter In-Memory Sliding Window
// ==============================================================================
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs = 60000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    if (rateLimitStore.size > 2000) cleanupRateLimitStore();
    return { allowed: true, remaining: maxRequests - 1, retryAfterSeconds: 0 };
  }

  if (record.count >= maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    retryAfterSeconds: 0,
  };
}

const ACTION_RATE_LIMITS: Record<string, { max: number; windowMs: number; label: string }> = {
  check_nim: { max: 20, windowMs: 60000, label: "pemeriksaan NIM" },
  save_step_3: { max: 10, windowMs: 60000, label: "penyimpanan data identitas" },
  save_step_4: { max: 10, windowMs: 60000, label: "penyimpanan pilihan divisi" },
  submit_final: { max: 5, windowMs: 60000, label: "pengiriman berkas final CV" },
  get_progress: { max: 30, windowMs: 60000, label: "pemeriksaan progres pendaftaran" },
};

async function checkOprecStatus(adminClient: SupabaseClient): Promise<{ isOpen: boolean; label: string }> {
  try {
    const { data } = await adminClient
      .from("admin_settings")
      .select("is_oprec, label")
      .eq("id", 1)
      .maybeSingle();
    return {
      isOpen: data ? Boolean(data.is_oprec) : false,
      label: data?.label || "Informasi pendaftaran segera diumumkan",
    };
  } catch {
    return {
      isOpen: false,
      label: "Informasi pendaftaran segera diumumkan",
    };
  }
}

interface DivisionRelRecord {
  name?: string | null;
  category?: string | null;
}

interface ApplicantDivisionRelRecord {
  id?: string;
  applicant_id?: string;
  division_id?: string;
  priority?: number;
  reason?: string;
  divisions?: DivisionRelRecord | null;
}

interface ApplicantRawRecord {
  id?: string;
  user_id?: string;
  user_email?: string;
  registration_code?: string | null;
  status?: string;
  current_step?: number;
  full_name?: string | null;
  nim?: string | null;
  fakultas?: string | null;
  prodi?: string | null;
  angkatan?: string | null;
  whatsapp?: string | null;
  applicant_divisions?: ApplicantDivisionRelRecord[];
  cv_file_name?: string | null;
  cv_file_size_bytes?: number | null;
  cv_file_url?: string | null;
  cv_storage_path?: string | null;
  twibbon_url?: string | null;
  portfolio_url?: string | null;
  agreed_truth?: boolean;
  submitted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Format data applicant dari database ter-normalisasi (3NF)
 * Menyertakan relasi divisi sekaligus properti flat untuk kompatibilitas mundur 100%
 */
function formatApplicantRecord(applicant: ApplicantRawRecord | null) {
  if (!applicant) return null;
  const divisions = applicant.applicant_divisions || [];
  const p1 = divisions.find((d) => d.priority === 1);
  const p2 = divisions.find((d) => d.priority === 2);

  return {
    ...applicant,
    primary_division_id: p1?.division_id || null,
    primary_division_name: p1?.divisions?.name || p1?.division_id || null,
    primary_division_category: p1?.divisions?.category || "teknis",
    primary_reason: p1?.reason || null,
    secondary_division_id: p2?.division_id || null,
    secondary_division_name: p2?.divisions?.name || p2?.division_id || null,
    secondary_division_category: p2?.divisions?.category || "teknis",
    secondary_reason: p2?.reason || null,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Akses ditolak: Token autentikasi tidak ditemukan." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? supabaseAnonKey;

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Periksa status OPREC global dari database
    const oprecStatus = await checkOprecStatus(supabaseAdmin);

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Sesi tidak valid atau telah berakhir. Silakan login Google kembali." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    // Handler untuk multipart form data (submit final dengan upload CV)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const action = formData.get("action")?.toString();

      if (action !== "submit_final") {
        return new Response(
          JSON.stringify({ success: false, error: `Action '${action}' tidak didukung untuk multipart form.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validasi Gerbang OPREC: Blokir pengiriman berkas jika OPREC sedang ditutup
      if (!oprecStatus.isOpen) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Pendaftaran calon anggota UKM Robotika UNS sedang ditutup. Tidak diperkenankan mengirim berkas.",
            isOprec: false,
            label: oprecStatus.label,
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Proteksi Rate Limiting Khusus Aksi submit_final (Maks 5x per menit per user)
      const submitRateCheck = checkRateLimit(`${user.id}:submit_final`, 5, 60000);
      if (!submitRateCheck.allowed) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Terlalu banyak permintaan pengiriman berkas. Mohon tunggu ${submitRateCheck.retryAfterSeconds} detik sebelum mencoba kembali.`,
            retryAfter: submitRateCheck.retryAfterSeconds,
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "Retry-After": submitRateCheck.retryAfterSeconds.toString(),
            },
          }
        );
      }

      // 1. Ambil pendaftar dari tabel normalized applicants
      const { data: existingApp, error: fetchErr } = await supabaseAdmin
        .from("applicants")
        .select("*, applicant_divisions(*, divisions(*))")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchErr || !existingApp) {
        return new Response(
          JSON.stringify({ success: false, error: "Data pendaftaran tidak ditemukan. Pastikan Anda telah mengisi identitas dan pilihan divisi." }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // KETENTUAN INTEGRITAS: Pastikan Langkah 3 (Identitas) dan Langkah 4 (Divisi) sudah terisi lengkap
      const hasDivisions = existingApp.applicant_divisions && existingApp.applicant_divisions.length >= 1;
      if (!existingApp.full_name || !existingApp.nim || !hasDivisions) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Data pendaftaran belum lengkap. Anda wajib menyelesaikan Langkah 3 (Identitas) dan Langkah 4 (Pilihan Divisi) sebelum mengirim berkas final.",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // KETENTUAN IMMUTABILITY: Jika status sudah submitted, tolak kirim ulang!
      if (existingApp.status === "submitted") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Pendaftaran Anda sudah dikirim permanen dan TIDAK BISA diubah atau dikirim ulang lagi.",
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const file = formData.get("cv_file") as File | null;
      if (!file) {
        return new Response(
          JSON.stringify({ success: false, error: "Berkas CV wajib diunggah." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validasi Ukuran File (Maksimal 1 MB = 1048576 bytes)
      if (file.size > 1048576) {
        return new Response(
          JSON.stringify({ success: false, error: `Ukuran berkas CV melebihi batas 1.0 MB (terdeteksi: ${(file.size / 1048576).toFixed(2)} MB).` }),
          { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validasi Mendalam Integritas, Ekstensi & Keamanan Berkas CV (Anti Disguised .exe, Double Extension, Magic Bytes)
      const fileBuffer = await file.arrayBuffer();
      const securityCheck = validateCvFileSecurity(file, fileBuffer);
      if (!securityCheck.isValid) {
        return new Response(
          JSON.stringify({ success: false, error: securityCheck.error || "Berkas CV tidak valid atau tidak aman." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validasi Input Link Twibbon & Portofolio
      const selectedDivisions = existingApp.applicant_divisions || [];
      const hasMediaDivision = selectedDivisions.some(
        (d: { division_id?: string; divisions?: { name?: string } | null }) => {
          const id = (d.division_id || "").toLowerCase();
          const name = (d.divisions?.name || "").toLowerCase();
          return id === "media-branding" || id.includes("media") || name.includes("media");
        }
      );

      const twibbonUrl = (formData.get("twibbon_url") as string | null)?.trim() || "";
      const portfolioUrl = (formData.get("portfolio_url") as string | null)?.trim() || "";

      // Link twibbon wajib diisi oleh seluruh pendaftar
      if (!twibbonUrl) {
        return new Response(
          JSON.stringify({ success: false, error: "Link bukti upload twibbon wajib diisi oleh seluruh pendaftar." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Link portofolio hanya wajib bagi pendaftar yang memilih divisi Media
      if (hasMediaDivision && !portfolioUrl) {
        return new Response(
          JSON.stringify({ success: false, error: "Link portofolio wajib diisi bagi pendaftar yang memilih divisi Media." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const isValidWebUrl = (urlStr: string) => {
        try {
          const parsed = new URL(urlStr);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      };

      if (twibbonUrl && !isValidWebUrl(twibbonUrl)) {
        return new Response(
          JSON.stringify({ success: false, error: "Format link bukti upload twibbon tidak valid. Pastikan tautan diawali dengan https:// atau http://" }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (portfolioUrl && !isValidWebUrl(portfolioUrl)) {
        return new Response(
          JSON.stringify({ success: false, error: "Format link portofolio tidak valid. Pastikan tautan diawali dengan https:// atau http://" }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validasi Persetujuan Keabsahan Berkas CV
      const agreedTruth = formData.get("agreed_truth") === "true";
      if (!agreedTruth) {
        return new Response(
          JSON.stringify({ success: false, error: "Anda harus menyetujui pernyataan keabsahan dokumen sebelum mengirim." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Upload ke Supabase Storage Private (cv-uploads)
      const safeNim = (existingApp.nim || "NIM").replace(/[^a-zA-Z0-9]/g, "");
      const safeAngkatan = existingApp.angkatan || "2026";
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${safeAngkatan}/${safeNim}_${Date.now()}_${cleanFileName}`;

      const { error: uploadErr } = await supabaseAdmin.storage
        .from("cv-uploads")
        .upload(storagePath, fileBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadErr) {
        return new Response(
          JSON.stringify({ success: false, error: `Gagal mengunggah berkas ke storage: ${uploadErr.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Gunakan Signed URL bertempo aman untuk bucket privat (20 menit / 1.200 detik sesuai UU PDP)
      const { data: signedUrlData } = await supabaseAdmin.storage
        .from("cv-uploads")
        .createSignedUrl(storagePath, CV_SIGNED_URL_EXPIRES_IN);

      let regCode = existingApp.registration_code;
      let updatedRecord = null;
      let updateErr = null;

      // Loop pengulangan hingga 3x jika terjadi tabrakan unik pada registration_code
      for (let attempt = 0; attempt < 3; attempt++) {
        if (!regCode) {
          regCode = generateRegCode();
        }

        const res = await supabaseAdmin
          .from("applicants")
          .update({
            registration_code: regCode,
            status: "submitted",
            current_step: 6,
            cv_file_name: file.name,
            cv_storage_path: storagePath,
            twibbon_url: twibbonUrl || null,
            portfolio_url: portfolioUrl || null,
            agreed_truth: agreedTruth,
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .select("*, applicant_divisions(*, divisions(*))")
          .single();

        if (!res.error) {
          updatedRecord = formatApplicantRecord(res.data);
          if (updatedRecord && signedUrlData?.signedUrl) {
            updatedRecord.cv_file_url = signedUrlData.signedUrl;
          }
          updateErr = null;
          break;
        }

        // Jika terbentur duplicate key unik pada registration_code, buat kode baru dan ulangi
        if (
          res.error.code === "23505" &&
          (res.error.message?.includes("registration_code") || res.error.details?.includes("registration_code"))
        ) {
          regCode = "";
          updateErr = res.error;
          continue;
        }

        updateErr = res.error;
        break;
      }

      if (updateErr) {
        return new Response(
          JSON.stringify({ success: false, error: `Gagal memperbarui status pendaftaran: ${updateErr.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Pendaftaran berhasil dikirim permanen.",
          registrationCode: regCode,
          data: updatedRecord,
        }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handler untuk request JSON
    const body = await req.json();
    const { action, payload } = body;

    // Proteksi Rate Limiting Global per User (Maks 45 request per menit)
    const globalRateCheck = checkRateLimit(`global:${user.id}`, 45, 60000);
    if (!globalRateCheck.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Terlalu banyak permintaan sistem. Silakan tunggu ${globalRateCheck.retryAfterSeconds} detik sebelum mencoba lagi.`,
          retryAfter: globalRateCheck.retryAfterSeconds,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": globalRateCheck.retryAfterSeconds.toString(),
          },
        }
      );
    }

    // Proteksi Rate Limiting Spesifik per Aksi (Misal check_nim max 20x/menit)
    const limitConfig = ACTION_RATE_LIMITS[action || "unknown"];
    if (limitConfig) {
      const actionRateCheck = checkRateLimit(`${user.id}:${action}`, limitConfig.max, limitConfig.windowMs);
      if (!actionRateCheck.allowed) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Terlalu banyak permintaan ${limitConfig.label}. Silakan tunggu ${actionRateCheck.retryAfterSeconds} detik sebelum mencoba lagi.`,
            retryAfter: actionRateCheck.retryAfterSeconds,
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "Retry-After": actionRateCheck.retryAfterSeconds.toString(),
            },
          }
        );
      }
    }

    // 1. Action: get_progress
    if (action === "get_progress") {
      const { data, error } = await supabaseAdmin
        .from("applicants")
        .select("*, applicant_divisions(*, divisions(*))")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const formattedData = formatApplicantRecord(data);

      // Jika berkas CV tersimpan di storage privat, perbarui signed URL aktif (20 menit / 1.200 detik)
      if (formattedData && formattedData.cv_storage_path) {
        try {
          const { data: signedData } = await supabaseAdmin.storage
            .from("cv-uploads")
            .createSignedUrl(formattedData.cv_storage_path, CV_SIGNED_URL_EXPIRES_IN);
          if (signedData?.signedUrl) {
            formattedData.cv_file_url = signedData.signedUrl;
          }
        } catch {
          // Fallback tanpa menggagalkan pengembalian record
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: formattedData || null,
          isOprec: oprecStatus.isOpen,
          oprecLabel: oprecStatus.label,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Gerbang OPREC Server-Side: Blokir semua aksi mutasi jika OPREC ditutup
    if (!oprecStatus.isOpen) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Pendaftaran calon anggota UKM Robotika UNS sedang ditutup. Tidak diperkenankan menyimpan atau memodifikasi data.",
          isOprec: false,
          label: oprecStatus.label,
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Action: check_nim
    if (action === "check_nim") {
      const rawNim = (payload?.nim || "").trim().toUpperCase();
      if (!rawNim) {
        return new Response(
          JSON.stringify({ available: false, error: "NIM wajib diisi." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: existing } = await supabaseAdmin
        .from("applicants")
        .select("id, user_id")
        .ilike("nim", rawNim)
        .neq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({
            available: false,
            error: `NIM ${rawNim} sudah digunakan oleh pendaftar lain.`,
          }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ available: true, message: `NIM ${rawNim} tersedia.` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Action: save_step_3 (Identitas Mahasiswa)
    if (action === "save_step_3") {
      const { fullName, nim, angkatan, fakultas: inputFakultas, prodi, whatsapp } = payload || {};

      // Cek apakah user sudah punya data tersimpan sebelumnya
      const { data: existingApp } = await supabaseAdmin
        .from("applicants")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // KETENTUAN IMMUTABILITY: Jika status submitted, tolak total!
      if (existingApp?.status === "submitted") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Data pendaftaran Anda sudah berstatus terkirim (final) dan TIDAK BISA diubah lagi.",
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const trimmedName = (fullName || "").trim();
      const trimmedNim = (nim || "").trim();
      const trimmedAngkatan = (angkatan || "").trim();
      const trimmedFakultas = (inputFakultas || "").trim();
      const trimmedProdi = (prodi || "").trim();
      const sanitizedWa = sanitizePhone((whatsapp || "").trim());


      // Validasi Nama Lengkap
      if (!trimmedName) {
        return new Response(
          JSON.stringify({ success: false, field: "fullName", error: "Nama lengkap wajib diisi." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (trimmedName.length < 3) {
        return new Response(
          JSON.stringify({ success: false, field: "fullName", error: "Nama lengkap terlalu pendek (minimal 3 karakter)." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (/\d/.test(trimmedName)) {
        return new Response(
          JSON.stringify({
            success: false,
            field: "fullName",
            error: "Nama tidak valid: nama lengkap tidak boleh mengandung angka.",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (/[<>;$%\\]/.test(trimmedName)) {
        return new Response(
          JSON.stringify({
            success: false,
            field: "fullName",
            error: "Nama mengandung karakter terlarang.",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validasi Angkatan
      if (!trimmedAngkatan) {
        return new Response(
          JSON.stringify({ success: false, field: "angkatan", error: "Tahun angkatan wajib dipilih." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (trimmedAngkatan !== "2025" && trimmedAngkatan !== "2026") {
        return new Response(
          JSON.stringify({
            success: false,
            field: "angkatan",
            error: `Pendaftaran hanya dibuka untuk mahasiswa angkatan 2025 dan 2026. Angkatan '${trimmedAngkatan}' tidak memenuhi syarat.`,
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validasi NIM
      if (!trimmedNim) {
        return new Response(
          JSON.stringify({ success: false, field: "nim", error: "NIM wajib diisi." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Cek Duplikasi NIM
      const { data: nimConflict } = await supabaseAdmin
        .from("applicants")
        .select("id, user_id")
        .ilike("nim", trimmedNim)
        .neq("user_id", user.id)
        .maybeSingle();

      if (nimConflict) {
        return new Response(
          JSON.stringify({
            success: false,
            field: "nim",
            error: `NIM ${trimmedNim} sudah digunakan oleh pendaftar lain. Silakan periksa kembali NIM Anda.`,
          }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validasi Fakultas
      if (!trimmedFakultas) {
        return new Response(
          JSON.stringify({ success: false, field: "fakultas", error: "Fakultas wajib dipilih." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validasi Prodi & WA
      if (!trimmedProdi || trimmedProdi.length < 3) {
        return new Response(
          JSON.stringify({ success: false, field: "prodi", error: "Program studi wajib diisi (minimal 3 karakter)." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!/^08[0-9]{8,18}$/.test(sanitizedWa)) {
        return new Response(
          JSON.stringify({
            success: false,
            field: "whatsapp",
            error: "Nomor WhatsApp tidak valid: gunakan nomor seluler Indonesia yang diawali 08 (10-20 digit).",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const firstLetter = trimmedNim ? trimmedNim.charAt(0).toUpperCase() : "";
      const fakultas = trimmedFakultas || (firstLetter && NIM_FACULTY_MAP[firstLetter]) || "-";

      // Simpan Permanen (UPSERT ke tabel applicants)
      const { data: savedRecord, error: upsertErr } = await supabaseAdmin
        .from("applicants")
        .upsert(
          {
            user_id: user.id,
            user_email: user.email || "",
            full_name: trimmedName,
            nim: trimmedNim,
            fakultas,
            prodi: trimmedProdi,
            angkatan: trimmedAngkatan,
            whatsapp: sanitizedWa,
            current_step: Math.max(existingApp?.current_step || 1, 3),
            status: "draft",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )
        .select("*, applicant_divisions(*, divisions(*))")
        .single();

      if (upsertErr) {
        const errStr = upsertErr.message || "";
        if (upsertErr.code === "23505" || errStr.includes("idx_applicants_nim") || errStr.includes("idx_registrations_nim")) {
          return new Response(
            JSON.stringify({
              success: false,
              field: "nim",
              error: `NIM ${trimmedNim} sudah digunakan oleh pendaftar lain. Silakan periksa kembali NIM Anda.`,
            }),
            { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (errStr.includes("chk_nim_format")) {
          return new Response(
            JSON.stringify({
              success: false,
              field: "nim",
              error: `Format NIM tidak valid. Pastikan NIM diawali kode fakultas resmi UNS dan memiliki 7-12 karakter.`,
            }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (errStr.includes("chk_whatsapp_format") || errStr.includes("applicants_whatsapp_check")) {
          return new Response(
            JSON.stringify({
              success: false,
              field: "whatsapp",
              error: `Nomor WhatsApp tidak valid. Format harus diawali 08 dengan 10-20 digit angka.`,
            }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        return new Response(
          JSON.stringify({ success: false, error: `Gagal menyimpan identitas: ${upsertErr.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Data identitas berhasil disimpan.",
          data: formatApplicantRecord(savedRecord),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Action: save_step_4 (Pilihan Divisi ke tabel normalisasi applicant_divisions)
    if (action === "save_step_4") {
      const {
        primaryDivisionId,
        primaryReason,
        secondaryDivisionId,
        secondaryReason,
      } = payload || {};

      const { data: existingApp } = await supabaseAdmin
        .from("applicants")
        .select("*, applicant_divisions(*, divisions(*))")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existingApp) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Data identitas belum ditemukan. Silakan selesaikan Langkah 3 (Identitas) terlebih dahulu.",
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // KETENTUAN IMMUTABILITY: Jika status submitted, tolak total!
      if (existingApp?.status === "submitted") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Data pendaftaran Anda sudah berstatus terkirim (final) dan TIDAK BISA diubah lagi.",
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!primaryDivisionId || !VALID_DIVISIONS.includes(primaryDivisionId)) {
        return new Response(
          JSON.stringify({ success: false, field: "primaryDivision", error: "Pilihan divisi pertama tidak valid." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!secondaryDivisionId || !VALID_DIVISIONS.includes(secondaryDivisionId)) {
        return new Response(
          JSON.stringify({ success: false, field: "secondaryDivision", error: "Pilihan divisi kedua tidak valid." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (primaryDivisionId === secondaryDivisionId) {
        return new Response(
          JSON.stringify({
            success: false,
            field: "secondaryDivision",
            error: "Divisi pilihan 1 dan pilihan 2 tidak boleh sama.",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const pReason = (primaryReason || "").trim();
      const sReason = (secondaryReason || "").trim();
      if (!pReason || pReason.length < 15) {
        return new Response(
          JSON.stringify({ success: false, field: "primaryReason", error: "Alasan memilih pilihan 1 wajib diisi (minimal 15 karakter)." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!sReason || sReason.length < 15) {
        return new Response(
          JSON.stringify({ success: false, field: "secondaryReason", error: "Alasan memilih pilihan 2 wajib diisi (minimal 15 karakter)." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Hapus data pilihan divisi lama (jika ada draft sebelumnya) lalu masukkan pilihan baru
      const { error: deleteDivErr } = await supabaseAdmin
        .from("applicant_divisions")
        .delete()
        .eq("applicant_id", existingApp.id);

      if (deleteDivErr) {
        return new Response(
          JSON.stringify({ success: false, error: `Gagal memperbarui relasi pilihan divisi: ${deleteDivErr.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error: insertDivErr } = await supabaseAdmin
        .from("applicant_divisions")
        .insert([
          {
            applicant_id: existingApp.id,
            division_id: primaryDivisionId,
            priority: 1,
            reason: pReason,
          },
          {
            applicant_id: existingApp.id,
            division_id: secondaryDivisionId,
            priority: 2,
            reason: sReason,
          },
        ]);

      if (insertDivErr) {
        return new Response(
          JSON.stringify({ success: false, error: `Gagal menyimpan relasi pilihan divisi: ${insertDivErr.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update current_step pendaftar menjadi 4
      const { data: updatedApp, error: updateErr } = await supabaseAdmin
        .from("applicants")
        .update({
          current_step: Math.max(existingApp?.current_step || 1, 4),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select("*, applicant_divisions(*, divisions(*))")
        .single();

      if (updateErr) {
        return new Response(
          JSON.stringify({ success: false, error: `Gagal memperbarui status pendaftar: ${updateErr.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Pilihan divisi berhasil disimpan.",
          data: formatApplicantRecord(updatedApp),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: `Action '${action}' tidak dikenali.` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal server.";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
