/*
-----------------------------------------
nama file: [ AnnouncementPendingCard.tsx ]
fungsi [ Kartu informasi yang tampil sebelum waktu pengumuman hasil seleksi tiba: menampilkan tanggal & jam pengumuman (WIB) atau info bahwa tanggal belum ditentukan ]
-----------------------------------------------
*/

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarClock, RotateCw } from "lucide-react";

const TIME_ZONE = "Asia/Jakarta";

const formatAnnouncement = (iso: string) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("id-ID", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("id-ID", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" });
  return { date, time };
};

export interface AnnouncementPendingCardProps {
  announcementAt: string | null;
  onRefresh?: () => void;
}

export const AnnouncementPendingCard: React.FC<AnnouncementPendingCardProps> = ({
  announcementAt,
  onRefresh,
}) => {
  const formatted = announcementAt ? formatAnnouncement(announcementAt) : null;

  return (
    <div className="bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-xl shadow-xs p-8 sm:p-12 text-center space-y-5 flex flex-col items-center">
      <CalendarClock className="w-14 h-14 text-[#B22234]" />
      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Hasil Seleksi Belum Diumumkan
        </h2>
        {formatted ? (
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Hasil seleksi akan diumumkan pada{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">{formatted.date}</strong> pukul{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">{formatted.time} WIB</strong>.
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Tanggal pengumuman hasil seleksi akan segera diinformasikan. Pantau terus grup WhatsApp calon
            anggota dan halaman ini.
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-md transition-colors cursor-pointer min-h-[44px]"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </button>
        )}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#B22234] hover:bg-[#8B0000] text-white text-xs font-semibold rounded-md transition-colors shadow-xs min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
};
