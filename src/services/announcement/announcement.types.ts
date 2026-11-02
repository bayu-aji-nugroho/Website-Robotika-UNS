/*
-----------------------------------------
nama file: [ announcement.types.ts ] 
fungsi [ Definisi tipe data hasil pengumuman kelulusan OPREC Robotika UNS dari tabel assessments ]
-----------------------------------------------
*/

export type OprecResultStatus = "lolos" | "tidak_lolos" | "belum_ditentukan";

export type RawAssessmentStatus = "diterima" | "ditolak" | "pertimbangan";

export interface ApplicantAnnouncementData {
  hasRecord: boolean;
  isSubmitted: boolean;
  status: OprecResultStatus;
  rawStatus: RawAssessmentStatus;
  fullName: string;
  nim: string;
  fakultas: string;
  prodi: string;
  registrationCode: string;
  primaryDivision: string;
  secondaryDivision?: string;
  acceptedDivisionId?: string;
  acceptedDivision?: string;
  acceptedDivisionCategory?: string;
  notes?: string | null;
  submittedAt?: string;
}

export interface AnnouncementResponse {
  isAuthenticated: boolean;
  data: ApplicantAnnouncementData | null;
  error?: string;
}
