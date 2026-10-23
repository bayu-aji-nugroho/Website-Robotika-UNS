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

      // 1. Ambil pendaftaran user saat ini
      const { data: existingReg, error: fetchErr } = await supabaseAdmin
        .from("registrations")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchErr || !existingReg) {
        return new Response(
          JSON.stringify({ success: false, error: "Data pendaftaran tidak ditemukan. Pastikan Anda telah mengisi identitas dan pilihan divisi." }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // KETENTUAN INTEGRITAS: Pastikan Langkah 3 (Identitas) dan Langkah 4 (Divisi) sudah terisi lengkap
      if (!existingReg.full_name || !existingReg.nim || !existingReg.primary_division_id) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Data pendaftaran belum lengkap. Anda wajib menyelesaikan Langkah 3 (Identitas) dan Langkah 4 (Pilihan Divisi) sebelum mengirim berkas final.",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // KETENTUAN IMMUTABILITY: Jika status sudah submitted, tolak kirim ulang!
      if (existingReg.status === "submitted") {
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

      // Validasi Ekstensi File
      const lowerName = file.name.toLowerCase();
      if (!lowerName.endsWith(".pdf")) {
        return new Response(
          JSON.stringify({ success: false, error: "Format berkas tidak didukung. Berkas CV wajib dalam format PDF (.pdf)." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validasi Magic Byte (%PDF- = 0x25 0x50 0x44 0x46)
      const fileBuffer = await file.arrayBuffer();
      const headerBytes = new Uint8Array(fileBuffer.slice(0, 4));
      const isPdfMagic =
        headerBytes[0] === 0x25 &&
        headerBytes[1] === 0x50 &&
        headerBytes[2] === 0x44 &&
        headerBytes[3] === 0x46;

      if (!isPdfMagic) {
        return new Response(
          JSON.stringify({ success: false, error: "Integritas berkas gagal: Berkas bukan dokumen PDF yang valid." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validasi Persetujuan
      const agreedRequirements = formData.get("agreed_requirements") === "true";
      const agreedTruth = formData.get("agreed_truth") === "true";
      if (!agreedTruth) {
        return new Response(
          JSON.stringify({ success: false, error: "Anda harus menyetujui pernyataan keabsahan dokumen sebelum mengirim." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Upload ke Supabase Storage Private (cv-uploads)
      const safeNim = (existingReg.nim || "NIM").replace(/[^a-zA-Z0-9]/g, "");
      const safeAngkatan = existingReg.angkatan || "2026";
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

      let regCode = existingReg.registration_code;
      let updatedRecord = null;
      let updateErr = null;

      // Loop pengulangan hingga 3x jika terjadi tabrakan unik pada registration_code
      for (let attempt = 0; attempt < 3; attempt++) {
        if (!regCode) {
          regCode = generateRegCode();
        }

        const res = await supabaseAdmin
          .from("registrations")
          .update({
            registration_code: regCode,
            status: "submitted",
            current_step: 6,
            cv_file_name: file.name,
            cv_file_size_bytes: file.size,
            cv_storage_path: storagePath,
            cv_file_url: signedUrlData?.signedUrl || "",
            agreed_requirements: agreedRequirements,
            agreed_truth: agreedTruth,
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .select()
          .single();

        if (!res.error) {
          updatedRecord = res.data;
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
            available: false,
            error: `Terlalu banyak permintaan ${limitConfig.label}. Silakan tunggu ${actionRateCheck.retryAfterSeconds} detik sebelum mencoba kembali.`,
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
        .from("registrations")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Jika berkas CV tersimpan di storage privat, perbarui signed URL aktif (20 menit / 1.200 detik)
      if (data && data.cv_storage_path) {
        try {
          const { data: signedData } = await supabaseAdmin.storage
            .from("cv-uploads")
            .createSignedUrl(data.cv_storage_path, CV_SIGNED_URL_EXPIRES_IN);
          if (signedData?.signedUrl) {
            data.cv_file_url = signedData.signedUrl;
          }
        } catch {
          // Fallback tanpa menggagalkan pengembalian record
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: data || null,
          isOprec: oprecStatus.isOpen,
          oprecLabel: oprecStatus.label,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Gerbang OPREC Server-Side: Blokir semua aksi mutasi (NIM check, save step 3, save step 4) jika OPREC ditutup
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
        .from("registrations")
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
      const { fullName, nim, angkatan, prodi, whatsapp } = payload || {};

      // Cek apakah user sudah punya data tersimpan sebelumnya
      const { data: existingReg } = await supabaseAdmin
        .from("registrations")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // KETENTUAN IMMUTABILITY: Jika status submitted, tolak total!
      if (existingReg?.status === "submitted") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Data pendaftaran Anda sudah berstatus terkirim (final) dan TIDAK BISA diubah lagi.",
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const trimmedName = (fullName || "").trim();
      const trimmedNim = (nim || "").trim().toUpperCase();
      const trimmedAngkatan = (angkatan || "").trim();
      const trimmedProdi = (prodi || "").trim();
      const sanitizedWa = sanitizePhone((whatsapp || "").trim());

      // KETENTUAN IMMUTABILITY: Jika identitas sudah pernah disimpan, tolak jika ada perubahan!
      if (existingReg?.full_name && existingReg?.nim) {
        const isAltered =
          existingReg.full_name !== trimmedName ||
          existingReg.nim !== trimmedNim ||
          existingReg.angkatan !== trimmedAngkatan ||
          existingReg.prodi !== trimmedProdi;

        if (isAltered) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Data identitas sudah tersimpan secara permanen dan TIDAK BISA diubah lagi.",
            }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Jika data sama persis, kembalikan data yang ada tanpa modifikasi
        return new Response(
          JSON.stringify({
            success: true,
            message: "Data identitas sudah tersimpan permanen (Terkunci).",
            data: existingReg,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

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
      if (trimmedNim.length < 7 || trimmedNim.length > 12) {
        return new Response(
          JSON.stringify({
            success: false,
            field: "nim",
            error: "Format NIM tidak valid: panjang harus antara 7 hingga 12 karakter.",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const firstLetter = trimmedNim.charAt(0);
      if (!VALID_FACULTY_CODES.includes(firstLetter)) {
        return new Response(
          JSON.stringify({
            success: false,
            field: "nim",
            error: `Format NIM tidak valid: inisial '${firstLetter}' bukan kode fakultas resmi UNS (contoh valid: I0724018).`,
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!/^[A-Z0-9]+$/.test(trimmedNim)) {
        return new Response(
          JSON.stringify({
            success: false,
            field: "nim",
            error: "NIM hanya boleh berisi kombinasi huruf kapital dan angka.",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Cek Duplikasi NIM
      const { data: nimConflict } = await supabaseAdmin
        .from("registrations")
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

      // Validasi Prodi & WA
      if (!trimmedProdi || trimmedProdi.length < 3) {
        return new Response(
          JSON.stringify({ success: false, field: "prodi", error: "Program studi wajib diisi (minimal 3 karakter)." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!/^08[0-9]{8,13}$/.test(sanitizedWa)) {
        return new Response(
          JSON.stringify({
            success: false,
            field: "whatsapp",
            error: "Nomor WhatsApp tidak valid: gunakan nomor seluler Indonesia yang diawali 08 (10-15 digit).",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const fakultas = NIM_FACULTY_MAP[firstLetter] || "-";

      // Simpan Permanen (UPSERT)
      const { data: savedRecord, error: upsertErr } = await supabaseAdmin
        .from("registrations")
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
            current_step: 3,
            status: "draft",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )
        .select()
        .single();

      if (upsertErr) {
        const errStr = upsertErr.message || "";
        if (upsertErr.code === "23505" || errStr.includes("idx_registrations_nim")) {
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
        if (errStr.includes("chk_whatsapp_format")) {
          return new Response(
            JSON.stringify({
              success: false,
              field: "whatsapp",
              error: `Nomor WhatsApp tidak valid. Format harus diawali 08 dengan 10-15 digit angka.`,
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
          message: "Data identitas berhasil disimpan permanen.",
          data: savedRecord,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Action: save_step_4 (Pilihan Divisi)
    if (action === "save_step_4") {
      const {
        primaryDivisionId,
        primaryDivisionName,
        primaryDivisionCategory,
        primaryReason,
        secondaryDivisionId,
        secondaryDivisionName,
        secondaryDivisionCategory,
        secondaryReason,
      } = payload || {};

      const { data: existingReg } = await supabaseAdmin
        .from("registrations")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // KETENTUAN IMMUTABILITY: Jika status submitted, tolak total!
      if (existingReg?.status === "submitted") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Data pendaftaran Anda sudah berstatus terkirim (final) dan TIDAK BISA diubah lagi.",
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // KETENTUAN IMMUTABILITY: Jika divisi sudah pernah disimpan, tolak jika ada perubahan!
      if (existingReg?.primary_division_id && existingReg?.secondary_division_id) {
        const isAltered =
          existingReg.primary_division_id !== primaryDivisionId ||
          existingReg.secondary_division_id !== secondaryDivisionId;

        if (isAltered) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Pilihan divisi sudah disimpan secara permanen dan TIDAK BISA diubah lagi.",
            }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: "Pilihan divisi sudah tersimpan permanen (Terkunci).",
            data: existingReg,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

      const { data: updatedRecord, error: updateErr } = await supabaseAdmin
        .from("registrations")
        .update({
          primary_division_id: primaryDivisionId,
          primary_division_name: primaryDivisionName || primaryDivisionId,
          primary_division_category: primaryDivisionCategory || "teknis",
          primary_reason: pReason,
          secondary_division_id: secondaryDivisionId,
          secondary_division_name: secondaryDivisionName || secondaryDivisionId,
          secondary_division_category: secondaryDivisionCategory || "teknis",
          secondary_reason: sReason,
          current_step: 4,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateErr) {
        return new Response(
          JSON.stringify({ success: false, error: `Gagal menyimpan pilihan divisi: ${updateErr.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Pilihan divisi berhasil disimpan permanen.",
          data: updatedRecord,
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
