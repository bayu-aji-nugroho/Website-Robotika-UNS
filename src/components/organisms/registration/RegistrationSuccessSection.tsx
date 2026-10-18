/*
-----------------------------------------
nama file: [ RegistrationSuccessSection.tsx ] 
fungsi [ Komponen tampilan konfirmasi sukses pendaftaran yang menyajikan tautan grup WhatsApp resmi dan tanda terima ringkasan data registrasi ]
-----------------------------------------------
*/

"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Printer } from "lucide-react";
import { getFacultyFromNim, SubmissionReceiptData } from "@/src/services";

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export interface RegistrationSuccessSectionProps {
  data: SubmissionReceiptData;
  onReset?: () => void;
}

export const RegistrationSuccessSection: React.FC<RegistrationSuccessSectionProps> = ({
  data,
}) => {
  const waGroupUrl = "https://chat.whatsapp.com/invite/robotika-uns-2026";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl sm:rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 print:hidden transition-colors duration-200">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <WhatsAppIcon />
          </div>
          <div className="space-y-0.5 min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Grup WhatsApp Calon Anggota
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal">
              Gabung grup resmi untuk pengumuman jadwal seleksi dan koordinasi panitia.
            </p>
          </div>
        </div>

        <div className="shrink-0 pt-1 sm:pt-0">
          <a
            href={waGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer w-full sm:w-auto"
          >
            <WhatsAppIcon />
            <span>Gabung Grup</span>
          </a>
        </div>
      </div>

      <div className="bg-white dark:bg-[#18191d] rounded-xl sm:rounded-2xl border border-zinc-200/90 dark:border-zinc-800 overflow-hidden shadow-xs print:border-none print:shadow-none transition-colors duration-200">
        <div className="p-3.5 sm:p-5 md:p-7 border-b border-zinc-100 dark:border-zinc-800 space-y-2 sm:space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#16a34a] dark:text-[#4ade80]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                Bukti Pendaftaran Resmi
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 print:hidden">Sesi 5 dari 5</span>
          </div>

          <h3 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
            Tanda Terima Registrasi Calon Anggota
          </h3>
          <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400">
            Simpan bukti pendaftaran ini sebagai arsip data registrasi Anda di Robotika Universitas Sebelas Maret.
          </p>
        </div>

        <div className="p-3.5 sm:p-5 md:p-7 space-y-3.5 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-[11px] uppercase tracking-wider block font-mono">
                Nama Lengkap
              </span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">{data.fullName}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-[11px] uppercase tracking-wider block font-mono">
                Nomor Induk Mahasiswa (NIM)
              </span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono tracking-wide text-xs sm:text-sm">{data.nim}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-[11px] uppercase tracking-wider block font-mono">
                Fakultas
              </span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                {data.fakultas || data.faculty || getFacultyFromNim(data.nim)}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-[11px] uppercase tracking-wider block font-mono">
                Program Studi dan Angkatan
              </span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                {data.prodi} {data.angkatan ? `(Angkatan ${data.angkatan})` : ""}
              </p>
            </div>

            <div className="space-y-0.5 sm:col-span-2">
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-[11px] uppercase tracking-wider block font-mono">
                Nomor WhatsApp Aktif
              </span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">{data.whatsapp}</p>
            </div>

            {data.email && (
              <div className="space-y-0.5 sm:col-span-2">
                <span className="text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-[11px] uppercase tracking-wider block font-mono">
                  Alamat Email Mahasiswa
                </span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">{data.email}</p>
              </div>
            )}

            <div className="sm:col-span-2 pt-2.5 sm:pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-[11px] uppercase tracking-wider block font-mono">
                Pilihan Divisi
              </span>
              <p className="font-bold text-[#B22234] dark:text-red-400 text-xs sm:text-sm">
                Pilihan Pertama: {data.primaryDivision}
              </p>
              {data.secondaryDivision && (
                <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                  Pilihan Kedua: {data.secondaryDivision}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1">
              <span className="text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-[11px] uppercase tracking-wider block font-mono">
                Waktu Pengiriman
              </span>
              <p className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">{data.submittedAt}</p>
            </div>
          </div>

          <div className="pt-4 sm:pt-5 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto min-h-[38px] sm:min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <span>Cetak Bukti Pendaftaran</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto min-h-[38px] sm:min-h-[42px] inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#B22234] hover:bg-[#8B0000] text-white text-xs font-semibold transition-colors"
            >
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    </div>

  );
};
