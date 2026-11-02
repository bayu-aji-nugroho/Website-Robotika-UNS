/*
-----------------------------------------
nama file: [ RegistrationConfirmModals.tsx ] 
fungsi [ Komponen penyedia modal konfirmasi simpan permanen pendaftaran setelah Langkah 5 (Upload Berkas) ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { ConfirmationModal } from "@/src/components/molecules";
import { formatFileSize } from "@/src/services";
import { DivisionCategory } from "./RegistrationDivisionSection";

export type ConfirmModalType = "submit" | null;

export interface RegistrationConfirmModalsProps {
  confirmModalType: ConfirmModalType;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  fullName: string;
  nim: string;
  fakultas: string;
  prodi: string;
  angkatan: string;
  whatsapp: string;
  categoryMode1: DivisionCategory;
  primaryDivision: string;
  categoryMode2: DivisionCategory;
  secondaryDivision: string;
  cvFile: File | null;
  twibbonUrl?: string;
  portfolioUrl?: string;
  getDivisionName: (id: string) => string;
}

export const RegistrationConfirmModals: React.FC<RegistrationConfirmModalsProps> = ({
  confirmModalType,
  isSubmitting,
  onClose,
  onConfirmSubmit,
  fullName,
  nim,
  fakultas,
  prodi,
  angkatan,
  whatsapp,
  primaryDivision,
  secondaryDivision,
  cvFile,
  twibbonUrl,
  portfolioUrl,
  getDivisionName,
}) => {
  return (
    <>
      {/* Pop-up Modal Simpan Permanen Pendaftaran (Hanya setelah Tahap 5: Upload Berkas) */}
      <ConfirmationModal
        isOpen={confirmModalType === "submit"}
        title="Simpan Permanen Pendaftaran"
        description="Periksa kembali data Anda. Setelah disimpan permanen, pendaftaran bersifat final dan tidak dapat diubah kembali."
        confirmText="Ya, Simpan Permanen"
        cancelText="Periksa Kembali"
        isLoading={isSubmitting}
        onConfirm={onConfirmSubmit}
        onCancel={onClose}
        details={[
          { label: "Nama Lengkap", value: fullName || "-" },
          { label: "NIM", value: nim || "-" },
          {
            label: "Program Studi",
            value: prodi && angkatan ? `${prodi} (${angkatan})` : prodi || angkatan || "-",
          },
          { label: "Nomor WhatsApp", value: whatsapp || "-" },
          { label: "Pilihan 1", value: getDivisionName(primaryDivision) || "-" },
          { label: "Pilihan 2", value: getDivisionName(secondaryDivision) || "-" },
          {
            label: "Berkas CV",
            value: cvFile ? `${cvFile.name} (${formatFileSize(cvFile.size)})` : "-",
          },
          {
            label: "Tautan Pendukung",
            value:
              twibbonUrl && portfolioUrl
                ? "Twibbon & Portofolio terlampir"
                : twibbonUrl
                ? "Twibbon terlampir"
                : portfolioUrl
                ? "Portofolio terlampir"
                : "Tidak dicantumkan",
          },
        ]}
      />
    </>
  );
};
