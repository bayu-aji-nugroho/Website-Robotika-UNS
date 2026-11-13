/*
-----------------------------------------
nama file: [ AnnouncementResultCard.tsx ] 
fungsi [ Komponen visual kartu pengumuman hasil seleksi OPREC Robotika UNS dengan 4 baris terpusat: Ikon besar, Judul, Pesan motivasi/selamat, dan Tombol aksi ]
-----------------------------------------------
*/

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RotateCw,
  LogIn,
  ExternalLink,
  FileQuestion,
} from "lucide-react";
import {
  ApplicantAnnouncementData,
  signInWithGoogle,
} from "@/src/services";
import { NonSsoLoginOption } from "@/src/components/molecules";

interface AnnouncementResultCardProps {
  isAuthenticated: boolean;
  data: ApplicantAnnouncementData | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const AnnouncementResultCard: React.FC<AnnouncementResultCardProps> = ({
  isAuthenticated,
  data,
  isLoading,
  onRefresh,
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    await signInWithGoogle("/pengumuman");
  };

  // State: Sedang Memuat Data
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-2xl p-8 sm:p-12 text-center shadow-xs max-w-xl mx-auto flex flex-col items-center justify-center">
        <RotateCw className="w-12 h-12 sm:w-14 sm:h-14 text-zinc-500 dark:text-zinc-400 mb-4 animate-spin" />
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Memeriksa status hasil seleksi...
        </p>
      </div>
    );
  }

  // State: Belum Login
  if (!isAuthenticated) {
    return (
      <div className="bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-2xl p-8 sm:p-12 text-center shadow-xs space-y-6 max-w-xl mx-auto flex flex-col items-center justify-center">
        {/* Baris 1: Ikon Besar di Tengah */}
        <div>
          <LogIn className="w-20 h-20 sm:w-24 sm:h-24 text-zinc-700 dark:text-zinc-300 mx-auto" />
        </div>

        {/* Baris 2: Judul */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Masuk untuk Cek Hasil OPREC
          </h2>
        </div>

        {/* Baris 3: Pesan Ringkas */}
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Gunakan akun yang dipakai saat pengisian formulir pendaftaran seleksi (email SSO @student.uns.ac.id).
        </p>

        {/* Baris 4: Tombol Aksi */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-md transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 sm:py-3 bg-[#B22234] hover:bg-[#8B0000] text-white text-xs font-semibold rounded-md transition-colors shadow-xs cursor-pointer min-h-[44px]"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoggingIn ? "Menghubungkan..." : "Masuk dengan Google"}</span>
          </button>
        </div>

        <NonSsoLoginOption redirectTo="/pengumuman" />
      </div>
    );
  }

  // State: Sudah Login tapi Belum Mendaftar
  if (!data || !data.hasRecord) {
    return (
      <div className="bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-2xl p-8 sm:p-12 text-center shadow-xs space-y-6 max-w-xl mx-auto flex flex-col items-center justify-center">
        {/* Baris 1: Ikon Besar di Tengah */}
        <div>
          <FileQuestion className="w-20 h-20 sm:w-24 sm:h-24 text-amber-600 dark:text-amber-400 mx-auto" />
        </div>

        {/* Baris 2: Judul */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Data Pendaftaran Tidak Ditemukan
          </h2>
        </div>

        {/* Baris 3: Pesan Ringkas */}
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Akun Google ini belum mengirimkan formulir pendaftaran OPREC UKM Robotika UNS.
        </p>

        {/* Baris 4: Tombol Aksi */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-md transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-[#B22234] hover:bg-[#8B0000] text-white text-xs font-semibold rounded-md transition-colors shadow-xs min-h-[44px]"
          >
            <span>Daftar Sekarang</span>
          </Link>
        </div>
      </div>
    );
  }

  // Konfigurasi 3 Tampilan Status Berdasarkan Permintaan Pengguna:
  // Baris 1: Logo mentah [waiting, lolos, tidak lolos] di tengah dan besar tanpa dekorasi bingkai
  // Baris 2: Title [Lolos Seleksi, ...] di tengah
  // Baris 3: Kata-kata motivasi dan selamat ringkas
  const statusConfig = {
    lolos: {
      icon: (
        <CheckCircle2 className="w-20 h-20 sm:w-24 sm:h-24 text-emerald-600 dark:text-emerald-400 mx-auto" />
      ),
      title: "Lolos Seleksi",
      message: (
        <>
          Selamat! Anda lolos seleksi
          {data.acceptedDivision ? (
            <>
              {" "}pada divisi{" "}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {data.acceptedDivision}
              </span>
            </>
          ) : null}
          .
        </>
      ),
    },
    tidak_lolos: {
      icon: (
        <XCircle className="w-20 h-20 sm:w-24 sm:h-24 text-zinc-500 dark:text-zinc-400 mx-auto" />
      ),
      title: "Belum Lolos Seleksi",
      message: <>Terima kasih telah berpartisipasi. Tetap semangat!</>,
    },
    belum_ditentukan: {
      icon: (
        <Clock className="w-20 h-20 sm:w-24 sm:h-24 text-amber-600 dark:text-amber-400 mx-auto" />
      ),
      title: "Menunggu Hasil Seleksi",
      message: <>Berkas Anda sedang dalam proses peninjauan.</>,
    },
  };

  const currentConfig = statusConfig[data.status] || statusConfig.belum_ditentukan;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-2xl p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto">
        {/* Baris 1: Logo di tengah dan besar */}
        <div>{currentConfig.icon}</div>

        {/* Baris 2: Title di tengah */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {currentConfig.title}
          </h2>
          <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
            {data.fullName} ({data.nim})
          </p>
        </div>

        {/* Baris 3: Kata-kata motivasi dan selamat ringkas */}
        <div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md mx-auto">
            {currentConfig.message}
          </p>
        </div>

        {/* Baris 4: Tombol aksi sesuai status */}
        {/* jika pertimbangan: [Kembali ke Beranda] dan [Refresh] */}
        {/* jika gagal: hanya [Kembali ke Beranda] */}
        {/* jika diterima: [Kembali ke Beranda] dan [Gabung Grup] */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-md transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          {data.status === "lolos" && (
            <a
              href="https://chat.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-[#B22234] hover:bg-[#8B0000] text-white text-xs font-semibold rounded-md transition-colors shadow-xs min-h-[44px]"
            >
              <span>Gabung Grup</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {data.status === "belum_ditentukan" && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-[#B22234] hover:bg-[#8B0000] text-white text-xs font-semibold rounded-md transition-colors shadow-xs min-h-[44px] cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
