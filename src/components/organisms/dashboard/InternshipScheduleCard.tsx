/*
-----------------------------------------
nama file: [ InternshipScheduleCard.tsx ]
fungsi [ Kartu jadwal magang di Dashboard Akun: kotak-kotak tanggal, jam, dan tempat magang untuk divisi Pilihan 1 peserta ]
-----------------------------------------------
*/

"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, CalendarDays, Clock, MapPin } from "lucide-react";
import { supabase } from "@/src/services";

interface InternshipSchedule {
  id: string;
  scheduled_at: string;
  location: string;
}

const wib = (value: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(value).toLocaleString("id-ID", { ...opts, timeZone: "Asia/Jakarta" });

/** Jadwal magang divisi Pilihan 1 (RLS: hanya divisi Pilihan 1 akun yang login). */
export const InternshipScheduleCard: React.FC<{ divisionName?: string | null }> = ({ divisionName }) => {
  const [schedules, setSchedules] = useState<InternshipSchedule[] | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("internship_schedules")
      .select("id, scheduled_at, location")
      .order("scheduled_at", { ascending: true })
      .then(({ data }) => {
        if (active) setSchedules((data as InternshipSchedule[]) || []);
      });
    return () => {
      active = false;
    };
  }, []);

  if (schedules === null) return null;

  return (
    <div className="bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-xl shadow-xs p-4 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <Briefcase className="w-5 h-5 text-[#B22234] mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Jadwal Magang</p>
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            Sesuai divisi Pilihan 1{divisionName ? `: ${divisionName}` : ""}.
          </p>
        </div>
      </div>

      {schedules.length === 0 ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Jadwal magang belum tersedia.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {schedules.map((s) => (
            <li
              key={s.id}
              className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-1.5 text-xs sm:text-sm"
            >
              <p className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                <CalendarDays className="w-4 h-4 text-[#B22234] shrink-0" />
                {wib(s.scheduled_at, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                {wib(s.scheduled_at, { hour: "2-digit", minute: "2-digit" })} WIB
              </p>
              <p className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300 break-words">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                {s.location}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
