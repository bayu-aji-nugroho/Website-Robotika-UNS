/*
-----------------------------------------
nama file: [ RegistrationRequirementsSection.tsx ] 
fungsi [ Komponen langkah pertama formulir pendaftaran untuk menampilkan syarat dan ketentuan, tahapan seleksi, persetujuan calon pendaftar, dan navigasi awal ]
-----------------------------------------------
*/

"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/atoms";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  registrationRequirements,
  registrationRequirementsData,
  RegistrationRequirementItem,
  RegistrationRequirementsContent,
} from "@/data/registration";

export interface RegistrationRequirementsSectionProps {
  agreed?: boolean;
  error?: string;
  isLocked?: boolean;
  onAgreeChange?: (val: boolean) => void;
  onNext: () => void;
  requirements?: RegistrationRequirementItem[];
  content?: RegistrationRequirementsContent;
}

export const RegistrationRequirementsSection: React.FC<RegistrationRequirementsSectionProps> = ({
  onNext,
  requirements = registrationRequirements,
  content = registrationRequirementsData,
}) => {
  return (
    <div className="bg-white dark:bg-[#18191d] rounded-xl sm:rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-3.5 sm:p-5 md:p-6 space-y-3.5 sm:space-y-5 shadow-xs transition-colors duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2.5 sm:pb-3">
        <div className="flex items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#B22234] text-white text-xs font-bold shrink-0">
              {content.header.stepBadge}
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {content.header.title}
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
            {content.header.stepText}
          </span>
        </div>
        {content.header.description && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            {content.header.description}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200/90 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/60 divide-y divide-zinc-200/70 dark:divide-zinc-700 overflow-hidden">
        {requirements.map((item, idx) => (
          <div key={idx} className="p-3.5 sm:p-4">
            <p className="text-xs sm:text-sm font-normal text-zinc-800 dark:text-zinc-200 leading-relaxed">
              {item.title}
            </p>
            {item.desc && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                {item.desc}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Link
            href={content.navigation.back.href}
            className="w-full min-h-[38px] sm:min-h-[42px] px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors inline-flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span>{content.navigation.back.label}</span>
            <span className="hidden sm:inline">{content.navigation.back.subLabel}</span>
          </Link>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onNext}
            className="w-full cursor-pointer"
            icon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            iconPosition="right"
          >
            <span>{content.navigation.next.label}</span>
            <span className="hidden sm:inline">{content.navigation.next.subLabel}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
