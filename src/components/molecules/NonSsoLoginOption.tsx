/*
-----------------------------------------
nama file: [ NonSsoLoginOption.tsx ]
fungsi [ Tautan kecil "masuk dengan akun email biasa" untuk calon anggota yang akun SSO-nya bermasalah: menampilkan pop-up pengingat wajib SSO sebelum membuka Google tanpa batasan domain, serta pesan penolakan bila email belum di-whitelist panitia ]
-----------------------------------------------
*/

"use client";

import React, { useState, useSyncExternalStore } from "react";
import { AlertCircle } from "lucide-react";
import { WhatsAppIcon } from "@/src/components/atoms";
import { ConfirmationModal } from "./ConfirmationModal";
import { ADMIN_WA_CONFIG } from "@/data/registration";
import {
  ALLOWED_APPLICANT_EMAIL_DOMAIN,
  getSsoRejectedEmail,
  signInWithGoogle,
  subscribeSsoRejection,
} from "@/src/services";

export interface NonSsoLoginOptionProps {
  /** Halaman tujuan setelah login (default /register) */
  redirectTo?: string;
  className?: string;
}

export const NonSsoLoginOption: React.FC<NonSsoLoginOptionProps> = ({ redirectTo, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Email yang baru saja dikeluarkan karena bukan SSO & belum di-whitelist
  const rejectedEmail = useSyncExternalStore(subscribeSsoRejection, getSsoRejectedEmail, () => null);

  const handleContinue = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const { error } = await signInWithGoogle(redirectTo, { nonSso: true });
    if (error) {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto space-y-3 ${className}`}>
      {rejectedEmail && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-left text-xs text-red-700 dark:text-red-300 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>Akun tidak dapat digunakan</span>
          </div>
          <p className="leading-relaxed">
            <span className="font-semibold break-all">{rejectedEmail}</span> bukan email SSO dan belum didaftarkan
            panitia sebagai pengecualian. Silakan masuk dengan email <strong>@{ALLOWED_APPLICANT_EMAIL_DOMAIN}</strong>,
            atau hubungi panitia bila akun SSO Anda bermasalah.
          </p>
          <a
            href={ADMIN_WA_CONFIG.getUrl(
              `Halo kak, akun SSO saya bermasalah sehingga tidak bisa login di web OPREC Robotika UNS. Boleh minta email ${rejectedEmail} didaftarkan sebagai pengecualian?`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25D366] hover:bg-[#1faa4f] text-white text-[11px] font-semibold transition-colors shadow-xs"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>Hubungi Panitia</span>
          </a>
        </div>
      )}

      <p className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
        Akun SSO bermasalah?{" "}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="font-semibold text-[#B22234] dark:text-[#ff6b7d] hover:underline cursor-pointer"
        >
          Masuk dengan akun email biasa
        </button>
      </p>

      <ConfirmationModal
        isOpen={isOpen}
        title="Masuk dengan Akun Email Biasa"
        description={`Pendaftaran OPREC wajib menggunakan akun SSO mahasiswa UNS (@${ALLOWED_APPLICANT_EMAIL_DOMAIN}). Login dengan akun email biasa (mis. Gmail pribadi) HANYA untuk calon anggota yang akun SSO-nya terkendala dan emailnya sudah didaftarkan oleh panitia.`}
        warningNote="Email yang belum didaftarkan panitia akan otomatis ditolak. Hubungi panitia lebih dulu untuk mendaftarkan email Anda, lalu pilih akun yang sama di halaman Google."
        confirmText={isLoading ? "Menghubungkan..." : "Lanjutkan ke Google"}
        cancelText="Batal"
        onConfirm={handleContinue}
        onCancel={() => setIsOpen(false)}
      />
    </div>
  );
};
