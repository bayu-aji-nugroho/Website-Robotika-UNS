import { RegistrationPayload, SupabaseRegistrationRecord } from "./registration.types";

export const MOCK_REGISTRATION_PAYLOADS: RegistrationPayload[] = [
  {
    registrationCode: "ROB-UNS-2026-1042",
    applicant: {
      fullName: "Dimas Arya Prasetya",
      nim: "I0724018",
      prodi: "S1 Teknik Elektro",
      angkatan: "2024",
      whatsapp: "081234567891",
    },
    divisions: {
      primary: {
        id: "werkudara-pemrograman",
        name: "Werkudara - Pemrograman",
        category: "teknis",
        reason:
          "Memiliki pengalaman mikrokontroler STM32 dan FreeRTOS pada proyek tugas akhir SMA. Tertarik mendalami kontrol PID dan protokol CAN Bus untuk robot KRAI.",
      },
      secondary: {
        id: "werkudara-elektronika",
        name: "Werkudara - Elektronika",
        category: "teknis",
        reason:
          "Pernah merancang skematik catu daya switching dan berminat menguasai desain custom PCB high-power motor driver.",
      },
    },
    cvFileMetadata: {
      fileName: "CV_Dimas_Arya_Prasetya_TeknikElektro24.pdf",
      fileSizeBytes: 624500,
      fileSizeFormatted: "610 KB",
    },
    consents: {
      agreedToRequirements: true,
      agreedToCvTruth: true,
    },
    metadata: {
      submittedAt: "2026-10-18T08:15:30.000Z",
      source: "web_registration_portal",
    },
  },

];

export const MOCK_SUPABASE_RECORDS: SupabaseRegistrationRecord[] =
  MOCK_REGISTRATION_PAYLOADS.map((payload, index) => ({
    id: `00000000-0000-0000-0000-00000000000${index + 1}`,
    registration_code: payload.registrationCode,
    full_name: payload.applicant.fullName,
    nim: payload.applicant.nim,
    prodi: payload.applicant.prodi,
    angkatan: payload.applicant.angkatan,
    whatsapp: payload.applicant.whatsapp,
    primary_division_id: payload.divisions.primary.id,
    primary_division_name: payload.divisions.primary.name,
    primary_division_category: payload.divisions.primary.category,
    primary_reason: payload.divisions.primary.reason,
    secondary_division_id: payload.divisions.secondary.id,
    secondary_division_name: payload.divisions.secondary.name,
    secondary_division_category: payload.divisions.secondary.category,
    secondary_reason: payload.divisions.secondary.reason,
    cv_file_name: payload.cvFileMetadata.fileName,
    cv_file_size_bytes: payload.cvFileMetadata.fileSizeBytes,
    cv_file_url: `https://xyzproject.supabase.co/storage/v1/object/public/cv-resumes/2026/${payload.applicant.nim}_${payload.cvFileMetadata.fileName}`,
    cv_storage_path: `cv-resumes/2026/${payload.applicant.nim}_${payload.cvFileMetadata.fileName}`,
    agreed_requirements: payload.consents.agreedToRequirements,
    agreed_truth: payload.consents.agreedToCvTruth,
    created_at: payload.metadata.submittedAt,
    updated_at: payload.metadata.submittedAt,
  }));
