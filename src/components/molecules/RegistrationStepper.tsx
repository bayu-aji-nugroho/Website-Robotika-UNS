/*
-----------------------------------------
nama file: [ RegistrationStepper.tsx ] 
fungsi [ Komponen indikator tahapan formulir pendaftaran bertingkat (multi-step stepper) yang menampilkan progres progresif responsif baik pada tampilan bilah mobile maupun node lingkaran desktop dengan validasi akses langkah. ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { Check } from "lucide-react";

export interface RegistrationStepItem {
  id: number;
  title: string;
  shortTitle: string;
  description?: string;
}

export interface RegistrationStepperProps {
  currentStep: number;
  steps: RegistrationStepItem[];
  maxReachableStep: number;
  onStepClick: (stepId: number) => void;
  className?: string;
}

export const RegistrationStepper: React.FC<RegistrationStepperProps> = ({
  currentStep,
  steps,
  maxReachableStep,
  onStepClick,
  className = "",
}) => {
  const currentStepItem = steps.find((s) => s.id === currentStep) || steps[0];

  return (
    <nav
      aria-label="Tahapan Formulir Pendaftaran"
      className={`bg-white dark:bg-[#18191d] rounded-xl sm:rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-3.5 sm:p-5 shadow-xs print:hidden transition-colors duration-200 ${className}`}
    >
      <div className="sm:hidden space-y-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
            Langkah {currentStep} dari {steps.length}
          </span>
          <span className="text-zinc-300 dark:text-zinc-600 text-xs shrink-0">·</span>
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
            {currentStepItem.title}
          </span>
        </div>

        <div
          className="grid grid-cols-5 gap-1.5"
          role="tablist"
          aria-label="Tahapan pendaftaran"
        >
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isAccessible = step.id <= maxReachableStep;

            return (
              <button
                key={`mobile-step-${step.id}`}
                type="button"
                disabled={!isAccessible}
                onClick={() => onStepClick(step.id)}
                className="min-h-[44px] px-0.5 flex items-center justify-center w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B22234] rounded cursor-pointer disabled:cursor-not-allowed"
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Langkah ${step.id}: ${step.title}`}
              >
                <span
                  className={`w-full h-1.5 rounded-full transition-all ${
                    isCurrent
                      ? "bg-[#B22234]"
                      : isCompleted
                      ? "bg-[#B22234]/60"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:block relative pt-1 pb-0.5">
        <div
          className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-zinc-200 dark:bg-zinc-700 -translate-y-1/2 z-0"
          aria-hidden="true"
        >
          <div
            className="h-full bg-[#B22234] transition-all duration-300 ease-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        <ol className="relative z-10 flex items-start w-full">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isAccessible = step.id <= maxReachableStep;

            return (
              <li
                key={`desktop-step-${step.id}`}
                className="flex-1 flex flex-col items-center"
              >
                <button
                  type="button"
                  disabled={!isAccessible}
                  onClick={() => onStepClick(step.id)}
                  className={`group flex flex-col items-center w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B22234] focus-visible:ring-offset-2 rounded-lg py-1 transition-all ${
                    isAccessible && !isCurrent
                      ? "cursor-pointer"
                      : isCurrent
                      ? "cursor-default"
                      : "cursor-not-allowed opacity-60"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Langkah ${step.id}: ${step.title}`}
                >
                  <span
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                      isCurrent
                        ? "bg-[#B22234] text-white ring-4 ring-[#FCF2F3] dark:ring-red-950/60 shadow-xs"
                        : isCompleted
                        ? "bg-[#B22234] text-white group-hover:bg-[#8B0000]"
                        : "bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-400 dark:text-zinc-500 group-hover:border-zinc-400 dark:group-hover:border-zinc-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </span>

                  <span
                    className={`mt-2 text-xs text-center transition-colors px-1 whitespace-nowrap ${
                      isCurrent
                        ? "font-bold text-[#B22234] dark:text-red-400"
                        : isCompleted
                        ? "font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white"
                        : "font-medium text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {step.shortTitle}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>

  );
};
