/*
-----------------------------------------
nama file: [ MeetingHistoryCard.tsx ]
fungsi [ Kartu riwayat pertemuan di Dashboard Akun: acara divisi yang sudah berlangsung beserta status kehadirannya, plus kontak panitia bila ada kejanggalan ]
-----------------------------------------------
*/

"use client";

import React, { useEffect, useState } from "react";
import { History, MessageCircle } from "lucide-react";
import { supabase } from "@/src/services";

interface Meeting {
  title: string;
  at: string;
  location: string | null;
  status: "present" | "late" | "excused" | "absent";
}

interface MeetingHistory {
  meetings: Meeting[];
  contact_name: string | null;
  contact_whatsapp: string | null;
}

const STATUS: Record<Meeting["status"], { label: string; className: string }> = {
  present: { label: "Hadir", className: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" },
  late: { label: "Terlambat", className: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" },
  excused: { label: "Izin", className: "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400" },
  absent: { label: "Alpha", className: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400" },
};

const formatWib = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }) + " WIB";

/** Riwayat pertemuan yang sudah lewat (data dari presensi; nilai tidak ditampilkan). */
export const MeetingHistoryCard: React.FC<{ name?: string | null; nim?: string | null }> = ({ name, nim }) => {
  const [history, setHistory] = useState<MeetingHistory | null>(null);

  useEffect(() => {
    let active = true;
    supabase.rpc("get_my_meeting_history").then(({ data }) => {
      if (active && data) setHistory(data as MeetingHistory);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!history) return null;

  const attended = history.meetings.filter((m) => m.status === "present" || m.status === "late").length;
  const waText = `Halo kak ${history.contact_name || ""}, saya ${name || ""} (${nim || "-"}). Saya ingin menanyakan riwayat kehadiran saya di dashboard OPREC, sepertinya ada yang kurang sesuai.`;

  return (
    <div className="bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-xl shadow-xs p-4 sm:p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <History className="w-5 h-5 text-[#B22234] mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Riwayat Pertemuan</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Acara divisi yang sudah berlangsung.</p>
          </div>
        </div>
        {history.meetings.length > 0 && (
          <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
            Hadir {attended}/{history.meetings.length}
          </span>
        )}
      </div>

      {history.meetings.length === 0 ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Belum ada pertemuan yang berlangsung.</p>
      ) : (
        <ul className="space-y-2">
          {history.meetings.map((m, i) => (
            <li
              key={`${m.at}-${i}`}
              className="flex flex-wrap items-start justify-between gap-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 break-words">
                  {m.title}
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {formatWib(m.at)}
                  {m.location && ` · ${m.location}`}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-md font-semibold shrink-0 ${STATUS[m.status].className}`}>
                {STATUS[m.status].label}
              </span>
            </li>
          ))}
        </ul>
      )}

      {history.contact_whatsapp && (
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Ada kejanggalan pada riwayat kehadiran?</p>
          <a
            href={`https://wa.me/${history.contact_whatsapp}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold min-h-[40px]"
          >
            <MessageCircle className="w-4 h-4" />
            Hubungi kak {history.contact_name || "panitia"}
          </a>
        </div>
      )}
    </div>
  );
};
