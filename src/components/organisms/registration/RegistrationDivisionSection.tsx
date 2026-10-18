/*
-----------------------------------------
nama file: [ RegistrationDivisionSection.tsx ] 
fungsi [ Komponen langkah ketiga formulir pendaftaran untuk memilih kategori bidang, divisi pilihan pertama dan kedua, serta alasan pemilihan divisi ]
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
import { ArrowLeft, ArrowRight } from "lucide-react";

export type DivisionCategory = "teknis" | "non-teknis" | "";

export interface RegistrationDivisionSectionProps {
  categoryMode1: DivisionCategory;
  primaryDivision: string;
  primaryReason: string;
  categoryMode2: DivisionCategory;
  secondaryDivision: string;
  secondaryReason: string;
  errors: { [key: string]: string };
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
    return list.filter((item) => item.id !== primaryDivision);
  }, [categoryMode2, primaryDivision]);

  return (
    <div className="bg-white dark:bg-[#18191d] rounded-xl sm:rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-3 sm:p-5 md:p-6 space-y-3 sm:space-y-5 shadow-xs transition-colors duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#B22234] text-white text-xs font-bold shrink-0">
              3
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Pilihan Divisi
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
            Langkah 3 dari 5
          </span>
        </div>
      </div>

      <div className="space-y-2.5 sm:space-y-4 p-2.5 sm:p-4 rounded-lg sm:rounded-xl border border-zinc-200/90 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2 border-b border-zinc-200/70 dark:border-zinc-700 pb-1.5 sm:pb-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#B22234] text-white">
            Pilihan Pertama
          </span>
        </div>

        <FormField
          label="Kategori Bidang"
          htmlFor="reg-kategori-1"
          required
          error={errors.categoryMode1}
        >
          <Select
            id="reg-kategori-1"
            value={categoryMode1}
            onChange={(e) => onCategoryMode1Change(e.target.value as DivisionCategory)}
            error={!!errors.categoryMode1}
          >
            <option value="" disabled>-- Pilih Kategori Bidang --</option>
            <option value="teknis">Teknis</option>
            <option value="non-teknis">Non-Teknis</option>
          </Select>
        </FormField>

        <FormField
          label="Divisi Pilihan Pertama"
          htmlFor="reg-pilihan-1"
          required
          error={errors.primaryDivision}
        >
          <Select
            id="reg-pilihan-1"
            value={primaryDivision}
            disabled={!categoryMode1}
            onChange={(e) => onPrimaryDivisionChange(e.target.value)}
            error={!!errors.primaryDivision}
          >
            <option value="" disabled>
              {categoryMode1
                ? "-- Pilih Divisi Pilihan Pertama --"
                : "-- Pilih Kategori Bidang Terlebih Dahulu --"}
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
            placeholder="Jelaskan alasan, minat, atau pengalaman Anda memilih divisi pilihan pertama ini..."
            error={!!errors.primaryReason}
          />
        </FormField>
      </div>

      <div className="space-y-2.5 sm:space-y-4 p-2.5 sm:p-4 rounded-lg sm:rounded-xl border border-zinc-200/90 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2 border-b border-zinc-200/70 dark:border-zinc-700 pb-1.5 sm:pb-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-700 text-white">
            Pilihan Kedua
          </span>
        </div>

        <FormField
          label="Kategori Bidang"
          htmlFor="reg-kategori-2"
          required
          error={errors.categoryMode2}
        >
          <Select
            id="reg-kategori-2"
            value={categoryMode2}
            onChange={(e) => onCategoryMode2Change(e.target.value as DivisionCategory)}
            error={!!errors.categoryMode2}
          >
            <option value="" disabled>-- Pilih Kategori Bidang --</option>
            <option value="teknis">Teknis</option>
            <option value="non-teknis">Non-Teknis</option>
          </Select>
        </FormField>

        <FormField
          label="Divisi Pilihan Kedua"
          htmlFor="reg-pilihan-2"
          required
          error={errors.secondaryDivision}
        >
          <Select
            id="reg-pilihan-2"
            value={secondaryDivision}
            disabled={!categoryMode2}
            onChange={(e) => onSecondaryDivisionChange(e.target.value)}
            error={!!errors.secondaryDivision}
          >
            <option value="" disabled>
              {categoryMode2
                ? "-- Pilih Divisi Pilihan Kedua --"
                : "-- Pilih Kategori Bidang Terlebih Dahulu --"}
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
          <span className="hidden sm:inline"> ke Identitas</span>
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
          <span className="hidden sm:inline"> ke Unggah CV</span>
        </Button>
      </div>
    </div>

  );
};
