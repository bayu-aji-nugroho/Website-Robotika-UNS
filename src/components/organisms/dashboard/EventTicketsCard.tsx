/*
-----------------------------------------
nama file: [ EventTicketsCard.tsx ]
fungsi [ Kartu QR presensi di Dashboard Akun: satu QR tetap milik peserta (dipindai panitia di setiap acara) beserta daftar acara divisi yang diikuti dan status kehadirannya ]
-----------------------------------------------
*/

"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CalendarCheck, CheckCircle2, MapPin, QrCode } from "lucide-react";
import { supabase } from "@/src/services";

interface EventTicket {
  id: string;
  status: "pending" | "present" | "excused";
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
            Satu QR ini dipakai untuk semua acara. Tunjukkan ke panitia saat datang, naikkan kecerahan layar, dan
            siapkan KTM. Simpan screenshot bila sinyal di lokasi kurang bagus.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        {/* Latar putih tetap di mode gelap agar QR mudah dipindai */}
        <div className="p-3 rounded-lg bg-white border border-zinc-200">
          <QRCodeSVG
            value={qrToken}
            size={220}
            bgColor="#FFFFFF"
            fgColor="#18181b"
            level="M"
            marginSize={2}
            title="QR presensi"
          />
        </div>
        {(name || nim) && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{name}</span>
            {nim && <span className="font-mono"> · {nim}</span>}
          </p>
        )}
      </div>

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
                  ) : t.status === "excused" ? (
                    <span className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-semibold shrink-0">
                      Izin
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
