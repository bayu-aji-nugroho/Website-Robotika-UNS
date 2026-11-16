/*
-----------------------------------------
nama file: [ OprecOpenBanner.tsx ]
fungsi [ Notifikasi (teks = Label Pengumuman & warna diatur admin, bawaan hijau) yang meluncur dari bawah navbar saat Open Recruitment sedang dibuka (mengikuti status OPREC efektif, termasuk jadwal buka/tutup otomatis), dengan tombol daftar dan tombol tutup ]
-----------------------------------------------
*/

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { DEFAULT_ADMIN_SETTINGS, getAdminSettings, getOprecBannerColors, isOprecOpenNow } from "@/src/services";

// Notifikasi yang sudah ditutup tidak muncul lagi selama tab browser masih terbuka
const DISMISS_KEY = "oprec_open_banner_dismissed";
const DEFAULT_BANNER_TEXT = "Open Recruitment dibuka, silakan daftar!";

/** Teks notifikasi = Label Pengumuman dari admin; kosong/bawaan = teks standar */
function bannerTextFrom(label: string | null | undefined): string {
  const trimmed = (label || "").trim();
  return trimmed && trimmed !== DEFAULT_ADMIN_SETTINGS.label ? trimmed : DEFAULT_BANNER_TEXT;
}

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
  // Warna diatur admin di Pengaturan OPREC; teks putih/hitam menyesuaikan kontras
  const [colors, setColors] = useState(() => getOprecBannerColors(null));
  const [text, setText] = useState(DEFAULT_BANNER_TEXT);

  useEffect(() => {
    let isMounted = true;
    getAdminSettings().then((settings) => {
      if (isMounted && isOprecOpenNow(settings, Date.now()) && !readDismissed()) {
        setColors(getOprecBannerColors(settings.oprec_banner_color));
        setText(bannerTextFrom(settings.label));
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
            className="pointer-events-auto flex items-center gap-2 sm:gap-3 max-w-full pl-3.5 pr-1.5 py-1.5 rounded shadow-lg"
            style={{
              backgroundColor: colors.background,
              color: colors.text,
              boxShadow: `0 10px 15px -3px ${colors.background}4d`,
            }}
          >
            <span className="text-xs sm:text-sm font-semibold truncate" title={text}>
              {text}
            </span>
            <Link
              href="/register"
              className="inline-flex items-center gap-1 shrink-0 px-2.5 sm:px-3 py-1 rounded-sm text-[11px] sm:text-xs font-bold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.text, color: colors.background }}
            >
              Daftar
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Tutup notifikasi"
              className="shrink-0 p-1 rounded-sm opacity-80 hover:opacity-100 hover:bg-current/15 transition-opacity cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
