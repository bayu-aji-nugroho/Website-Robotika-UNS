/*
-----------------------------------------
nama file: [ ConfirmationModal.tsx ] 
fungsi [ Komponen modal pop-up konfirmasi simpan permanen untuk memastikan data yang akan dikunci ke database telah diperiksa oleh pengguna ]
-----------------------------------------------
*/

"use client";

import React, { useEffect } from "react";
import { Button } from "@/src/components/atoms";
import { AlertTriangle, Lock, Loader2, X } from "lucide-react";

export interface ConfirmationDetailItem {
  label: string;
  value: string | React.ReactNode;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  warningNote?: string;
  details?: ConfirmationDetailItem[];
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  warningNote,
  details,
  confirmText = "Ya, Simpan Permanen",
  cancelText = "Periksa Kembali",
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  // Tutup dengan tombol Escape jika tidak sedang menyimpan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#18191d] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-900/40">
              <Lock className="w-5 h-5" />
            </div>
            <h3
              id="confirm-modal-title"
              className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]"
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {description}
          </p>

          {/* Warning Note (Opsional, hanya tampil jika diberikan) */}
          {warningNote && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300">
              <AlertTriangle className="w-4 h-4 text-[#B22234] dark:text-[#ff6b7d] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block uppercase tracking-wider text-[10px]">
                  Perhatian Penting
                </span>
                <p className="leading-relaxed">{warningNote}</p>
              </div>
            </div>
          )}

          {/* Summary / Preview Data */}
          {details && details.length > 0 && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block font-mono">
                Ringkasan Data:
              </span>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {details.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <dt className="text-zinc-500 dark:text-zinc-400 font-mono text-[10px] uppercase">
                      {item.label}
                    </dt>
                    <dd className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 grid grid-cols-2 gap-2.5 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full cursor-pointer"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full cursor-pointer"
            icon={
              isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )
            }
            iconPosition="right"
          >
            {isLoading ? "Menyimpan..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
