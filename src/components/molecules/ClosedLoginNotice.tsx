/*
-----------------------------------------
nama file: [ ClosedLoginNotice.tsx ]
fungsi [ Notifikasi melayang saat login ditolak karena pendaftaran sudah ditutup dan akun belum menyelesaikan pendaftaran ]
-----------------------------------------------
*/

"use client";

import React, { useSyncExternalStore } from "react";
import { AlertTriangle, X } from "lucide-react";
import { clearClosedRejection, getClosedRejectedEmail, subscribeClosedRejection } from "@/src/services";

export const ClosedLoginNotice: React.FC = () => {
  const email = useSyncExternalStore(subscribeClosedRejection, getClosedRejectedEmail, () => null);

  if (!email) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[60] px-4 flex justify-center pointer-events-none print:hidden">
      <div
        role="alert"
        className="pointer-events-auto w-full max-w-md flex items-start gap-3 p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-[#2a2110] text-amber-900 dark:text-amber-200 shadow-lg"
      >
        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1 space-y-1 text-xs sm:text-sm leading-relaxed">
          <p className="font-semibold">Login ditolak</p>
          <p>
            Pendaftaran sudah ditutup. Akun <span className="font-semibold break-all">{email}</span> belum
            menyelesaikan pendaftaran, jadi tidak dapat masuk.
          </p>
          <p className="text-amber-800/80 dark:text-amber-300/80">
            Sudah mengirim pendaftaran? Pastikan memakai akun SSO yang sama saat mendaftar.
          </p>
        </div>
        <button
          type="button"
          onClick={clearClosedRejection}
          aria-label="Tutup pesan"
          className="p-1 -m-1 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
