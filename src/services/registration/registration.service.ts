import { allRegistrationDivisions } from "@/data/registration";
import {
  RegistrationFormInput,
  RegistrationPayload,
  RegistrationApiResponse,
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
  P: "Fakultas Psikologi"
};


export function getFacultyFromNim(nim?: string | null): string {
  if (!nim) return "-";
  const trimmed = nim.trim().toUpperCase();
  if (!trimmed) return "-";
  const firstLetter = trimmed.charAt(0);
  return NIM_FACULTY_MAP[firstLetter] || "-";
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
  const payload = buildRegistrationPayload(input);
  const formData = createRegistrationFormData(input, payload);

  const apiEndpoint =
    process.env.NEXT_PUBLIC_REGISTRATION_API_URL || "/api/register";

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: result.message || "Pendaftaran berhasil.",
        registrationCode: result.registrationCode || payload.registrationCode,
        data: payload,
      };
    }

    if (response.status !== 404) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.error || `Server responded with ${response.status}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
    } else {
      console.warn("Backend API not reachable, falling back to local receipt handler:", error);
    }
  }

  try {
    const stored = localStorage.getItem("robotika_uns_registrations");
    const list = stored ? JSON.parse(stored) : [];
    list.push(payload);
    localStorage.setItem("robotika_uns_registrations", JSON.stringify(list));
  } catch {
    // Local storage safe failover
  }

  return {
    success: true,
    message: "Data pendaftaran berhasil diproses dan tersimpan langsung.",
    registrationCode: payload.registrationCode,
    data: payload,
  };
}
