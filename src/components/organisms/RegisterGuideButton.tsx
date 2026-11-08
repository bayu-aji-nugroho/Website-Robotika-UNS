/*
-----------------------------------------
nama file: [ RegisterGuideButton.tsx ]
fungsi [ Tombol melayang "Cara Daftar" di landing page yang membuka panduan langkah demi langkah pendaftaran calon anggota, dari syarat hingga pengumuman hasil seleksi ]
-----------------------------------------------
*/

"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, X } from "lucide-react";

interface GuideStep {
  title: string;
  description: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    title: "Baca syarat pendaftaran",
    description: "Buka halaman Daftar, baca syarat dan tahapan seleksi, lalu centang persetujuan.",
  },
  {
    title: "Masuk dengan Akun Google",
    description:
      "Gunakan akun Google yang aktif. Akun ini juga dipakai untuk memilih jadwal wawancara dan melihat hasil seleksi.",
  },
  {
    title: "Isi identitas mahasiswa",
    description:
      "Nama lengkap, NIM, fakultas, program studi, angkatan, dan nomor WhatsApp aktif. Periksa baik-baik karena data yang sudah disimpan tidak dapat diubah.",
  },
  {
    title: "Pilih divisi",
    description:
      "Tentukan divisi pilihan pertama (wajib) dan pilihan kedua (opsional) beserta alasanmu.",
  },
  {
    title: "Upload berkas",
    description:
      "Unggah CV dalam format PDF (maks. 1 MB, template tersedia), link Google Drive bukti upload twibbon & follow Instagram/TikTok, serta link portofolio (wajib untuk divisi Media).",
  },
  {
    title: "Kirim formulir",
    description:
      "Setelah dikirim, simpan nomor registrasimu dan bergabung ke grup WhatsApp calon anggota.",
  },
  {
    title: "Pilih jadwal wawancara",
    description:
      "Di halaman Selesai atau Dashboard Akun, pilih pewawancara, tanggal, dan jam, lalu tekan Accept. Jadwal yang sudah di-accept tidak dapat diubah.",
  },
  {
    title: "Cek hasil seleksi",
    description: "Buka halaman Pengumuman pada tanggal yang ditentukan untuk melihat hasil seleksimu.",
  },
];

export const RegisterGuideButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);

  // Tutup dengan Escape & kunci scroll halaman saat panduan terbuka
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, close]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-label="Lihat cara daftar"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2 pl-3.5 pr-4 py-3 rounded-full bg-[#B22234] hover:bg-[#8B0000] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#B22234]/30 transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B22234] focus-visible:ring-offset-2"
      >
        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span>Cara Daftar</span>
      </motion.button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-guide-title"
          onClick={close}
        >
          <div
            className="w-full sm:max-w-lg max-h-[88vh] flex flex-col bg-white dark:bg-[#18191d] rounded-t-2xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-3">
              <div>
                <h2
                  id="register-guide-title"
                  className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
                >
                  Cara Daftar OPREC Robotika UNS
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Ikuti langkah berikut, semuanya dilakukan di website ini.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup panduan"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-0">
              {GUIDE_STEPS.map((step, idx) => (
                <li key={step.title} className="relative flex gap-3 pb-4 last:pb-0">
                  {idx < GUIDE_STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[13px] top-7 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800"
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#B22234] text-white text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="pt-0.5 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href="/register"
                onClick={close}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#B22234] hover:bg-[#8B0000] text-white text-sm font-semibold transition-colors"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
