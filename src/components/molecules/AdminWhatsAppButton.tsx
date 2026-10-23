/*
-----------------------------------------
nama file: [ AdminWhatsAppButton.tsx ] 
fungsi [ Komponen kartu bantuan dan tombol kontak WhatsApp Admin OPREC untuk calon anggota baru dengan tata letak ringkas, elegan, dan bebas kata berlebih ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { WhatsAppIcon } from "../atoms/WhatsAppIcon";
import { ADMIN_WA_CONFIG } from "@/data/registration";
import { ExternalLink } from "lucide-react";

export interface AdminWhatsAppButtonProps {
  variant?: "card" | "button";
  customMessage?: string;
  className?: string;
  label?: string;
}

export const AdminWhatsAppButton: React.FC<AdminWhatsAppButtonProps> = ({
  variant = "card",
  customMessage,
  className = "",
  label,
}) => {
  const waUrl = ADMIN_WA_CONFIG.getUrl(customMessage);

  if (variant === "card") {
    return (
      <div
        className={`print:hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-[#18191d] p-3.5 sm:p-4 shadow-2xs transition-colors duration-200 ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-center text-[#25D366] shrink-0">
              <WhatsAppIcon className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-space-grotesk)]">
                Punya pertanyaan seputar pendaftaran?
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Hubungi narahubung panitia OPREC Robotika UNS
              </p>
            </div>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#1faa4f] text-white text-xs sm:text-sm font-semibold transition-colors shadow-2xs shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>{label || "Hubungi Admin"}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>
    );
  }

  // Variant "button" untuk tombol inline mandiri
  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1faa4f] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer ${className}`}
    >
      <WhatsAppIcon className="w-4 h-4" />
      <span>{label || "Tanya Admin via WhatsApp"}</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
    </a>
  );
};
