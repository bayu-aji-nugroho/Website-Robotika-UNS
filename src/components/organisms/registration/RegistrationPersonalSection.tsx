/*
-----------------------------------------
nama file: [ RegistrationPersonalSection.tsx ] 
fungsi [ Komponen langkah ketiga formulir pendaftaran untuk input data identitas mahasiswa dengan validasi Zero Trust dan penguncian permanen (immutable) ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { Input, Select, Button } from "@/src/components/atoms";
import { FormField } from "@/src/components/molecules";
import { ArrowLeft, ArrowRight, AlertCircle, Loader2, Lock } from "lucide-react";
import { getFacultyFromNim } from "@/src/services";

export interface RegistrationPersonalSectionProps {
  fullName: string;
  nim: string;
  prodi: string;
  angkatan: string;
  whatsapp: string;
  errors: { [key: string]: string };
  isSaving?: boolean;
  isLocked?: boolean;
  onFullNameChange: (val: string) => void;
  onNimChange: (val: string) => void;
  onProdiChange: (val: string) => void;
  onAngkatanChange: (val: string) => void;
  onWhatsappChange: (val: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const RegistrationPersonalSection: React.FC<RegistrationPersonalSectionProps> = ({
  fullName,
  nim,
  prodi,
  angkatan,
  whatsapp,
  errors,
  isSaving = false,
  isLocked = false,
  onFullNameChange,
  onNimChange,
  onProdiChange,
  onAngkatanChange,
  onWhatsappChange,
  onPrev,
  onNext,
}) => {
  const detectedFaculty = nim.trim() ? getFacultyFromNim(nim) : null;
  const facultyHelper =
    detectedFaculty && detectedFaculty !== "-"
      ? `Fakultas terdeteksi: ${detectedFaculty}`
      : undefined;

  const isDisabled = isSaving || isLocked;

  return (
    <div className="bg-white dark:bg-[#18191d] rounded-xl sm:rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-3 sm:p-5 md:p-6 space-y-3 sm:space-y-5 shadow-xs transition-colors duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#B22234] text-white text-xs font-bold shrink-0">
              3
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Identitas Mahasiswa
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
            Langkah 3 dari 6
          </span>
        </div>
      </div>

      {/* Card Data Sudah Disimpan */}
      {isLocked && (
        <div className="p-3 sm:p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs sm:text-sm text-amber-800 dark:text-amber-200 shadow-xs">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold">Data Identitas Telah Disimpan Permanen</span>
              <span className="text-[10px] uppercase tracking-wider bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                TERKUNCI
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Data identitas Anda telah tersimpan di database dan bersifat permanen (tidak dapat diubah lagi).
            </p>
          </div>
        </div>
      )}

      {/* Global / Server Error Alert */}
      {errors.general && (
        <div className="p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs sm:text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Validasi Menolak Perubahan:</p>
            <p className="leading-relaxed">{errors.general}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 md:gap-5">
        <FormField
          label="Nama Lengkap"
          htmlFor="reg-fullname"
          required
          error={errors.fullName}
          className="sm:col-span-2"
        >
          <Input
            id="reg-fullname"
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            autoComplete="name"
            error={!!errors.fullName}
            placeholder="Contoh: Dimas Arya Prasetya"
            disabled={isDisabled}
          />
        </FormField>

        <FormField
          label="Nomor Induk Mahasiswa (NIM)"
          htmlFor="reg-nim"
          required
          error={errors.nim}
          helperText={facultyHelper || "Contoh format: I0724018 (diawali kode fakultas)"}
        >
          <Input
            id="reg-nim"
            type="text"
            isMono
            value={nim}
            onChange={(e) => onNimChange(e.target.value.toUpperCase())}
            maxLength={12}
            error={!!errors.nim}
            placeholder="I0724018"
            disabled={isDisabled}
          />
        </FormField>

        <FormField
          label="Tahun Angkatan"
          htmlFor="reg-angkatan"
          required
          error={errors.angkatan}
        >
          <Select
            id="reg-angkatan"
            value={angkatan}
            onChange={(e) => onAngkatanChange(e.target.value)}
            error={!!errors.angkatan}
            disabled={isDisabled}
          >
            <option value="" disabled>-- Pilih Tahun Angkatan --</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </Select>
        </FormField>

        <FormField
          label="Program Studi"
          htmlFor="reg-prodi"
          required
          error={errors.prodi}
          className="sm:col-span-2"
        >
          <Input
            id="reg-prodi"
            type="text"
            value={prodi}
            onChange={(e) => onProdiChange(e.target.value)}
            error={!!errors.prodi}
            placeholder="Contoh: S1 Teknik Elektro / D3 Teknik Informatika"
            disabled={isDisabled}
          />
        </FormField>

        <FormField
          label="Nomor WhatsApp Aktif"
          htmlFor="reg-wa"
          required
          error={errors.whatsapp}
          helperText="Diawali 08 (10-15 digit), contoh: 081234567891"
          className="sm:col-span-2"
        >
          <Input
            id="reg-wa"
            type="tel"
            value={whatsapp}
            onChange={(e) => onWhatsappChange(e.target.value)}
            autoComplete="tel"
            error={!!errors.whatsapp}
            placeholder="081234567891"
            disabled={isDisabled}
          />
        </FormField>
      </div>

      <div className="pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onPrev}
          disabled={isSaving}
          className="w-full cursor-pointer"
          icon={<ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          iconPosition="left"
        >
          <span>Kembali</span>
          <span className="hidden sm:inline"> ke Akun Google</span>
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={isSaving}
          className="w-full cursor-pointer"
          icon={
            isSaving ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )
          }
          iconPosition="right"
        >
          <span>{isSaving ? "Menyimpan..." : isLocked ? "Lanjut" : "Lanjut"}</span>
          <span className="hidden sm:inline"> {!isSaving && "ke Pilihan Divisi"}</span>
        </Button>
      </div>
    </div>
  );
};
