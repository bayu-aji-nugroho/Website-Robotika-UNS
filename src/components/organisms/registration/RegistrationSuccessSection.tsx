/*
-----------------------------------------
nama file: [ RegistrationSuccessSection.tsx ] 
fungsi [ Komponen tampilan konfirmasi pendaftaran berformat tanda terima resmi akademis UKM Robotika UNS dengan tata letak dokumen sah, instruksi tindak lanjut, dan dukungan cetak arsip ]
-----------------------------------------------
*/

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Printer, Copy, Check, FileText, ArrowLeft } from "lucide-react";
import { getFacultyFromNim, SubmissionReceiptData } from "@/src/services";
import { WhatsAppIcon } from "@/src/components/atoms";
import { ADMIN_WA_CONFIG } from "@/data/registration";

export interface RegistrationSuccessSectionProps {
  data: SubmissionReceiptData;
  onReset?: () => void;
}

export const RegistrationSuccessSection: React.FC<RegistrationSuccessSectionProps> = ({
  data,
}) => {
  const [copied, setCopied] = useState(false);
  const waGroupUrl = "https://chat.whatsapp.com/invite/robotika-uns-2026";

  const handleCopyId = async () => {
    if (!data.registrationId) return;
    try {
      await navigator.clipboard.writeText(data.registrationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback jika clipboard API diblokir peramban
      setCopied(false);
    }
  };

  const detectedFaculty = data.fakultas || data.faculty || getFacultyFromNim(data.nim);

  return (
    <div className="space-y-4 sm:space-y-5 max-w-3xl mx-auto">
      {/* 1. Bagian Petunjuk Langkah Selanjutnya & Tautan Komunikasi WhatsApp (Di Posisi Teratas) */}
      <div className="bg-white dark:bg-[#16171a] rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 space-y-3.5 print:hidden shadow-xs transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-[#25D366] shrink-0 mt-0.5">
            <WhatsAppIcon className="w-5 h-5" />
          </div>
          <div className="space-y-1 min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-space-grotesk)] tracking-tight">
              Instruksi Selanjutnya: Wajib Masuk Grup WhatsApp
            </h2>
            <ol className="list-decimal list-inside space-y-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <li>
                <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">Bergabung ke grup WhatsApp resmi</strong> calon anggota untuk jadwal seleksi, pembagian kelompok, dan tes teknis.
              </li>
              <li>
                <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">Simpan atau cetak</strong> tanda terima pendaftaran di bawah ini sebagai arsip pribadi.
              </li>
            </ol>
          </div>
        </div>

        <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <a
            href={waGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1faa4f] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Masuk ke Grup WhatsApp Calon Anggota</span>
          </a>

          <a
            href={ADMIN_WA_CONFIG.getUrl(
              `Halo Admin OPREC UKM Robotika UNS, saya sudah mendaftar dengan No. Registrasi ${data.registrationId || "ROB-UNS-2026"}. Saya ingin bertanya...`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
            <span>Tanya Admin OPREC</span>
          </a>
        </div>
      </div>

      {/* 2. Kartu Dokumen Tanda Terima Resmi (Berada di Bawah Link WA) */}
      <div className="bg-white dark:bg-[#16171a] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm print:border-none print:shadow-none print:p-0 overflow-hidden transition-colors">
        {/* Kop Dokumen Akademis */}
        <div className="p-4 sm:p-6 md:p-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 print:bg-white print:border-b-2 print:border-black">
          <div className="space-y-1">
            <p className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 print:text-black">
              UKM Robotika Universitas Sebelas Maret
            </p>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 print:text-black tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Tanda Terima Pendaftaran Calon Anggota
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 print:text-zinc-700">
              Open Recruitment Periode 2026 / 2027
            </p>
          </div>

          {/* Baris Meta Dokumen: Nomor Registrasi & Tanggal */}
          <div className="mt-4 pt-3.5 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 print:text-black">
            <div className="flex items-center gap-2">
              <span className="font-medium text-zinc-500 dark:text-zinc-400">No. Registrasi:</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded print:bg-transparent print:p-0 print:text-black">
                {data.registrationId || "REG-2026-UNS"}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                title="Salin nomor registrasi"
                className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors print:hidden cursor-pointer ml-0.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] sm:text-xs">
              <span className="font-medium text-zinc-500 dark:text-zinc-400">Waktu Rekam: </span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200 print:text-black">
                {data.submittedAt || "Tercatat di server"}
              </span>
            </div>
          </div>
        </div>

        {/* Isi Rincian Dokumen Pendaftar */}
        <div className="p-4 sm:p-6 md:p-7 space-y-6">
          {/* Kelompok Identitas Calon Anggota */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-3.5 font-[family-name:var(--font-space-grotesk)]">
              Data Identitas Mahasiswa
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs sm:text-sm">
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400 text-xs">Nama Lengkap</dt>
                <dd className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {data.fullName}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500 dark:text-zinc-400 text-xs">Nomor Induk Mahasiswa (NIM)</dt>
                <dd className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {data.nim}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500 dark:text-zinc-400 text-xs">Fakultas</dt>
                <dd className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {detectedFaculty}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500 dark:text-zinc-400 text-xs">Program Studi & Angkatan</dt>
                <dd className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {data.prodi} {data.angkatan ? `(Angkatan ${data.angkatan})` : ""}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500 dark:text-zinc-400 text-xs">Nomor WhatsApp Aktif</dt>
                <dd className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {data.whatsapp}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500 dark:text-zinc-400 text-xs">Alamat Email Mahasiswa</dt>
                <dd className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {data.email || "Terdaftar via Google SSO"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Kelompok Pilihan Divisi */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-3.5 font-[family-name:var(--font-space-grotesk)]">
              Pilihan Divisi Robotika
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 sm:p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block">
                  Pilihan Pertama (Utama)
                </span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {data.primaryDivision}
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block">
                  Pilihan Kedua (Alternatif)
                </span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {data.secondaryDivision || "Tidak memilih pilihan kedua"}
                </p>
              </div>
            </div>
          </div>

          {/* Kelompok Berkas Terlampir */}
          {data.fileName && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-3 font-[family-name:var(--font-space-grotesk)]">
                Dokumen Terlampir
              </h2>
              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs">
                <FileText className="w-4 h-4 text-[#B22234] shrink-0" />
                <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                  {data.fileName}
                </span>
                {data.fileSizeFormatted && (
                  <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px] shrink-0">
                    ({data.fileSizeFormatted})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Catatan Legalitas Dokumen */}
          <div className="pt-2 text-[11px] text-zinc-500 dark:text-zinc-400 border-t border-dashed border-zinc-200 dark:border-zinc-800 leading-relaxed">
            Dokumen ini diterbitkan secara elektronik oleh Sistem Pendaftaran Open Recruitment UKM Robotika Universitas Sebelas Maret dan sah digunakan sebagai tanda bukti keikutsertaan seleksi tanpa tanda tangan basah.
          </div>
        </div>
      </div>

      {/* Baris Tombol Aksi Navigasi & Cetak */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-1 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          <span>Cetak / Simpan Tanda Terima (PDF)</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#B22234] hover:bg-[#8B0000] text-white text-xs sm:text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
};
