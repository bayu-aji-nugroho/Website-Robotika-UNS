/*
-----------------------------------------
nama file: [ registration.service.ts ] 
fungsi [ Layanan pendaftaran calon anggota Robotika UNS yang terintegrasi dengan Supabase Edge Function untuk penyimpanan permanen multi-tahap, pengecekan keunikan NIM, dan validasi Zero Trust ]
-----------------------------------------------
*/

import { allRegistrationDivisions } from "@/data/registration";
import { supabase, GoogleAuthUser } from "../supabase/supabaseClient";
import {
  RegistrationFormInput,
  RegistrationPayload,
  RegistrationApiResponse,
  Step3IdentityInput,
  Step4DivisionInput,
  SaveStepResult,
  NimCheckResult,
  RegistrationProgressData,
  SupabaseRegistrationRecord,
} from "./registration.types";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function sanitizePhoneNumber(phone: string): string {
  const cleaned = phone.trim().replace(/[-\s]/g, "");
  if (cleaned.startsWith("+62")) {
    return "0" + cleaned.slice(3);
  }
  if (cleaned.startsWith("62")) {
    return "0" + cleaned.slice(2);
  }
  return cleaned;
}

export function generateRegistrationCode(prefix = "ROB-UNS-2026"): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomSuffix}`;
}

export const NIM_FACULTY_MAP: Record<string, string> = {
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

export function getFacultyFromNim(nim?: string | null): string {
  if (!nim) return "-";
  const trimmed = nim.trim().toUpperCase();
  if (!trimmed) return "-";
  const firstLetter = trimmed.charAt(0);
  return NIM_FACULTY_MAP[firstLetter] || "-";
}

/**
 * Mengambil progress pendaftaran dari Supabase Edge Function untuk auto-restore
 */
export async function getRegistrationProgress(): Promise<RegistrationProgressData> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      // Cek apakah ada mock user di localStorage untuk keperluan development
      if (typeof window !== "undefined") {
        const storedMock = localStorage.getItem("robotika_uns_mock_auth_user");
        if (storedMock) {
          const localDraft = localStorage.getItem("robotika_uns_mock_draft");
          if (localDraft) {
            const parsed = JSON.parse(localDraft);
            return {
              hasRecord: true,
              status: parsed.status || "draft",
              currentStep: parsed.current_step || 3,
              record: parsed,
            };
          }
        }
      }
      return { hasRecord: false, status: "none", currentStep: 1 };
    }

    const { data, error } = await supabase.functions.invoke("registration-step", {
      body: { action: "get_progress" },
    });

    if (error) {
      console.warn("Gagal mengambil progress dari Edge Function:", error);
      return { hasRecord: false, status: "none", currentStep: 1 };
    }

    if (data?.success && data?.data) {
      const record = data.data as SupabaseRegistrationRecord;
      return {
        hasRecord: true,
        status: record.status || "draft",
        currentStep: record.current_step || 3,
        record,
      };
    }

    return { hasRecord: false, status: "none", currentStep: 1 };
  } catch (err) {
    console.warn("Exception getRegistrationProgress:", err);
    return { hasRecord: false, status: "none", currentStep: 1 };
  }
}

/**
 * Cek ketersediaan NIM secara real-time ke Supabase Edge Function
 */
export async function checkNimAvailability(nim: string): Promise<NimCheckResult> {
  const trimmed = nim.trim().toUpperCase();
  if (!trimmed) {
    return { available: false, error: "NIM wajib diisi" };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { available: true };
    }

    const { data, error } = await supabase.functions.invoke("registration-step", {
      body: { action: "check_nim", payload: { nim: trimmed } },
    });

    if (error) {
      const errContext = (error as unknown as { context?: { json?: () => Promise<{ error?: string }> } }).context;
      if (errContext && typeof errContext.json === "function") {
        const body = await errContext.json().catch(() => null);
        if (body?.error) {
          return { available: false, error: body.error };
        }
      }
      return { available: false, error: error.message || "Gagal memeriksa NIM." };
    }

    if (data?.available === false) {
      return { available: false, error: data.error || `NIM ${trimmed} sudah digunakan.` };
    }

    return { available: true, message: data?.message || "NIM tersedia." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memeriksa NIM.";
    return { available: false, error: message };
  }
}

/**
 * Menyimpan permanen data Step 3 (Identitas Mahasiswa) ke Supabase Edge Function
 */
export async function savePermanentStep3(input: Step3IdentityInput): Promise<SaveStepResult> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Mock mode fallback untuk dev lokal jika login Supabase belum disetup
      if (typeof window !== "undefined") {
        const mockDraft: SupabaseRegistrationRecord = {
          full_name: input.fullName,
          nim: input.nim,
          fakultas: getFacultyFromNim(input.nim),
          prodi: input.prodi,
          angkatan: input.angkatan,
          whatsapp: sanitizePhoneNumber(input.whatsapp),
          status: "draft",
          current_step: 3,
        };
        localStorage.setItem("robotika_uns_mock_draft", JSON.stringify(mockDraft));
        return { success: true, message: "Data tersimpan di penyimpanan lokal (Mock Mode).", data: mockDraft };
      }
      return { success: false, error: "Sesi login tidak ditemukan. Silakan login Google terlebih dahulu." };
    }

    const { data, error } = await supabase.functions.invoke("registration-step", {
      body: { action: "save_step_3", payload: input },
    });

    if (error) {
      let errorMsg = error.message;
      let field: string | undefined = undefined;

      const errContext = (error as unknown as { context?: { json?: () => Promise<{ error?: string; field?: string }> } }).context;
      if (errContext && typeof errContext.json === "function") {
        const body = await errContext.json().catch(() => null);
        if (body?.error) errorMsg = body.error;
        if (body?.field) field = body.field;
      }

      return {
        success: false,
        field,
        error: errorMsg,
      };
    }

    if (!data?.success) {
      return {
        success: false,
        field: data?.field,
        error: data?.error || "Gagal menyimpan data identitas.",
      };
    }

    return {
      success: true,
      message: data.message || "Data identitas berhasil disimpan permanen.",
      data: data.data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan identitas.";
    return { success: false, error: msg };
  }
}

/**
 * Menyimpan permanen data Step 4 (Pilihan Divisi) ke Supabase Edge Function
 */
export async function savePermanentStep4(input: Step4DivisionInput): Promise<SaveStepResult> {
  try {
    const primaryDivItem = allRegistrationDivisions.find(
      (item) => item.id === input.primaryDivisionId
    );
    const secondaryDivItem = allRegistrationDivisions.find(
      (item) => item.id === input.secondaryDivisionId
    );

    const payload = {
      primaryDivisionId: input.primaryDivisionId,
      primaryDivisionName: primaryDivItem ? primaryDivItem.name : input.primaryDivisionId,
      primaryDivisionCategory: input.categoryMode1,
      primaryReason: input.primaryReason,
      secondaryDivisionId: input.secondaryDivisionId,
      secondaryDivisionName: secondaryDivItem ? secondaryDivItem.name : input.secondaryDivisionId,
      secondaryDivisionCategory: input.categoryMode2,
      secondaryReason: input.secondaryReason,
    };

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Mock mode fallback
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("robotika_uns_mock_draft");
        const prev = local ? JSON.parse(local) : {};
        const updated = {
          ...prev,
          primary_division_id: payload.primaryDivisionId,
          primary_division_name: payload.primaryDivisionName,
          primary_division_category: payload.primaryDivisionCategory,
          primary_reason: payload.primaryReason,
          secondary_division_id: payload.secondaryDivisionId,
          secondary_division_name: payload.secondaryDivisionName,
          secondary_division_category: payload.secondaryDivisionCategory,
          secondary_reason: payload.secondaryReason,
          status: "draft",
          current_step: 4,
        };
        localStorage.setItem("robotika_uns_mock_draft", JSON.stringify(updated));
        return { success: true, message: "Pilihan divisi tersimpan (Mock Mode).", data: updated };
      }
      return { success: false, error: "Sesi tidak ditemukan." };
    }

    const { data, error } = await supabase.functions.invoke("registration-step", {
      body: { action: "save_step_4", payload },
    });

    if (error) {
      let errorMsg = error.message;
      let field: string | undefined = undefined;

      const errContext = (error as unknown as { context?: { json?: () => Promise<{ error?: string; field?: string }> } }).context;
      if (errContext && typeof errContext.json === "function") {
        const body = await errContext.json().catch(() => null);
        if (body?.error) errorMsg = body.error;
        if (body?.field) field = body.field;
      }

      return { success: false, field, error: errorMsg };
    }

    if (!data?.success) {
      return {
        success: false,
        field: data?.field,
        error: data?.error || "Gagal menyimpan pilihan divisi.",
      };
    }

    return {
      success: true,
      message: data.message || "Pilihan divisi berhasil disimpan permanen.",
      data: data.data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan divisi.";
    return { success: false, error: msg };
  }
}

/**
 * Submit final pendaftaran beserta file berkas CV ke Supabase Edge Function
 */
export async function submitFinalRegistrationWithFile(
  input: RegistrationFormInput
): Promise<RegistrationApiResponse> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!input.cvFile) {
      return { success: false, message: "Berkas CV wajib diunggah.", error: "Berkas CV belum dipilih." };
    }

    const formData = new FormData();
    formData.append("action", "submit_final");
    formData.append("cv_file", input.cvFile, input.cvFile.name);
    formData.append("agreed_requirements", String(Boolean(input.agreedToRequirements)));
    formData.append("agreed_truth", String(Boolean(input.agreedToCvTruth)));

    if (!session) {
      // Mock mode fallback
      const regCode = generateRegistrationCode();
      const payload = buildRegistrationPayload(input);
      payload.registrationCode = regCode;

      if (typeof window !== "undefined") {
        localStorage.setItem("robotika_uns_mock_draft", JSON.stringify({
          ...payload,
          status: "submitted",
          current_step: 6,
          registration_code: regCode,
        }));
      }

      return {
        success: true,
        message: "Pendaftaran berhasil dikirim (Mock Mode).",
        registrationCode: regCode,
        data: {
          status: "submitted",
          current_step: 6,
          full_name: input.fullName,
          nim: input.nim,
          prodi: input.prodi,
          angkatan: input.angkatan,
          whatsapp: input.whatsapp,
          primary_division_id: input.primaryDivisionId,
          primary_division_category: input.categoryMode1,
          primary_reason: input.primaryReason,
          secondary_division_id: input.secondaryDivisionId,
          secondary_division_category: input.categoryMode2,
          secondary_reason: input.secondaryReason,
          registration_code: regCode,
          agreed_requirements: input.agreedToRequirements,
          agreed_truth: input.agreedToCvTruth,
        } as SupabaseRegistrationRecord,
      };
    }

    const { data, error } = await supabase.functions.invoke("registration-step", {
      body: formData,
    });

    if (error) {
      let errorMsg = error.message;
      const errContext = (error as unknown as { context?: { json?: () => Promise<{ error?: string }> } }).context;
      if (errContext && typeof errContext.json === "function") {
        const body = await errContext.json().catch(() => null);
        if (body?.error) errorMsg = body.error;
      }
      return { success: false, message: errorMsg, error: errorMsg };
    }

    if (!data?.success) {
      return {
        success: false,
        message: data?.error || "Gagal mengirim pendaftaran.",
        error: data?.error,
      };
    }

    return {
      success: true,
      message: data.message || "Pendaftaran berhasil dikirim.",
      registrationCode: data.registrationCode,
      data: data.data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat submit.";
    return { success: false, message: msg, error: msg };
  }
}

export function buildRegistrationPayload(
  input: RegistrationFormInput
): RegistrationPayload {
  const primaryDivItem = allRegistrationDivisions.find(
    (item) => item.id === input.primaryDivisionId
  );
  const secondaryDivItem = allRegistrationDivisions.find(
    (item) => item.id === input.secondaryDivisionId
  );

  const registrationCode = generateRegistrationCode();
  const file = input.cvFile;

  return {
    registrationCode,
    applicant: {
      fullName: input.fullName.trim(),
      nim: input.nim.trim().toUpperCase(),
      fakultas: getFacultyFromNim(input.nim),
      prodi: input.prodi.trim(),
      angkatan: input.angkatan.trim(),
      whatsapp: sanitizePhoneNumber(input.whatsapp),
    },
    divisions: {
      primary: {
        id: input.primaryDivisionId,
        name: primaryDivItem ? primaryDivItem.name : input.primaryDivisionId,
        category: input.categoryMode1,
        reason: input.primaryReason.trim(),
      },
      secondary: {
        id: input.secondaryDivisionId,
        name: secondaryDivItem
          ? secondaryDivItem.name
          : input.secondaryDivisionId,
        category: input.categoryMode2,
        reason: input.secondaryReason.trim(),
      },
    },
    cvFileMetadata: {
      fileName: file ? file.name : "cv.pdf",
      fileSizeBytes: file ? file.size : 0,
      fileSizeFormatted: file ? formatFileSize(file.size) : "0 KB",
    },
    consents: {
      agreedToRequirements: Boolean(input.agreedToRequirements),
      agreedToCvTruth: Boolean(input.agreedToCvTruth),
    },
    metadata: {
      submittedAt: new Date().toISOString(),
      source: "web_registration_portal",
    },
  };
}

export function createRegistrationFormData(
  input: RegistrationFormInput,
  payload?: RegistrationPayload
): FormData {
  const structuredPayload = payload ?? buildRegistrationPayload(input);
  const formData = new FormData();

  formData.append("registration_code", structuredPayload.registrationCode);
  formData.append("full_name", structuredPayload.applicant.fullName);
  formData.append("nim", structuredPayload.applicant.nim);
  formData.append(
    "fakultas",
    structuredPayload.applicant.fakultas || getFacultyFromNim(structuredPayload.applicant.nim)
  );
  formData.append("prodi", structuredPayload.applicant.prodi);
  formData.append("angkatan", structuredPayload.applicant.angkatan);
  formData.append("whatsapp", structuredPayload.applicant.whatsapp);
  formData.append("primary_division_id", structuredPayload.divisions.primary.id);
  formData.append("primary_division_name", structuredPayload.divisions.primary.name);
  formData.append("primary_division_category", structuredPayload.divisions.primary.category);
  formData.append("primary_reason", structuredPayload.divisions.primary.reason);
  formData.append("secondary_division_id", structuredPayload.divisions.secondary.id);
  formData.append("secondary_division_name", structuredPayload.divisions.secondary.name);
  formData.append("secondary_division_category", structuredPayload.divisions.secondary.category);
  formData.append("secondary_reason", structuredPayload.divisions.secondary.reason);
  formData.append("agreed_requirements", String(structuredPayload.consents.agreedToRequirements));
  formData.append("agreed_truth", String(structuredPayload.consents.agreedToCvTruth));
  formData.append("submitted_at", structuredPayload.metadata.submittedAt);
  formData.append("payload_json", JSON.stringify(structuredPayload));

  if (input.cvFile) {
    formData.append("cv_file", input.cvFile, input.cvFile.name);
  }

  return formData;
}

export async function submitRegistration(
  input: RegistrationFormInput
): Promise<RegistrationApiResponse> {
  return await submitFinalRegistrationWithFile(input);
}
