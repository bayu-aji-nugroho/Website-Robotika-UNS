export type DivisionSelectionCategory = "teknis" | "non-teknis";

export type RegistrationStatus = "draft" | "submitted";

export interface RegistrationFormInput {
  fullName: string;
  nim: string;
  fakultas: string;
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

export interface Step3IdentityInput {
  fullName: string;
  nim: string;
  fakultas: string;
  angkatan: string;
  prodi: string;
  whatsapp: string;
}

export interface Step4DivisionInput {
  categoryMode1: DivisionSelectionCategory;
  primaryDivisionId: string;
  primaryDivisionName?: string;
  primaryDivisionCategory?: DivisionSelectionCategory;
  primaryReason: string;
  categoryMode2: DivisionSelectionCategory;
  secondaryDivisionId: string;
  secondaryDivisionName?: string;
  secondaryDivisionCategory?: DivisionSelectionCategory;
  secondaryReason: string;
}

export interface Step5SubmitInput {
  cvFile: File;
  agreedToRequirements: boolean;
  agreedToCvTruth: boolean;
}

export interface SaveStepResult {
  success: boolean;
  message?: string;
  field?: string;
  error?: string;
  data?: SupabaseRegistrationRecord;
}

export interface NimCheckResult {
  available: boolean;
  message?: string;
  error?: string;
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
  user_id?: string;
  user_email?: string;
  registration_code?: string | null;
  status?: RegistrationStatus;
  current_step?: number;
  full_name?: string | null;
  nim?: string | null;
  fakultas?: string | null;
  prodi?: string | null;
  angkatan?: string | null;
  whatsapp?: string | null;
  primary_division_id?: string | null;
  primary_division_name?: string | null;
  primary_division_category?: DivisionSelectionCategory | null;
  primary_reason?: string | null;
  secondary_division_id?: string | null;
  secondary_division_name?: string | null;
  secondary_division_category?: DivisionSelectionCategory | null;
  secondary_reason?: string | null;
  cv_file_name?: string | null;
  cv_file_size_bytes?: number | null;
  cv_file_url?: string | null;
  cv_storage_path?: string | null;
  agreed_requirements?: boolean;
  agreed_truth?: boolean;
  submitted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RegistrationProgressData {
  hasRecord: boolean;
  status: RegistrationStatus | "none";
  currentStep: number;
  record?: SupabaseRegistrationRecord | null;
}

export interface RegistrationApiResponse {
  success: boolean;
  message: string;
  registrationCode?: string;
  field?: string;
  data?: RegistrationPayload | SupabaseRegistrationRecord;
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
