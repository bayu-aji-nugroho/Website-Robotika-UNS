/*
-----------------------------------------
nama file: [ OprecOpenBanner.tsx ]
fungsi [ Notifikasi hijau yang meluncur dari bawah navbar saat Open Recruitment sedang dibuka (mengikuti status OPREC efektif, termasuk jadwal buka/tutup otomatis), dengan tombol daftar dan tombol tutup ]
-----------------------------------------------
*/

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { getAdminSettings, isOprecOpenNow } from "@/src/services";

// Notifikasi yang sudah ditutup tidak muncul lagi selama tab browser masih terbuka
const DISMISS_KEY = "oprec_open_banner_dismissed";

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export interface OprecOpenBannerProps {
  /** Sembunyikan sementara (mis. saat menu mobile terbuka) */
  hidden?: boolean;
}

export const OprecOpenBanner: React.FC<OprecOpenBannerProps> = ({ hidden = false }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getAdminSettings().then((settings) => {
      if (isMounted && isOprecOpenNow(settings, Date.now()) && !readDismissed()) {
        setVisible(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Abaikan bila sessionStorage tidak tersedia
    }
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 top-full flex justify-center px-3 pt-2">
      <AnimatePresence>
        {visible && !hidden && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.4 }}
            className="pointer-events-auto flex items-center gap-2 sm:gap-3 max-w-full pl-3 pr-1.5 py-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
          >
            <span className="relative flex size-2 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-white" />
            </span>
            <span className="text-xs sm:text-sm font-semibold truncate">
              Open Recruitment dibuka, silakan daftar!
            </span>
            <Link
              href="/register"
              className="inline-flex items-center gap-1 shrink-0 px-2.5 sm:px-3 py-1 rounded-full bg-white text-emerald-700 text-[11px] sm:text-xs font-bold hover:bg-emerald-50 transition-colors"
            >
              Daftar
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Tutup notifikasi"
              className="shrink-0 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
