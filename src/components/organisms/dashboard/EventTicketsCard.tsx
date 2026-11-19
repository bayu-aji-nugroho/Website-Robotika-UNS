/*
-----------------------------------------
nama file: [ EventTicketsCard.tsx ]
fungsi [ Kartu tiket acara divisi di Dashboard Akun: menampilkan QR Code presensi milik peserta yang dipindai panitia saat acara ]
-----------------------------------------------
*/

"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CalendarCheck, CheckCircle2, MapPin } from "lucide-react";
import { supabase } from "@/src/services";

interface EventTicket {
  id: string;
  qr_token: string;
  status: "pending" | "present" | "excused";
  checked_in_at: string | null;
  division_events: {
    title: string;
    description: string | null;
    event_date: string;
    end_date: string | null;
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

/** Tiket QR acara divisi milik akun yang login (RLS: hanya tiket sendiri). Tersembunyi bila tidak ada. */
export const EventTicketsCard: React.FC = () => {
  const [tickets, setTickets] = useState<EventTicket[]>([]);

  useEffect(() => {
    let active = true;
    supabase
      .from("event_attendances")
      .select(
        "id, qr_token, status, checked_in_at, division_events (title, description, event_date, end_date, location, is_active, divisions (name))"
      )
      .then(({ data }) => {
        if (!active || !data) return;
        const list = (data as unknown as EventTicket[])
          .filter((t) => t.division_events?.is_active)
          .sort((a, b) => a.division_events!.event_date.localeCompare(b.division_events!.event_date));
        setTickets(list);
      });
    return () => {
      active = false;
    };
  }, []);

  if (tickets.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-xl shadow-xs p-4 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <CalendarCheck className="w-5 h-5 text-[#B22234] mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Tiket Acara Divisi</p>
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            Tunjukkan QR Code ke panitia saat datang untuk presensi. Naikkan kecerahan layar dan siapkan KTM.
            Simpan screenshot tiket bila sinyal di lokasi kurang bagus.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {tickets.map((t) => {
          const ev = t.division_events!;
          const present = t.status === "present";
          return (
            <div
              key={t.id}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col items-center text-center gap-3"
            >
              <div className="space-y-1">
                {ev.divisions?.name && (
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B22234] dark:text-rose-400">
                    {ev.divisions.name}
                  </p>
                )}
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 break-words">{ev.title}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{formatWib(ev.event_date)}</p>
                {ev.location && (
                  <p className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {ev.location}
                  </p>
                )}
              </div>

              {present ? (
                <div className="w-full flex flex-col items-center gap-1.5 py-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                  <p className="text-sm font-bold">Sudah Hadir</p>
                  {t.checked_in_at && <p className="text-[11px]">{formatWib(t.checked_in_at)}</p>}
                </div>
              ) : (
                // Latar putih tetap di mode gelap agar QR mudah dipindai
                <div className="p-3 rounded-lg bg-white border border-zinc-200">
                  <QRCodeSVG
                    value={t.qr_token}
                    size={200}
                    bgColor="#FFFFFF"
                    fgColor="#18181b"
                    level="M"
                    marginSize={2}
                    title={`QR presensi ${ev.title}`}
                  />
                </div>
              )}

              {t.status === "excused" && (
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Tercatat izin</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
