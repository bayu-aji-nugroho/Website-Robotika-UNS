/*
-----------------------------------------
nama file: [ RegistrationClosedBlocker.tsx ] 
fungsi [ Komponen pemblokir halaman pendaftaran (Page Blocker) saat status OPREC ditutup di basis data, menampilkan badge status dinamis dan panduan bagi calon pendaftar ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { CalendarClock } from "lucide-react";
import { AdminWhatsAppButton } from "@/src/components/molecules";

interface RegistrationClosedBlockerProps {
  label?: string;
}

const InstagramIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const RegistrationClosedBlocker: React.FC<RegistrationClosedBlockerProps> = ({
  label = "Informasi pendaftaran segera diumumkan",
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Kartu Utama Blocker */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#16171c] p-6 sm:p-8 shadow-xs">
        <div className="space-y-5">
          {/* Logo & Status */}
          <div className="flex items-center justify-between gap-4">
            <CalendarClock className="w-6 h-6" />
            {label && label !== "Informasi pendaftaran segera diumumkan" && (
              <span className="text-xs text-[#71717a] dark:text-zinc-400 font-medium">
                {label}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181b] dark:text-zinc-100 tracking-tight font-['League_Spartan',sans-serif]">
              Pendaftaran Ditutup
            </h2>
            <p className="text-xs sm:text-sm text-[#52525b] dark:text-zinc-400 max-w-lg leading-relaxed">
              Pantau jadwal pembukaan pendaftaran berikutnya di Instagram resmi @uns_robotika.
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <a
              href="https://www.instagram.com/uns_robotika/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#B22234] hover:bg-[#8B0000] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <InstagramIcon />
              <span>Instagram @uns_robotika</span>
            </a>

            <AdminWhatsAppButton
              variant="outline"
              label="WhatsApp Panitia"
              customMessage="Halo Admin OPREC UKM Robotika UNS, saya ingin bertanya mengenai jadwal pendaftaran calon anggota baru..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
