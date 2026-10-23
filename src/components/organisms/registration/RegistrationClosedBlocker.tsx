/*
-----------------------------------------
nama file: [ RegistrationClosedBlocker.tsx ] 
fungsi [ Komponen pemblokir halaman pendaftaran (Page Blocker) saat status OPREC ditutup di basis data, menampilkan badge status dinamis dan panduan bagi calon pendaftar ]
-----------------------------------------------
*/

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, ExternalLink } from "lucide-react";
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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Badge Status Pill sesuai Referensi Desain */}
      <div className="flex justify-center sm:justify-start">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-[#e4e4e7] dark:border-zinc-800/80 bg-white dark:bg-[#1a1b20] text-xs shadow-xs">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#B22234] dark:bg-[#C52233] text-white">
            OPREC
          </span>
          <span className="text-[#52525b] dark:text-zinc-300 font-medium text-xs">
            {label}
          </span>
        </div>
      </div>

      {/* Kartu Utama Blocker */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#16171c] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="relative space-y-6">
          {/* Ikon & Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-[#B22234] dark:text-[#EE3B47]">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Pendaftaran Calon Anggota Ditutup
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                Pendaftaran calon anggota baru saat ini sedang ditutup. Pantau informasi terbaru dan jadwal pembukaan pendaftaran berikutnya melalui Instagram resmi UKM Robotika UNS.
              </p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <AdminWhatsAppButton
              variant="button"
              label="Tanya Admin via WhatsApp"
              customMessage="Halo Admin OPREC UKM Robotika UNS, saya ingin bertanya mengenai jadwal dan informasi pendaftaran calon anggota baru..."
            />

            <a
              href="https://www.instagram.com/uns_robotika/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#B22234] hover:bg-[#8B0000] dark:bg-[#C52233] dark:hover:bg-[#B22234] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <InstagramIcon />
              <span>Info di Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>

          {/* Kanal Informasi Tambahan */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span>UKM Robotika Universitas Sebelas Maret (UNS)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
