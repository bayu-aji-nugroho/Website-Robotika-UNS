/*
-----------------------------------------
nama file: [ AccountDashboard.tsx ]
fungsi [ Komponen isi dashboard akun yang menampilkan detail formulir pendaftaran milik pengguna: identitas, pilihan divisi beserta alasan, berkas, dan tautan, lengkap dengan status belum login, belum mendaftar, dan gagal memuat ]
-----------------------------------------------
*/

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  FileQuestion,
  FileText,
  Link2,
  LogIn,
  RotateCw,
} from "lucide-react";
import { Skeleton } from "@/src/components/atoms";
import { InterviewSchedulePicker } from "@/src/components/organisms/interview/InterviewSchedulePicker";
import {
  DivisionSelectionCategory,
  GoogleAuthUser,
  RegistrationProgressData,
  SupabaseRegistrationRecord,
  getRegistrationProgress,
  resolveFacultyName,
  signInWithGoogle,
} from "@/src/services";

export interface AccountDashboardProps {
  user: GoogleAuthUser | null;
  progress: RegistrationProgressData | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const CARD_CLASS =
  "bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-xl shadow-xs";
const PRIMARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#B22234] hover:bg-[#8B0000] text-white text-xs font-semibold rounded-md transition-colors shadow-xs cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#B22234] focus-visible:ring-offset-2 focus-visible:outline-hidden";
const SECONDARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-md transition-colors cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#B22234] focus-visible:ring-offset-2 focus-visible:outline-hidden";

const CATEGORY_LABEL: Record<DivisionSelectionCategory, string> = {
  teknis: "Teknis",
  "non-teknis": "Non-Teknis",
};

const formatDateTime = (value?: string | null): string | null => {
  if (!value) return null;
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-3.5">
    {children}
  </h2>
);

const DetailItem: React.FC<{ label: string; value?: string | null; mono?: boolean }> = ({
  label,
  value,
  mono = false,
}) => (
  <div className="min-w-0">
    <dt className="text-zinc-500 dark:text-zinc-400 text-xs">{label}</dt>
    <dd
      className={`font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 break-words ${mono ? "font-mono" : ""}`}
    >
      {value || "-"}
    </dd>
  </div>
);

const DivisionChoice: React.FC<{
  label: string;
  name?: string | null;
  category?: DivisionSelectionCategory | null;
  reason?: string | null;
}> = ({ label, name, category, reason }) => (
  <div className="p-3 sm:p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block">
      {label}
      {name && category ? ` · ${CATEGORY_LABEL[category]}` : ""}
    </span>
    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">{name || "-"}</p>
    {reason && (
      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed whitespace-pre-line break-words">
        {reason}
      </p>
    )}
  </div>
);

const LinkRow: React.FC<{ label: string; url: string }> = ({ label, url }) => (
  <div className="flex items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs">
    <div className="flex items-center gap-2 min-w-0">
      <Link2 className="w-4 h-4 text-[#B22234] shrink-0" />
      <div className="min-w-0">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-[11px]">{label}</p>
        <p className="text-zinc-500 dark:text-zinc-400 font-mono text-[10px] sm:text-[11px] truncate">
          {url}
        </p>
      </div>
    </div>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white px-3 py-1.5 rounded-md bg-[#B22234] hover:bg-[#8B0000] transition-colors shrink-0 shadow-xs"
    >
      <span>Buka</span>
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  </div>
);

const MessageCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  message: string;
  children: React.ReactNode;
}> = ({ icon, title, message, children }) => (
  <div className={`${CARD_CLASS} p-8 sm:p-12 text-center space-y-5 flex flex-col items-center`}>
    {icon}
    <div className="space-y-1.5">
      <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-3">{children}</div>
  </div>
);

const DashboardSkeleton: React.FC = () => (
  <div className={`${CARD_CLASS} p-4 sm:p-6 space-y-6`} role="status" aria-label="Memuat data pendaftaran">
    <div className="space-y-2.5">
      <Skeleton className="h-3 w-32 rounded" />
      <Skeleton className="h-6 w-56 rounded" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-9 w-full rounded" />
      ))}
    </div>
    <Skeleton className="h-24 w-full rounded-lg" />
  </div>
);

const RegistrationDetails: React.FC<{
  user: GoogleAuthUser;
  record: SupabaseRegistrationRecord;
}> = ({ user, record }) => {
  const [copied, setCopied] = useState(false);
  const [cvError, setCvError] = useState(false);
  const isSubmitted = record.status === "submitted";
  const submittedAt = formatDateTime(record.submitted_at);

  const handleCopyCode = async () => {
    if (!record.registration_code) return;
    try {
      await navigator.clipboard.writeText(record.registration_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  // Signed URL CV hanya berlaku 20 menit, jadi selalu minta yang baru saat dibuka.
  // Tab dibuka lebih dulu agar tidak diblokir popup blocker setelah proses async.
  const handleOpenCv = async () => {
    setCvError(false);
    const tab = window.open("", "_blank");
    const latest = await getRegistrationProgress();
    const url = latest.record?.cv_file_url;
    if (tab && url) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      tab?.close();
      setCvError(true);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className={`${CARD_CLASS} p-4 sm:p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
              Dashboard Akun
            </p>
            <p className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1 break-words">
              {record.full_name || user.fullName || "Pendaftar"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 break-all">
              {user.email || record.user_email}
            </p>
          </div>
          <span
            className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
              isSubmitted
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-400"
                : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-400"
            }`}
          >
            {isSubmitted ? "Sudah Dikirim" : "Belum Selesai"}
          </span>
        </div>

        {isSubmitted ? (
          <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-zinc-500 dark:text-zinc-400">No. Registrasi:</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {record.registration_code || "-"}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                aria-label="Salin nomor registrasi"
                className="p-1 -m-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {submittedAt && <span className="text-[11px] sm:text-xs">Dikirim {submittedAt}</span>}
          </div>
        ) : (
          <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Formulir Anda belum dikirim. Selesaikan agar pendaftaran diproses.
            </p>
            <Link href="/register" className={PRIMARY_BUTTON_CLASS}>
              <span>Lanjutkan Pendaftaran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      <div className={`${CARD_CLASS} p-4 sm:p-6 space-y-6`}>
        <div>
          <SectionTitle>Data Identitas Mahasiswa</SectionTitle>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs sm:text-sm">
            <DetailItem label="Nama Lengkap" value={record.full_name} />
            <DetailItem label="Nomor Induk Mahasiswa (NIM)" value={record.nim} mono />
            <DetailItem label="Fakultas" value={resolveFacultyName(record.fakultas, record.prodi)} />
            <DetailItem label="Program Studi" value={record.prodi} />
            <DetailItem label="Angkatan" value={record.angkatan} />
            <DetailItem label="Nomor WhatsApp Aktif" value={record.whatsapp} mono />
          </dl>
        </div>

        <div>
          <SectionTitle>Pilihan Divisi Robotika</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DivisionChoice
              label="Pilihan Pertama"
              name={record.primary_division_name}
              category={record.primary_division_category}
              reason={record.primary_reason}
            />
            <DivisionChoice
              label="Pilihan Kedua"
              name={record.secondary_division_name}
              category={record.secondary_division_category}
              reason={record.secondary_reason}
            />
          </div>
        </div>

        <div>
          <SectionTitle>Berkas &amp; Tautan</SectionTitle>
          {record.cv_file_name || record.twibbon_url || record.portfolio_url ? (
            <div className="space-y-2">
              {record.cv_file_name && (
                <div className="flex items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#B22234] shrink-0" />
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                      {record.cv_file_name}
                    </span>
                  </div>
                  {record.cv_storage_path && (
                    <button
                      type="button"
                      onClick={handleOpenCv}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white px-3 py-1.5 rounded-md bg-[#B22234] hover:bg-[#8B0000] transition-colors shrink-0 shadow-xs cursor-pointer"
                    >
                      <span>Buka</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
              {cvError && (
                <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>CV gagal dibuka. Coba lagi beberapa saat.</span>
                </p>
              )}
              {record.twibbon_url && (
                <LinkRow label="Bukti Upload Twibbon & Follow Medsos" url={record.twibbon_url} />
              )}
              {record.portfolio_url && (
                <LinkRow label="Portofolio Karya" url={record.portfolio_url} />
              )}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Belum ada berkas yang diunggah.</p>
          )}
        </div>
      </div>

      {isSubmitted && <InterviewSchedulePicker />}

      {isSubmitted && (
        <div className="flex justify-end">
          <Link href="/pengumuman" className={SECONDARY_BUTTON_CLASS}>
            <span>Lihat Hasil Seleksi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export const AccountDashboard: React.FC<AccountDashboardProps> = ({
  user,
  progress,
  isLoading,
  onRefresh,
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    await signInWithGoogle("/dashboard");
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return (
      <MessageCard
        icon={<LogIn className="w-14 h-14 text-zinc-700 dark:text-zinc-300" />}
        title="Masuk untuk Melihat Dashboard"
        message="Gunakan Akun Google yang didaftarkan saat pengisian formulir pendaftaran."
      >
        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoggingIn}
          className={PRIMARY_BUTTON_CLASS}
        >
          <LogIn className="w-4 h-4" />
          <span>{isLoggingIn ? "Menghubungkan..." : "Masuk dengan Google"}</span>
        </button>
      </MessageCard>
    );
  }

  if (progress?.error) {
    return (
      <MessageCard
        icon={<AlertCircle className="w-14 h-14 text-red-600 dark:text-red-400" />}
        title="Data Gagal Dimuat"
        message="Data pendaftaran Anda tidak dapat diambil saat ini. Silakan coba lagi."
      >
        <button type="button" onClick={onRefresh} className={PRIMARY_BUTTON_CLASS}>
          <RotateCw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </button>
      </MessageCard>
    );
  }

  if (!progress?.hasRecord || !progress.record) {
    return (
      <MessageCard
        icon={<FileQuestion className="w-14 h-14 text-amber-600 dark:text-amber-400" />}
        title="Belum Ada Data Pendaftaran"
        message="Akun Google ini belum mengisi formulir pendaftaran OPREC UKM Robotika UNS."
      >
        <Link href="/register" className={PRIMARY_BUTTON_CLASS}>
          <span>Daftar Sekarang</span>
        </Link>
      </MessageCard>
    );
  }

  return <RegistrationDetails user={user} record={progress.record} />;
};
