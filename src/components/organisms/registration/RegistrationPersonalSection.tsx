/*
-----------------------------------------
nama file: [ RegistrationPersonalSection.tsx ] 
fungsi [ Komponen langkah kedua formulir pendaftaran untuk input data identitas mahasiswa seperti nama lengkap, NIM, angkatan, prodi, dan nomor WhatsApp ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { Input, Select, Button } from "@/src/components/atoms";
import { FormField } from "@/src/components/molecules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getFacultyFromNim } from "@/src/services";

export interface RegistrationPersonalSectionProps {
  fullName: string;
  nim: string;
  prodi: string;
  angkatan: string;
  whatsapp: string;
  errors: { [key: string]: string };
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
      ? `Fakultas otomatis: ${detectedFaculty}`
      : undefined;

  return (
    <div className="bg-white dark:bg-[#18191d] rounded-xl sm:rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-3 sm:p-5 md:p-6 space-y-3 sm:space-y-5 shadow-xs transition-colors duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#B22234] text-white text-xs font-bold shrink-0">
              2
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Identitas Mahasiswa
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
            Langkah 2 dari 5
          </span>
        </div>
      </div>


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
          />
        </FormField>

        <FormField
          label="Nomor Induk Mahasiswa (NIM)"
          htmlFor="reg-nim"
          required
          error={errors.nim}
          helperText={facultyHelper}
        >
          <Input
            id="reg-nim"
            type="text"
            isMono
            value={nim}
            onChange={(e) => onNimChange(e.target.value.toUpperCase())}
            maxLength={12}
            error={!!errors.nim}
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
          />
        </FormField>

        <FormField
          label="Nomor WhatsApp Aktif"
          htmlFor="reg-wa"
          required
          error={errors.whatsapp}
          className="sm:col-span-2"
        >
          <Input
            id="reg-wa"
            type="tel"
            value={whatsapp}
            onChange={(e) => onWhatsappChange(e.target.value)}
            autoComplete="tel"
            error={!!errors.whatsapp}
          />
        </FormField>
      </div>

      <div className="pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onPrev}
          className="w-full cursor-pointer"
          icon={<ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          iconPosition="left"
        >
          <span>Kembali</span>
          <span className="hidden sm:inline"> ke Syarat Masuk</span>
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onNext}
          className="w-full cursor-pointer"
          icon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          iconPosition="right"
        >
          <span>Lanjut</span>
          <span className="hidden sm:inline"> ke Pilihan Divisi</span>
        </Button>
      </div>
    </div>
  );
};
