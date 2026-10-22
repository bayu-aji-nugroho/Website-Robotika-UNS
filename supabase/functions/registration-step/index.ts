import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

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
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${suffix}`;
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

      // Upload ke Supabase Storage (cv-uploads)
      const safeNim = (existingReg.nim || "NIM").replace(/[^a-zA-Z0-9]/g, "");
      const safeAngkatan = existingReg.angkatan || "2026";
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${safeAngkatan}/${safeNim}_${Date.now()}_${cleanFileName}`;

      const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
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

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("cv-uploads")
        .getPublicUrl(storagePath);

      const regCode = existingReg.registration_code || generateRegCode();

      const { data: updatedRecord, error: updateErr } = await supabaseAdmin
        .from("registrations")
        .update({
          registration_code: regCode,
          status: "submitted",
          current_step: 6,
          cv_file_name: file.name,
          cv_file_size_bytes: file.size,
          cv_storage_path: storagePath,
          cv_file_url: publicUrlData.publicUrl,
          agreed_requirements: agreedRequirements,
          agreed_truth: agreedTruth,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

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

      return new Response(
        JSON.stringify({ success: true, data: data || null }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
