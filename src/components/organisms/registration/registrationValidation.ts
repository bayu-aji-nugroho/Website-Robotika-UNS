/*
-----------------------------------------
nama file: [ registrationValidation.ts ] 
fungsi [ Modul utilitas validasi sisi klien dan penghitungan langkah formulir pendaftaran calon anggota ]
-----------------------------------------------
*/

import { GoogleAuthUser, getProdiOptions } from "@/src/services";
import { DivisionCategory } from "./RegistrationDivisionSection";

export const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1.0 MB

export interface PersonalStepData {
  fullName: string;
  nim: string;
  fakultas: string;
  prodi: string;
  angkatan: string;
  whatsapp: string;
}

export interface DivisionStepData {
  categoryMode1: DivisionCategory;
  primaryDivision: string;
  primaryReason: string;
  categoryMode2: DivisionCategory;
  secondaryDivision: string;
  secondaryReason: string;
}

export interface CvStepData {
  cvFile: File | null;
  cvAgreement: boolean;
  maxSizeBytes?: number;
}

/**
 * Validasi Step 1: Syarat & Ketentuan
 */
export function validateStep1(agreedToRequirements: boolean): {
  isValid: boolean;
  error: string;
} {
  if (!agreedToRequirements) {
    return {
      isValid: false,
      error: "Anda harus menyetujui seluruh kriteria pendaftaran sebelum melanjutkan",
    };
  }
  return { isValid: true, error: "" };
}

/**
 * Validasi Step 2: Akun Google
 */
export function validateStep2(authUser: GoogleAuthUser | null): boolean {
  return authUser !== null;
}

/**
 * Validasi Step 3: Identitas Mahasiswa (Zero Trust Pre-Check di Klien)
 */
export function validateStep3(data: PersonalStepData): {
  isValid: boolean;
  errors: { [key: string]: string };
} {
  const errors: { [key: string]: string } = {};

  const cleanName = data.fullName.trim();
  if (!cleanName) {
    errors.fullName = "Nama lengkap wajib diisi";
  } else if (cleanName.length < 3) {
    errors.fullName = "Nama lengkap terlalu pendek (minimal 3 karakter)";
  } else if (/\d/.test(cleanName)) {
    errors.fullName = "Nama tidak valid: nama lengkap tidak boleh mengandung angka";
  }

  const cleanNim = data.nim.trim().toUpperCase();
  if (!cleanNim) {
    errors.nim = "NIM wajib diisi";
  } else if (cleanNim.length < 7 || cleanNim.length > 12) {
    errors.nim = "Format NIM tidak valid (panjang 7 - 12 karakter)";
  } else {
    const validInitials = ["F", "G", "H", "I", "D", "E", "B", "K", "M", "V", "L", "Z", "C", "P"];
    if (!validInitials.includes(cleanNim.charAt(0))) {
      errors.nim = "Format NIM tidak valid: inisial bukan kode fakultas resmi UNS";
    }
  }

  if (!data.angkatan) {
    errors.angkatan = "Tahun angkatan wajib dipilih";
  } else if (data.angkatan !== "2025" && data.angkatan !== "2026") {
    errors.angkatan = "Pendaftaran hanya dibuka untuk mahasiswa angkatan 2025 dan 2026";
  }

  if (!data.fakultas.trim()) {
    errors.fakultas = "Fakultas wajib dipilih";
  }

  if (!data.prodi.trim()) {
    errors.prodi = "Program studi wajib dipilih";
  } else if (
    data.fakultas.trim() &&
    !getProdiOptions(data.fakultas).some((p) => p.name === data.prodi)
  ) {
    errors.prodi = "Program studi tidak sesuai dengan fakultas yang dipilih";
  }

  const cleanWa = data.whatsapp.trim().replace(/[-\s]/g, "");
  if (!cleanWa) {
    errors.whatsapp = "Nomor WhatsApp aktif wajib diisi";
  } else if (!/^(08|\+628|628)[0-9]{8,12}$/.test(cleanWa)) {
    errors.whatsapp = "Masukkan nomor seluler Indonesia yang valid diawali 08 (10-15 digit)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validasi Step 4: Pilihan Divisi
 */
export function validateStep4(data: DivisionStepData): {
  isValid: boolean;
  errors: { [key: string]: string };
} {
  const errors: { [key: string]: string } = {};

  if (!data.categoryMode1) {
    errors.categoryMode1 = "Kategori bidang untuk pilihan 1 wajib dipilih";
  }
  if (!data.primaryDivision) {
    errors.primaryDivision = "Divisi pilihan 1 wajib dipilih";
  }
  if (!data.primaryReason.trim()) {
    errors.primaryReason = "Alasan memilih pilihan pertama wajib diisi";
  } else if (data.primaryReason.trim().length < 15) {
    errors.primaryReason = "Alasan memilih pilihan pertama minimal 15 karakter";
  }

  if (!data.categoryMode2) {
    errors.categoryMode2 = "Kategori bidang untuk pilihan 2 wajib dipilih";
  }
  if (!data.secondaryDivision) {
    errors.secondaryDivision = "Divisi pilihan 2 wajib dipilih";
  } else if (data.secondaryDivision === data.primaryDivision) {
    errors.secondaryDivision = "Divisi pilihan 2 harus berbeda dari pilihan 1";
  }
  if (!data.secondaryReason.trim()) {
    errors.secondaryReason = "Alasan memilih pilihan kedua wajib diisi";
  } else if (data.secondaryReason.trim().length < 15) {
    errors.secondaryReason = "Alasan memilih pilihan kedua minimal 15 karakter";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Step 5: Berkas CV
 */
export function validateStep5(data: CvStepData): {
  isValid: boolean;
  errors: { [key: string]: string };
} {
  const errors: { [key: string]: string } = {};
  const limit = data.maxSizeBytes ?? MAX_FILE_SIZE;

  if (!data.cvFile) {
    errors.cvFile = "Berkas CV wajib diunggah (format PDF, maksimal 1.0 MB)";
  } else if (data.cvFile.size > limit) {
    errors.cvFile = "Ukuran berkas CV melebihi batas 1.0 MB";
  }

  if (!data.cvAgreement) {
    errors.cvAgreement =
      "Anda perlu menyetujui pernyataan keabsahan dokumen sebelum mengirim pendaftaran";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface MaxReachableStepInput {
  hasSubmissionSuccess: boolean;
  agreedToRequirements: boolean;
  authUser: GoogleAuthUser | null;
  fullName: string;
  nim: string;
  angkatan: string;
  fakultas: string;
  prodi: string;
  whatsapp: string;
  categoryMode1: DivisionCategory;
  primaryDivision: string;
  primaryReason: string;
  categoryMode2: DivisionCategory;
  secondaryDivision: string;
  secondaryReason: string;
  cvFile: File | null;
  cvAgreement: boolean;
}

/**
 * Menghitung langkah maksimum yang dapat diakses pengguna
 */
export function calculateMaxReachableStep(input: MaxReachableStepInput): number {
  if (input.hasSubmissionSuccess) return 6;

  if (!input.agreedToRequirements) return 1;

  if (!input.authUser) return 2;

  const cleanWa = input.whatsapp.trim().replace(/[-\s]/g, "");
  const isStep3Valid =
    Boolean(input.fullName.trim()) &&
    !/\d/.test(input.fullName.trim()) &&
    Boolean(input.nim.trim()) &&
    input.nim.trim().length >= 7 &&
    (input.angkatan === "2025" || input.angkatan === "2026") &&
    Boolean(input.fakultas.trim()) &&
    Boolean(input.prodi.trim()) &&
    Boolean(cleanWa) &&
    /^[0-9+]{9,15}$/.test(cleanWa);
  if (!isStep3Valid) return 3;

  const isStep4Valid =
    Boolean(input.categoryMode1) &&
    Boolean(input.primaryDivision) &&
    input.primaryReason.trim().length >= 15 &&
    Boolean(input.categoryMode2) &&
    Boolean(input.secondaryDivision) &&
    input.secondaryDivision !== input.primaryDivision &&
    input.secondaryReason.trim().length >= 15;
  if (!isStep4Valid) return 4;

  const isStep5Valid =
    input.cvFile !== null &&
    input.cvFile.size <= MAX_FILE_SIZE &&
    Boolean(input.cvAgreement);
  if (!isStep5Valid) return 5;

  return 6;
}
