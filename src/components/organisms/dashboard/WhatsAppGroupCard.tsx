/*
-----------------------------------------
nama file: [ WhatsAppGroupCard.tsx ]
fungsi [ Kartu pengingat bergabung ke grup WhatsApp calon anggota di Dashboard Akun, agar pendaftar yang lupa bergabung setelah submit tetap bisa masuk kapan saja ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { ExternalLink, Users } from "lucide-react";
import { WhatsAppIcon } from "@/src/components/atoms";
import { CANDIDATE_WA_GROUP_URL } from "@/data/registration";

export const WhatsAppGroupCard: React.FC = () => (
  <div className="rounded-xl border border-[#25D366]/40 bg-[#25D366]/[0.07] dark:bg-[#25D366]/10 p-4 sm:p-5 print:hidden transition-colors">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Users className="w-5 h-5" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Wajib gabung grup WhatsApp calon anggota</p>
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            Info jadwal wawancara, perubahan agenda, dan pengumuman OPREC dibagikan di grup ini. Belum gabung? Masuk
            sekarang.
          </p>
        </div>
      </div>
      <a
        href={CANDIDATE_WA_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1faa4f] text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs shrink-0 min-h-[44px]"
      >
        <WhatsAppIcon className="w-4 h-4" />
        <span>Gabung Grup WhatsApp</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
);
