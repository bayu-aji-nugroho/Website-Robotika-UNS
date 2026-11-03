/*
-----------------------------------------
nama file: [ RegistrationCvSection.tsx ] 
fungsi [ Komponen langkah kelima (Upload Berkas) formulir pendaftaran untuk mengunggah dokumen Curriculum Vitae, tautan twibbon (wajib bagi seluruh anggota), tautan portofolio (wajib bagi divisi Media, opsional bagi divisi lain), persetujuan keabsahan data, dan tombol submit ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { FileUploadDropzone, FormField } from "@/src/components/molecules";
import { Checkbox, ErrorMessage, Button, Input } from "@/src/components/atoms";
import { ArrowLeft, ArrowRight, Lock, ExternalLink } from "lucide-react";

export interface RegistrationCvSectionProps {
  file: File | null;
  error?: string | null;
  twibbonUrl: string;
  twibbonError?: string | null;
  portfolioUrl: string;
  portfolioError?: string | null;
  isMediaSelected: boolean;
  agreement: boolean;
  agreementError?: string | null;
  isSubmitting: boolean;
  isLocked?: boolean;
  maxSizeBytes?: number;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onTwibbonUrlChange: (val: string) => void;
  onTwibbonUrlBlur?: () => void;
  onPortfolioUrlChange: (val: string) => void;
  onAgreementChange: (val: boolean) => void;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegistrationCvSection: React.FC<RegistrationCvSectionProps> = ({
  file,
  error,
  twibbonUrl,
  twibbonError,
  portfolioUrl,
  portfolioError,
  isMediaSelected,
  agreement,
  agreementError,
  isSubmitting,
  isLocked = false,
  maxSizeBytes = 1024 * 1024,
  onFileSelect,
  onFileRemove,
  onTwibbonUrlChange,
  onTwibbonUrlBlur,
  onPortfolioUrlChange,
  onAgreementChange,
  onPrev,
  onSubmit,
}) => {
  return (
    <div className="bg-white dark:bg-[#18191d] rounded-xl sm:rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6 shadow-xs transition-colors duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#B22234] text-white text-xs font-bold shrink-0">
              5
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Upload Berkas
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


      {/* Bagian 1: Berkas Dokumen CV */}
      <div className="space-y-3">
        <div className="flex items-center">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Dokumen Curriculum Vitae (CV)
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

      {/* Bagian 2: Tautan Pendukung (Twibbon & Portofolio) */}
      <div className="space-y-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Tautan Pendukung
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
          {/* Input 1: Link Bukti Upload Twibbon & Follow Instagram & TikTok */}
          <FormField
            label="Link Bukti Upload Twibbon, Follow Instagram, dan Follow TikTok"
            htmlFor="reg-twibbon-url"
            required={true}
            sublabel="Wajib Google Drive"
            error={twibbonError || undefined}
          >
            {!isLocked ? (
              <div className="relative">
                <Input
                  id="reg-twibbon-url"
                  type="url"
                  value={twibbonUrl}
                  onChange={(e) => onTwibbonUrlChange(e.target.value)}
                  onBlur={onTwibbonUrlBlur}
                  placeholder="https://drive.google.com/..."
                  error={Boolean(twibbonError)}
                  disabled={isSubmitting}
                  className="pr-9"
                />
                {twibbonUrl && (
                  <a
                    href={twibbonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md transition-colors"
                    title="Uji buka tautan"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between text-xs">
                <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[80%] font-mono text-[11px] sm:text-xs">
                  {twibbonUrl || "Tidak dicantumkan"}
                </span>
                {twibbonUrl && (
                  <a
                    href={twibbonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white px-2.5 py-1 rounded-md bg-[#B22234] hover:bg-[#8B0000] transition-colors ml-2 shrink-0 shadow-xs cursor-pointer"
                  >
                    <span>Buka Tautan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </FormField>

          {/* Input 2: Link Portofolio Karya */}
          <FormField
            label="Link Portofolio Karya"
            htmlFor="reg-portfolio-url"
            required={isMediaSelected}
            sublabel={isMediaSelected ? "Wajib (Divisi Media)" : "Opsional"}
            error={portfolioError || undefined}
          >
            {!isLocked ? (
              <div className="relative">
                <Input
                  id="reg-portfolio-url"
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => onPortfolioUrlChange(e.target.value)}
                  placeholder="https://..."
                  error={Boolean(portfolioError)}
                  disabled={isSubmitting}
                  className="pr-9"
                />
                {portfolioUrl && (
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md transition-colors"
                    title="Uji buka tautan"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between text-xs">
                <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[80%] font-mono text-[11px] sm:text-xs">
                  {portfolioUrl || "Tidak dicantumkan"}
                </span>
                {portfolioUrl && (
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white px-2.5 py-1 rounded-md bg-[#B22234] hover:bg-[#8B0000] transition-colors ml-2 shrink-0 shadow-xs cursor-pointer"
                  >
                    <span>Buka Tautan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </FormField>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
        <div className="p-4 rounded-lg bg-[#FCF2F3] dark:bg-red-950/30 border border-[#F8D7DA] dark:border-red-900/50 space-y-2">
          <Checkbox
            id="reg-cv-agreement"
            checked={agreement || isLocked}
            disabled={isLocked}
            onChange={(e) => onAgreementChange(e.target.checked)}
            label="Saya menyatakan bahwa data, berkas CV, serta tautan bukti yang diunggah adalah benar, dan saya bersedia mengikuti seluruh tahapan seleksi calon anggota Robotika UNS."
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
