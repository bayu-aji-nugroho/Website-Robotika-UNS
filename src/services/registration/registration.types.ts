export type DivisionSelectionCategory = "teknis" | "non-teknis";

export interface RegistrationFormInput {
  fullName: string;
  nim: string;
  prodi: string;
  angkatan: string;
  whatsapp: string;
  categoryMode1: DivisionSelectionCategory;
  primaryDivisionId: string;
  primaryReason: string;
  categoryMode2: DivisionSelectionCategory;
  secondaryDivisionId: string;
  secondaryReason: string;
  cvFile?: File | null;
  agreedToRequirements: boolean;
  agreedToCvTruth: boolean;
}

export interface RegistrationPayload {
  registrationCode: string;
  applicant: {
    fullName: string;
    nim: string;
    fakultas?: string;
    prodi: string;
    angkatan: string;
    whatsapp: string;
  };
  divisions: {
    primary: {
      id: string;
      name: string;
      category: DivisionSelectionCategory;
      reason: string;
    };
    secondary: {
      id: string;
      name: string;
      category: DivisionSelectionCategory;
      reason: string;
    };
  };
  cvFileMetadata: {
    fileName: string;
    fileSizeBytes: number;
    fileSizeFormatted: string;
  };
  consents: {
    agreedToRequirements: boolean;
    agreedToCvTruth: boolean;
  };
  metadata: {
    submittedAt: string;
    source: string;
  };
}

export interface SupabaseRegistrationRecord {
  id?: string;
  registration_code: string;
  full_name: string;
  nim: string;
  prodi: string;
  angkatan: string;
  whatsapp: string;
  primary_division_id: string;
  primary_division_name: string;
  primary_division_category: DivisionSelectionCategory;
  primary_reason: string;
  secondary_division_id: string;
  secondary_division_name: string;
  secondary_division_category: DivisionSelectionCategory;
  secondary_reason: string;
  cv_file_name: string;
  cv_file_size_bytes: number;
  cv_file_url: string | null;
  cv_storage_path: string | null;
  agreed_requirements: boolean;
  agreed_truth: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RegistrationApiResponse {
  success: boolean;
  message: string;
  registrationCode?: string;
  data?: RegistrationPayload;
  error?: string;
}

export interface SubmissionReceiptData {
  registrationId: string;
  fullName: string;
  nim: string;
  fakultas?: string;
  faculty?: string;
  prodi: string;
  whatsapp: string;
  email?: string;
  angkatan?: string;
  category?: string;
  primaryDivision: string;
  secondaryDivision?: string;
  reason: string;
  primaryReason?: string;
  secondaryReason?: string;
  fileName: string;
  fileSizeFormatted: string;
  submittedAt: string;
}
