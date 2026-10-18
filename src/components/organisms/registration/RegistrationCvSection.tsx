/*
-----------------------------------------
nama file: [ RegistrationCvSection.tsx ] 
fungsi [ Komponen langkah keempat formulir pendaftaran untuk mengunggah dokumen Curriculum Vitae, persetujuan keabsahan data, dan tombol submit ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { FileUploadDropzone } from "@/src/components/molecules";
import { Checkbox, ErrorMessage, Button } from "@/src/components/atoms";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";

export interface RegistrationCvSectionProps {
  file: File | null;
  error?: string | null;
  agreement: boolean;
  agreementError?: string | null;
  isSubmitting: boolean;
  maxSizeBytes?: number;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onAgreementChange: (val: boolean) => void;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegistrationCvSection: React.FC<RegistrationCvSectionProps> = ({
  file,
  error,
  agreement,
  agreementError,
  isSubmitting,
  maxSizeBytes = 1024 * 1024,
  onFileSelect,
  onFileRemove,
  onAgreementChange,
  onPrev,
  onSubmit,
}) => {
  return (
    <div className="bg-white dark:bg-[#18191d] rounded-xl sm:rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-3 sm:p-5 md:p-6 space-y-3 sm:space-y-5 shadow-xs transition-colors duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#B22234] text-white text-xs font-bold shrink-0">
              4
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Unggah Berkas Curriculum Vitae (CV)
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
            Langkah 4 dari 5
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#B22234]" />
            <span>Dokumen CV</span>
          </span>
        </div>

        <FileUploadDropzone
          file={file}
          onFileSelect={onFileSelect}
          onFileRemove={onFileRemove}
          error={error}
          maxSizeBytes={maxSizeBytes}
        />
      </div>

      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
        <div className="p-4 rounded-lg bg-[#FCF2F3] dark:bg-red-950/30 border border-[#F8D7DA] dark:border-red-900/50 space-y-2">
          <Checkbox
            id="reg-cv-agreement"
            checked={agreement}
            onChange={(e) => onAgreementChange(e.target.checked)}
            label="Saya menyatakan bahwa data dan berkas CV yang diunggah adalah benar, serta bersedia mengikuti seluruh tahapan seleksi calon anggota Robotika UNS."
            error={agreementError || undefined}
          />
          <ErrorMessage message={agreementError || undefined} />
        </div>
      </div>

      <div className="pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-2 sm:gap-3">

        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onPrev}
          disabled={isSubmitting}
          className="w-full cursor-pointer"
          icon={<ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          iconPosition="left"
        >
          <span>Kembali</span>
          <span className="hidden sm:inline"> ke Pilihan Divisi</span>
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full cursor-pointer"
          icon={
            isSubmitting ? (
              <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : (
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )
          }
          iconPosition="right"
        >
          {isSubmitting ? (
            <span>Mengirim...</span>
          ) : (
            <>
              <span>Kirim</span>
              <span className="hidden sm:inline"> Formulir</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
