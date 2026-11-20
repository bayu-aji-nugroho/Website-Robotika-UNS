/*
-----------------------------------------
nama file: [ EventTicketsCard.tsx ]
fungsi [ Kartu QR presensi di Dashboard Akun: satu QR tetap milik peserta (dipindai panitia di setiap acara) beserta daftar acara divisi yang diikuti dan status kehadirannya ]
-----------------------------------------------
*/

"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CalendarCheck, CheckCircle2, MapPin, QrCode, X } from "lucide-react";
import { supabase } from "@/src/services";

interface EventTicket {
  id: string;
  status: "pending" | "present" | "late" | "excused" | "absent";
  checked_in_at: string | null;
  division_events: {
    title: string;
    event_date: string;
    location: string | null;
    is_active: boolean;
    divisions: { name: string } | null;
  } | null;
}

const formatWib = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }) + " WIB";

/** QR presensi pribadi (dibuat sekali, berlaku untuk semua acara) + acara divisi yang diikuti. */
export const EventTicketsCard: React.FC<{ name?: string | null; nim?: string | null }> = ({ name, nim }) => {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [showQr, setShowQr] = useState(false);

  // Layar penuh: tutup dengan Esc, cegah layar redup/mati selama QR ditampilkan
  useEffect(() => {
    if (!showQr) return;
    let wakeLock: { release: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<{ release: () => Promise<void> }> };
    };
    nav.wakeLock?.request("screen").then((lock) => (wakeLock = lock)).catch(() => {});
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowQr(false);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      void wakeLock?.release().catch(() => {});
    };
  }, [showQr]);

  useEffect(() => {
    let active = true;
    supabase.rpc("get_my_attendance_qr").then(({ data }) => {
      if (active && typeof data === "string") setQrToken(data);
    });
    supabase
      .from("event_attendances")
      .select("id, status, checked_in_at, division_events (title, event_date, location, is_active, divisions (name))")
      .then(({ data }) => {
        if (!active || !data) return;
        setTickets(
          (data as unknown as EventTicket[])
            .filter((t) => t.division_events?.is_active)
            .sort((a, b) => a.division_events!.event_date.localeCompare(b.division_events!.event_date))
        );
      });
    return () => {
      active = false;
    };
  }, []);

  if (!qrToken) return null;

  return (
    <div className="bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-xl shadow-xs p-4 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <QrCode className="w-5 h-5 text-[#B22234] mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">QR Presensi</p>
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            Satu QR untuk semua acara. Saat presensi, tekan tombol QR lalu tunjukkan layar ke panitia dan siapkan
            KTM. Simpan screenshot bila sinyal di lokasi kurang bagus.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowQr(true)}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#B22234] hover:bg-[#8B0000] text-white text-sm font-bold rounded-lg transition-colors shadow-xs cursor-pointer min-h-[48px] focus-visible:ring-2 focus-visible:ring-[#B22234] focus-visible:ring-offset-2 focus-visible:outline-hidden"
      >
        <QrCode className="w-5 h-5" />
        <span>QR</span>
      </button>

      {showQr && (
        // Layar penuh putih agar QR terang & mudah dipindai (kecerahan layar tidak bisa diatur dari web)
        <div
          role="dialog"
          aria-modal="true"
          aria-label="QR presensi"
          onClick={() => setShowQr(false)}
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center gap-4 p-4 text-zinc-900"
        >
          <button
            type="button"
            onClick={() => setShowQr(false)}
            aria-label="Tutup QR"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <QRCodeSVG
            value={qrToken}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="M"
            marginSize={2}
            title="QR presensi"
            style={{ width: "min(88vw, 70vh)", height: "min(88vw, 70vh)" }}
          />
          {(name || nim) && (
            <p className="text-center">
              <span className="block text-lg font-bold">{name}</span>
              {nim && <span className="block font-mono text-base">{nim}</span>}
            </p>
          )}
          <p className="text-xs text-zinc-500">Naikkan kecerahan layar bila sulit terbaca · ketuk untuk menutup</p>
        </div>
      )}

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <CalendarCheck className="w-3.5 h-3.5" />
          Acara Divisi
        </p>
        {tickets.length === 0 ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Belum ada acara untuk Anda.</p>
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => {
              const ev = t.division_events!;
              return (
                <li
                  key={t.id}
                  className="flex flex-wrap items-start justify-between gap-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 break-words">
                      {ev.title}
                      {ev.divisions?.name && (
                        <span className="font-normal text-zinc-500 dark:text-zinc-400"> · {ev.divisions.name}</span>
                      )}
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400">{formatWib(ev.event_date)}</p>
                    {ev.location && (
                      <p className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {ev.location}
                      </p>
                    )}
                  </div>
                  {t.status === "present" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Hadir
                    </span>
                  ) : t.status === "late" ? (
                    <span className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-semibold shrink-0">
                      Terlambat
                    </span>
                  ) : t.status === "excused" ? (
                    <span className="px-2 py-1 rounded-md bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 font-semibold shrink-0">
                      Izin
                    </span>
                  ) : t.status === "absent" ? (
                    <span className="px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 font-semibold shrink-0">
                      Alpha
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold shrink-0">
                      Belum Hadir
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
