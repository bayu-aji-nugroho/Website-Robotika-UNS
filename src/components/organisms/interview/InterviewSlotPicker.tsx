/*
-----------------------------------------
nama file: [ InterviewSlotPicker.tsx ]
fungsi [ Pemilih jadwal wawancara 3 langkah untuk calon anggota: (1) pilih pasangan pewawancara, (2) pilih tanggal pada kalender bulanan yang hanya mengaktifkan tanggal tersedia, (3) pilih jam yang masih kosong ]
-----------------------------------------------
*/

"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import type { InterviewSlot } from "@/src/services";

const TIME_ZONE = "Asia/Jakarta";
const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const pad = (n: number) => String(n).padStart(2, "0");
const toDateStr = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

const dateKey = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));

const formatLongDate = (dateStr: string) =>
  new Date(`${dateStr}T12:00:00+07:00`).toLocaleDateString("id-ID", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatHourRange = (iso: string) => {
  const start = new Date(iso);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("id-ID", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" });
  return `${fmt(start)}–${fmt(end)}`;
};

interface PairOption {
  pairId: string;
  interviewers: string[];
  slotCount: number;
  dayCount: number;
}

function buildPairOptions(slots: InterviewSlot[]): PairOption[] {
  const map = new Map<string, PairOption & { days: Set<string> }>();
  for (const slot of slots) {
    const entry = map.get(slot.pair_id) || {
      pairId: slot.pair_id,
      interviewers: slot.interviewers,
      slotCount: 0,
      dayCount: 0,
      days: new Set<string>(),
    };
    entry.slotCount += 1;
    entry.days.add(dateKey(slot.start_at));
    map.set(slot.pair_id, entry);
  }
  return Array.from(map.values())
    .map(({ days, ...rest }) => ({ ...rest, dayCount: days.size }))
    .sort((a, b) => a.interviewers.join().localeCompare(b.interviewers.join(), "id"));
}

const StepTitle: React.FC<{ step: number; title: string; done?: boolean }> = ({ step, title, done }) => (
  <div className="flex items-center gap-2">
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0 ${
        done ? "bg-[#B22234] text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
      }`}
    >
      {step}
    </span>
    <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">{title}</span>
  </div>
);

function DateCalendar({
  availableDates,
  selectedDate,
  onSelect,
}: {
  availableDates: Set<string>;
  selectedDate: string | null;
  onSelect: (date: string) => void;
}) {
  const sorted = Array.from(availableDates).sort();
  // Buka kalender langsung di bulan tanggal tersedia pertama
  const [view, setView] = useState(() => {
    const [y, m] = (selectedDate || sorted[0] || dateKey(new Date().toISOString())).split("-").map(Number);
    return { y, m: m - 1 };
  });

  const firstWeekday = (new Date(Date.UTC(view.y, view.m, 1)).getUTCDay() + 6) % 7; // Senin = 0
  const daysInMonth = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const monthLabel = new Date(Date.UTC(view.y, view.m, 1)).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const viewKey = `${view.y}-${pad(view.m + 1)}`;
  const firstKey = sorted[0]?.slice(0, 7);
  const lastKey = sorted[sorted.length - 1]?.slice(0, 7);
  const canPrev = Boolean(firstKey && viewKey > firstKey);
  const canNext = Boolean(lastKey && viewKey < lastKey);

  const shift = (delta: number) =>
    setView((v) => {
      const d = new Date(Date.UTC(v.y, v.m + delta, 1));
      return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
    });

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={!canPrev}
          aria-label="Bulan sebelumnya"
          className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 capitalize">{monthLabel}</span>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={!canNext}
          aria-label="Bulan berikutnya"
          className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-[10px] font-semibold uppercase text-zinc-400 py-1">
            {w}
          </span>
        ))}
        {cells.map((day, idx) => {
          if (day === null) return <span key={`empty-${idx}`} />;
          const ds = toDateStr(view.y, view.m, day);
          const available = availableDates.has(ds);
          const selected = ds === selectedDate;
          return (
            <button
              key={ds}
              type="button"
              disabled={!available}
              onClick={() => onSelect(ds)}
              className={`aspect-square rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed ${
                selected
                  ? "bg-[#B22234] text-white shadow-xs"
                  : available
                  ? "bg-[#FCF2F3] dark:bg-red-950/30 text-[#B22234] dark:text-red-300 hover:bg-[#F8D7DA] dark:hover:bg-red-900/40 ring-1 ring-[#F8D7DA] dark:ring-red-900/50"
                  : "text-zinc-300 dark:text-zinc-700"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded bg-[#FCF2F3] dark:bg-red-950/40 ring-1 ring-[#F8D7DA] dark:ring-red-900/50" />
        Tanggal yang masih tersedia
      </p>
    </div>
  );
}

export interface InterviewSlotPickerProps {
  slots: InterviewSlot[];
  currentStartAt?: string | null;
  busySlot: string | null;
  onPick: (startAt: string, pairId: string) => void;
}

export const InterviewSlotPicker: React.FC<InterviewSlotPickerProps> = ({
  slots,
  currentStartAt,
  busySlot,
  onPick,
}) => {
  const pairOptions = buildPairOptions(slots);
  const [pairId, setPairId] = useState<string | null>(
    pairOptions.length === 1 ? pairOptions[0].pairId : null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const activePair = pairOptions.find((p) => p.pairId === pairId) || null;
  const pairSlots = activePair ? slots.filter((s) => s.pair_id === activePair.pairId) : [];
  const availableDates = new Set(pairSlots.map((s) => dateKey(s.start_at)));
  const daySlots = selectedDate ? pairSlots.filter((s) => dateKey(s.start_at) === selectedDate) : [];

  if (pairOptions.length === 0) {
    return (
      <div className="py-5 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-500 dark:text-zinc-400">
        Belum ada jadwal wawancara yang tersedia. Silakan cek kembali nanti melalui Dashboard Akun.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Langkah 1: Pewawancara */}
      <div className="space-y-2.5">
        <StepTitle step={1} title="Pilih Pewawancara" done={Boolean(activePair)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {pairOptions.map((p) => {
            const selected = p.pairId === pairId;
            return (
              <button
                key={p.pairId}
                type="button"
                onClick={() => {
                  setPairId(p.pairId);
                  setSelectedDate(null);
                }}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  selected
                    ? "border-[#B22234] bg-[#FCF2F3] dark:bg-red-950/30 ring-1 ring-[#B22234]"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-[#B22234]/60 bg-white dark:bg-zinc-900/40"
                }`}
              >
                <span className="flex items-center gap-1.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  <Users className="w-3.5 h-3.5 text-[#B22234] shrink-0" />
                  {p.interviewers.join(" & ")}
                </span>
                <span className="block text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {p.slotCount} jam tersedia di {p.dayCount} hari
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Langkah 2 & 3: Tanggal + Jam */}
      {activePair && (
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,260px)_1fr] gap-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="space-y-2.5">
            <StepTitle step={2} title="Pilih Tanggal" done={Boolean(selectedDate)} />
            <DateCalendar
              key={activePair.pairId}
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>

          <div className="space-y-2.5 md:border-l md:pl-5 border-zinc-100 dark:border-zinc-800">
            <StepTitle step={3} title="Pilih Jam" />
            {!selectedDate ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 py-2">
                Pilih tanggal yang ditandai pada kalender untuk melihat jam yang tersedia.
              </p>
            ) : (
              <>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{formatLongDate(selectedDate)}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
                  {daySlots.map((slot) => {
                    const isCurrent = currentStartAt
                      ? new Date(currentStartAt).getTime() === new Date(slot.start_at).getTime()
                      : false;
                    const isBusy = busySlot === slot.start_at;
                    return (
                      <button
                        key={slot.start_at}
                        type="button"
                        onClick={() => onPick(slot.start_at, slot.pair_id)}
                        disabled={busySlot !== null || isCurrent}
                        className={`px-2 py-2.5 rounded-lg border text-left transition-colors cursor-pointer disabled:cursor-not-allowed ${
                          isCurrent
                            ? "bg-[#B22234] border-[#B22234] text-white"
                            : "bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-[#B22234] hover:bg-[#FCF2F3] dark:hover:bg-red-950/30 disabled:opacity-60"
                        }`}
                      >
                        <span className="flex items-center gap-1 text-xs font-mono font-semibold">
                          <Clock className="w-3 h-3 shrink-0" />
                          {formatHourRange(slot.start_at)}
                        </span>
                        <span className="block text-[10px] font-medium opacity-80 mt-0.5">
                          {isBusy ? "Memilih..." : isCurrent ? "Jadwal Anda" : "WIB · Pilih"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {daySlots[0]?.location && (
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-px" />
                    <span className="break-all">Lokasi: {daySlots[0].location}</span>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
