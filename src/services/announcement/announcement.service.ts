/*
-----------------------------------------
nama file: [ announcement.service.ts ] 
fungsi [ Layanan pengambilan data status kelulusan OPREC dari Supabase assessments.status untuk pengguna terautentikasi ]
-----------------------------------------------
*/

import { supabase } from "../supabase/supabaseClient";
import {
  AnnouncementResponse,
  ApplicantAnnouncementData,
  OprecResultStatus,
  RawAssessmentStatus,
} from "./announcement.types";

/**
 * Memetakan nilai enum status database ('diterima', 'ditolak', 'pertimbangan')
 * ke 3 status tampilan halaman: lolos, tidak_lolos, belum_ditentukan
 */
export function mapAssessmentStatus(rawStatus?: string | null): {
  status: OprecResultStatus;
  rawStatus: RawAssessmentStatus;
} {
  const normalized = (rawStatus || "").trim().toLowerCase();

  if (normalized === "diterima") {
    return { status: "lolos", rawStatus: "diterima" };
  }
  if (normalized === "ditolak") {
    return { status: "tidak_lolos", rawStatus: "ditolak" };
  }
  return { status: "belum_ditentukan", rawStatus: "pertimbangan" };
}

/**
 * Mengambil data pengumuman hasil seleksi milik pendaftar yang sedang login.
 */
export async function getApplicantAnnouncement(): Promise<AnnouncementResponse> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Jalur Mock Development Mode untuk pengujian lokal tanpa internet/Supabase aktif
    if (!session?.user) {
      if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
        const storedMockUser = localStorage.getItem("robotika_uns_mock_auth_user");
        if (storedMockUser) {
          const user = JSON.parse(storedMockUser);
          const overrideStatus = (localStorage.getItem(
            "robotika_uns_mock_announcement_status"
          ) || "belum_ditentukan") as OprecResultStatus;

          const rawMapping: Record<OprecResultStatus, RawAssessmentStatus> = {
            lolos: "diterima",
            tidak_lolos: "ditolak",
            belum_ditentukan: "pertimbangan",
          };

          const rawStatus = rawMapping[overrideStatus] || "pertimbangan";

          const mockDraft = localStorage.getItem("robotika_uns_mock_draft");
          const draftData = mockDraft ? JSON.parse(mockDraft) : null;

          return {
            isAuthenticated: true,
            data: {
              hasRecord: true,
              isSubmitted: draftData?.status === "submitted" || true,
              status: overrideStatus,
              rawStatus,
              fullName: draftData?.applicant?.fullName || draftData?.full_name || user.name || "Pendaftar Robotika",
              nim: draftData?.applicant?.nim || draftData?.nim || "M0522001",
              fakultas: draftData?.applicant?.fakultas || draftData?.fakultas || "Fakultas Teknologi Informasi dan Sains Data",
              prodi: draftData?.applicant?.prodi || draftData?.prodi || "Informatika",
              registrationCode: draftData?.registrationCode || draftData?.registration_code || "ROB-UNS-2026-DEMO01",
              primaryDivision: draftData?.divisions?.primary?.name || draftData?.primary_division_name || "Cakrawala - Pemrograman",
              secondaryDivision: draftData?.divisions?.secondary?.name || draftData?.secondary_division_name || "Werkudara - Elektronika",
              acceptedDivision: overrideStatus === "lolos" ? (draftData?.divisions?.primary?.name || "Cakrawala - Pemrograman") : undefined,
              notes: draftData?.assessment_notes || null,
              submittedAt: draftData?.metadata?.submittedAt || draftData?.submitted_at || new Date().toISOString(),
            },
          };
        }
      }

      return {
        isAuthenticated: false,
        data: null,
      };
    }

    // 1. Coba ambil dari database view `view_registrations`
    const { data: viewData, error: viewError } = await supabase
      .from("view_registrations")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!viewError && viewData) {
      const { status, rawStatus } = mapAssessmentStatus(viewData.assessment_status);

      return {
        isAuthenticated: true,
        data: {
          hasRecord: true,
          isSubmitted: viewData.status === "submitted",
          status,
          rawStatus,
          fullName: viewData.full_name || session.user.user_metadata?.full_name || "Pendaftar",
          nim: viewData.nim || "-",
          fakultas: viewData.fakultas || "-",
          prodi: viewData.prodi || "-",
          registrationCode: viewData.registration_code || "-",
          primaryDivision: viewData.primary_division_name || "-",
          secondaryDivision: viewData.secondary_division_name || undefined,
          acceptedDivisionId: viewData.accepted_division_id || undefined,
          acceptedDivision:
            status === "lolos"
              ? viewData.accepted_division_name || viewData.primary_division_name || "-"
              : undefined,
          acceptedDivisionCategory: viewData.accepted_division_category || undefined,
          notes: viewData.assessment_notes || null,
          submittedAt: viewData.submitted_at || viewData.created_at,
        },
      };
    }

    // 2. Fallback: Query tabel applicants dan join assessments secara langsung
    const { data: applicant, error: applicantError } = await supabase
      .from("applicants")
      .select(`
        id,
        user_id,
        full_name,
        nim,
        fakultas,
        prodi,
        registration_code,
        status,
        submitted_at,
        created_at,
        assessments (
          status,
          notes,
          accepted_division_id,
          divisions (
            id,
            name,
            category
          )
        )
      `)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (applicantError) {
      console.warn("Gagal mengambil data applicants:", applicantError.message);
      return {
        isAuthenticated: true,
        data: null,
        error: applicantError.message,
      };
    }

    if (!applicant) {
      return {
        isAuthenticated: true,
        data: null, // Belum pernah mendaftar
      };
    }

    // Ambil record assessment jika ada (bisa berupa object tunggal atau array)
    const assessmentRecord = Array.isArray(applicant.assessments)
      ? applicant.assessments[0]
      : applicant.assessments;

    const rawStatus = assessmentRecord?.status || "pertimbangan";
    const { status } = mapAssessmentStatus(rawStatus);

    const divisionRecord = Array.isArray(assessmentRecord?.divisions)
      ? assessmentRecord.divisions[0]
      : assessmentRecord?.divisions;

    return {
      isAuthenticated: true,
      data: {
        hasRecord: true,
        isSubmitted: applicant.status === "submitted",
        status,
        rawStatus: (rawStatus as RawAssessmentStatus) || "pertimbangan",
        fullName: applicant.full_name || session.user.user_metadata?.full_name || "Pendaftar",
        nim: applicant.nim || "-",
        fakultas: applicant.fakultas || "-",
        prodi: applicant.prodi || "-",
        registrationCode: applicant.registration_code || "-",
        primaryDivision: "-",
        acceptedDivisionId: assessmentRecord?.accepted_division_id || undefined,
        acceptedDivision: status === "lolos" ? (divisionRecord?.name || "-") : undefined,
        acceptedDivisionCategory: divisionRecord?.category || undefined,
        notes: assessmentRecord?.notes || null,
        submittedAt: applicant.submitted_at || applicant.created_at,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Kesalahan sistem saat mengambil status pengumuman.";
    console.error("Kesalahan getApplicantAnnouncement:", err);
    return {
      isAuthenticated: false,
      data: null,
      error: errorMsg,
    };
  }
}
