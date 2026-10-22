/*
-----------------------------------------
nama file: [ RegistrationCvSection.tsx ] 
fungsi [ Komponen langkah kelima formulir pendaftaran untuk mengunggah dokumen Curriculum Vitae, persetujuan keabsahan data, dan tombol submit ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { FileUploadDropzone } from "@/src/components/molecules";
import { Checkbox, ErrorMessage, Button } from "@/src/components/atoms";
import { ArrowLeft, ArrowRight, FileText, Lock } from "lucide-react";

export interface RegistrationCvSectionProps {
  file: File | null;
  error?: string | null;
  agreement: boolean;
  agreementError?: string | null;
  isSubmitting: boolean;
  isLocked?: boolean;
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
  isLocked = false,
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
              5
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Unggah Berkas Curriculum Vitae (CV)
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
            Langkah 5 dari 6
          </span>
        </div>
      </div>

      {isLocked && (
        <div className="p-3 sm:p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs sm:text-sm text-amber-800 dark:text-amber-200 shadow-xs">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold">Pendaftaran Telah Dikirim Permanen</span>
              <span className="text-[10px] uppercase tracking-wider bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                Terkunci
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Berkas pendaftaran Anda telah tersimpan dan status telah selesai (submitted). Data tidak dapat diubah atau dikirim ulang.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#B22234]" />
            <span>Dokumen CV</span>
          </span>
        </div>

        {!isLocked ? (
          <FileUploadDropzone
            file={file}
            onFileSelect={onFileSelect}
            onFileRemove={onFileRemove}
            error={error}
            maxSizeBytes={maxSizeBytes}
          />
        ) : (
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Berkas CV telah diunggah dan diverifikasi pada sistem pendaftaran.
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
        <div className="p-4 rounded-lg bg-[#FCF2F3] dark:bg-red-950/30 border border-[#F8D7DA] dark:border-red-900/50 space-y-2">
          <Checkbox
            id="reg-cv-agreement"
            checked={agreement || isLocked}
            disabled={isLocked}
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
          ) : isLocked ? (
            <span>Lihat Bukti Pendaftaran</span>
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
