/*
-----------------------------------------
nama file: [ RegistrationDivisionSection.tsx ] 
fungsi [ Komponen langkah keempat formulir pendaftaran untuk memilih kategori bidang, divisi pilihan pertama dan kedua, serta alasan pemilihan divisi dengan penguncian permanen ]
-----------------------------------------------
*/

"use client";

import React, { useMemo } from "react";
import { Select, Textarea, Button } from "@/src/components/atoms";
import { FormField } from "@/src/components/molecules";
import {
  technicalDivisions,
  nonTechnicalDivisions,
  DivisionOption,
} from "@/data/registration";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, Lock } from "lucide-react";

export type DivisionCategory = "teknis" | "non-teknis" | "";

export interface RegistrationDivisionSectionProps {
  categoryMode1: DivisionCategory;
  primaryDivision: string;
  primaryReason: string;
  categoryMode2: DivisionCategory;
  secondaryDivision: string;
  secondaryReason: string;
  errors: { [key: string]: string };
  isSaving?: boolean;
  isLocked?: boolean;
  onCategoryMode1Change: (cat: DivisionCategory) => void;
  onPrimaryDivisionChange: (id: string) => void;
  onPrimaryReasonChange: (val: string) => void;
  onCategoryMode2Change: (cat: DivisionCategory) => void;
  onSecondaryDivisionChange: (id: string) => void;
  onSecondaryReasonChange: (val: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const RegistrationDivisionSection: React.FC<RegistrationDivisionSectionProps> = ({
  categoryMode1,
  primaryDivision,
  primaryReason,
  categoryMode2,
  secondaryDivision,
  secondaryReason,
  errors,
  isSaving = false,
  isLocked = false,
  onCategoryMode1Change,
  onPrimaryDivisionChange,
  onPrimaryReasonChange,
  onCategoryMode2Change,
  onSecondaryDivisionChange,
  onSecondaryReasonChange,
  onPrev,
  onNext,
}) => {
  const availableDivisions1: DivisionOption[] = useMemo(() => {
    if (categoryMode1 === "teknis") return technicalDivisions;
    if (categoryMode1 === "non-teknis") return nonTechnicalDivisions;
    return [];
  }, [categoryMode1]);

  const availableDivisions2: DivisionOption[] = useMemo(() => {
    let list: DivisionOption[] = [];
    if (categoryMode2 === "teknis") list = technicalDivisions;
    else if (categoryMode2 === "non-teknis") list = nonTechnicalDivisions;
    return list.filter((d) => d.id !== primaryDivision);
  }, [categoryMode2, primaryDivision]);

  const isDisabled = isSaving || isLocked;

  return (
    <div className="bg-white dark:bg-[#18191d] rounded-xl sm:rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-3.5 sm:p-5 md:p-6 space-y-4 sm:space-y-6 shadow-xs transition-colors duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2.5 sm:pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#B22234] text-white text-xs font-bold shrink-0">
              4
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Pilihan Divisi Minat
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
            Langkah 4 dari 6
          </span>
        </div>
      </div>

      {/* Lock Banner Jika Pilihan Divisi Sudah Disimpan Permanen */}
      {isLocked && (
        <div className="p-3 sm:p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs sm:text-sm text-amber-800 dark:text-amber-200 shadow-xs">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold">Pilihan Divisi Telah Disimpan Permanen</span>
              <span className="text-[10px] uppercase tracking-wider bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                Terkunci
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Pilihan divisi dan alasan minat Anda telah tersimpan di database dan bersifat permanen (tidak dapat diubah lagi).
            </p>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs sm:text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Kesalahan Penyimpanan Divisi:</p>
            <p className="leading-relaxed">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Pilihan Pertama */}
      <div className="space-y-3 sm:space-y-4 p-3.5 sm:p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800/80 pb-2">
          <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
            Divisi Pilihan 1
          </span>
        </div>

        <FormField
          label="Kategori Bidang Pilihan 1"
          htmlFor="reg-cat-1"
          required
          error={errors.categoryMode1}
        >
          <Select
            id="reg-cat-1"
            value={categoryMode1}
            onChange={(e) => onCategoryMode1Change(e.target.value as DivisionCategory)}
            error={!!errors.categoryMode1}
            disabled={isDisabled}
          >
            <option value="" disabled>-- Pilih Kategori Bidang --</option>
            <option value="teknis">Teknis</option>
            <option value="non-teknis">Non-Teknis</option>
          </Select>
        </FormField>

        <FormField
          label="Nama Divisi Pilihan 1"
          htmlFor="reg-division-1"
          required
          error={errors.primaryDivision}
        >
          <Select
            id="reg-division-1"
            value={primaryDivision}
            onChange={(e) => onPrimaryDivisionChange(e.target.value)}
            disabled={!categoryMode1 || isDisabled}
            error={!!errors.primaryDivision}
          >
            <option value="" disabled>
              {!categoryMode1 ? "-- Pilih Kategori Terlebih Dahulu --" : "-- Pilih Divisi --"}
            </option>
            {availableDivisions1.map((d) => (
              <option key={`p1-${d.id}`} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Alasan Memilih Pilihan Pertama"
          htmlFor="reg-reason-1"
          required
          error={errors.primaryReason}
        >
          <Textarea
            id="reg-reason-1"
            rows={3}
            value={primaryReason}
            onChange={(e) => onPrimaryReasonChange(e.target.value)}
            placeholder="Jelaskan alasan, minat, atau pengalaman Anda memilih divisi utama ini..."
            error={!!errors.primaryReason}
            disabled={isDisabled}
          />
        </FormField>
      </div>

      {/* Pilihan Kedua */}
      <div className="space-y-3 sm:space-y-4 p-3.5 sm:p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800/80 pb-2">
          <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
            Divisi Pilihan 2
          </span>
        </div>

        <FormField
          label="Kategori Bidang Pilihan 2"
          htmlFor="reg-cat-2"
          required
          error={errors.categoryMode2}
        >
          <Select
            id="reg-cat-2"
            value={categoryMode2}
            onChange={(e) => onCategoryMode2Change(e.target.value as DivisionCategory)}
            error={!!errors.categoryMode2}
            disabled={isDisabled}
          >
            <option value="" disabled>-- Pilih Kategori Bidang --</option>
            <option value="teknis">Teknis</option>
            <option value="non-teknis">Non-Teknis</option>
          </Select>
        </FormField>

        <FormField
          label="Nama Divisi Pilihan 2"
          htmlFor="reg-division-2"
          required
          error={errors.secondaryDivision}
        >
          <Select
            id="reg-division-2"
            value={secondaryDivision}
            onChange={(e) => onSecondaryDivisionChange(e.target.value)}
            disabled={!categoryMode2 || isDisabled}
            error={!!errors.secondaryDivision}
          >
            <option value="" disabled>
              {!categoryMode2 ? "-- Pilih Kategori Terlebih Dahulu --" : "-- Pilih Divisi --"}
            </option>
            {availableDivisions2.map((d) => (
              <option key={`p2-${d.id}`} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Alasan Memilih Pilihan Kedua"
          htmlFor="reg-reason-2"
          required
          error={errors.secondaryReason}
        >
          <Textarea
            id="reg-reason-2"
            rows={3}
            value={secondaryReason}
            onChange={(e) => onSecondaryReasonChange(e.target.value)}
            placeholder="Jelaskan alasan, minat, atau pengalaman Anda memilih divisi pilihan kedua ini..."
            error={!!errors.secondaryReason}
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
          <span className="hidden sm:inline"> ke Identitas</span>
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
          <span className="hidden sm:inline"> {!isSaving && "ke Unggah CV"}</span>
        </Button>
      </div>
    </div>
  );
};
