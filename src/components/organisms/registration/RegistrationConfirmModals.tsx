/*
-----------------------------------------
nama file: [ RegistrationConfirmModals.tsx ] 
fungsi [ Komponen penyedia modal konfirmasi simpan permanen untuk formulir pendaftaran: Step 3 (Identitas), Step 4 (Divisi), dan Step 5 (Submit Final) ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { ConfirmationModal } from "@/src/components/molecules";
import { formatFileSize } from "@/src/services";
import { DivisionCategory } from "./RegistrationDivisionSection";

export type ConfirmModalType = "step3" | "step4" | "submit" | null;

export interface RegistrationConfirmModalsProps {
  confirmModalType: ConfirmModalType;
  isSavingStep: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirmStep3: () => void;
  onConfirmStep4: () => void;
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
  getDivisionName: (id: string) => string;
}

export const RegistrationConfirmModals: React.FC<RegistrationConfirmModalsProps> = ({
  confirmModalType,
  isSavingStep,
  isSubmitting,
  onClose,
  onConfirmStep3,
  onConfirmStep4,
  onConfirmSubmit,
  fullName,
  nim,
  fakultas,
  prodi,
  angkatan,
  whatsapp,
  categoryMode1,
  primaryDivision,
  categoryMode2,
  secondaryDivision,
  cvFile,
  getDivisionName,
}) => {
  return (
    <>
      {/* Pop-up Modal Simpan Permanen Step 3: Identitas */}
      <ConfirmationModal
        isOpen={confirmModalType === "step3"}
        title="Simpan Permanen Data Identitas"
        description="Data identitas yang telah disimpan tidak dapat diubah kembali."
        confirmText="Ya, Simpan Permanen"
        cancelText="Periksa Kembali"
        isLoading={isSavingStep}
        onConfirm={onConfirmStep3}
        onCancel={onClose}
        details={[
          { label: "Nama Lengkap", value: fullName },
          { label: "NIM", value: nim },
          { label: "Fakultas", value: fakultas },
          { label: "Program Studi", value: prodi },
          { label: "Tahun Angkatan", value: angkatan },
          { label: "Nomor WhatsApp", value: whatsapp },
        ]}
      />

      {/* Pop-up Modal Simpan Permanen Step 4: Pilihan Divisi */}
      <ConfirmationModal
        isOpen={confirmModalType === "step4"}
        title="Simpan Permanen Pilihan Divisi"
        description="Pilihan divisi yang telah disimpan tidak dapat diubah kembali."
        confirmText="Ya, Simpan Permanen"
        cancelText="Periksa Kembali"
        isLoading={isSavingStep}
        onConfirm={onConfirmStep4}
        onCancel={onClose}
        details={[
          {
            label: "Kategori Pilihan 1",
            value: categoryMode1 === "teknis" ? "Teknis" : "Non-Teknis",
          },
          { label: "Divisi Pilihan 1", value: getDivisionName(primaryDivision) },
          {
            label: "Kategori Pilihan 2",
            value: categoryMode2 === "teknis" ? "Teknis" : "Non-Teknis",
          },
          { label: "Divisi Pilihan 2", value: getDivisionName(secondaryDivision) },
        ]}
      />

      {/* Pop-up Modal Kirim Permanen Step 5: Berkas CV & Finalisasi */}
      <ConfirmationModal
        isOpen={confirmModalType === "submit"}
        title="Kirim Pendaftaran Calon Anggota"
        description="Pendaftaran yang telah dikirim bersifat final dan tidak dapat diubah kembali."
        confirmText="Ya, Kirim Formulir"
        cancelText="Periksa Kembali"
        isLoading={isSubmitting}
        onConfirm={onConfirmSubmit}
        onCancel={onClose}
        details={[
          { label: "Nama Pendaftar", value: fullName },
          { label: "NIM", value: nim },
          { label: "Divisi Pilihan 1", value: getDivisionName(primaryDivision) },
          { label: "Divisi Pilihan 2", value: getDivisionName(secondaryDivision) },
          { label: "Berkas CV", value: cvFile?.name || "-" },
          { label: "Ukuran Berkas", value: formatFileSize(cvFile?.size || 0) },
        ]}
      />
    </>
  );
};
