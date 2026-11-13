/*
-----------------------------------------
nama file: [ InterviewSchedulePicker.tsx ]
fungsi [ Komponen jadwal wawancara calon anggota: memuat jadwal tersedia, menampilkan jadwal yang dipilih, membuka pemilih 3 langkah (pewawancara → tanggal → jam) untuk memilih/mengganti jadwal selama belum dikonfirmasi, dan mengunci jadwal setelah calon anggota menekan Accept ]
-----------------------------------------------
*/

"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarCheck,
  CalendarClock,
  Check,
  Lock,
  MapPin,
  RotateCw,
  Users,
} from "lucide-react";
import { WhatsAppIcon } from "@/src/components/atoms";
import { InterviewSlotPicker } from "@/src/components/organisms/interview/InterviewSlotPicker";
import { ADMIN_WA_CONFIG } from "@/data/registration";
import {
  INTERVIEW_SLOT_MINUTES,
  InterviewBooking,
  InterviewSlot,
  acceptInterviewBooking,
  bookInterviewSlot,
  getInterviewSlots,
  getMyInterviewBooking,
} from "@/src/services";

const TIME_ZONE = "Asia/Jakarta";
const CONFIRM_CONTACT_LABEL = "Konfirmasi: NIA (0881-8525-045)";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatHourRange = (iso: string) => {
  const start = new Date(iso);
  const end = new Date(start.getTime() + INTERVIEW_SLOT_MINUTES * 60 * 1000);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("id-ID", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" });
  return `${fmt(start)}–${fmt(end)} WIB`;
};

const formatDeadline = (iso: string) =>
  `${formatDate(iso)}, pukul ${new Date(iso).toLocaleTimeString("id-ID", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  })} WIB`;

const isLink = (value: string) => /^https?:\/\//i.test(value.trim());

const LocationText: React.FC<{ location: string }> = ({ location }) =>
  isLink(location) ? (
    <a
      href={location}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-[#B22234] dark:text-red-400 hover:underline underline-offset-2 break-all"
    >
      {location}
    </a>
  ) : (
    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{location}</span>
  );

async function fetchSchedule() {
  const [slots, booking] = await Promise.all([getInterviewSlots(), getMyInterviewBooking()]);
  return { slots, booking };
}

export interface InterviewSchedulePickerProps {
  className?: string;
}

export const InterviewSchedulePicker: React.FC<InterviewSchedulePickerProps> = ({ className = "" }) => {
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  // Batas pemilihan jadwal dari Pengaturan OPREC (null = tanpa batas)
  const [deadline, setDeadline] = useState<string | null>(null);
  const [isClosed, setIsClosed] = useState(false);
  const [booking, setBooking] = useState<InterviewBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busySlot, setBusySlot] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [confirmingAccept, setConfirmingAccept] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const applyResult = useCallback((result: Awaited<ReturnType<typeof fetchSchedule>>) => {
    setSlots(result.slots.data);
    setDeadline(result.slots.deadline);
    setIsClosed(result.slots.closed);
    setBooking(result.booking.data);
    setLoadError(result.slots.error || result.booking.error);
    setIsLoading(false);
  }, []);

  const load = useCallback(() => fetchSchedule().then(applyResult), [applyResult]);

  useEffect(() => {
    let isMounted = true;
    fetchSchedule().then((result) => {
      if (isMounted) applyResult(result);
    });
    return () => {
      isMounted = false;
    };
  }, [applyResult]);

  const handleReload = () => {
    setIsLoading(true);
    load();
  };

  const handleBook = async (startAt: string, pairId: string) => {
    setActionError(null);
    setBusySlot(startAt);
    const res = await bookInterviewSlot(startAt, pairId);
    setBusySlot(null);
    if (res.error) {
      setActionError(res.error);
      // Slot mungkin baru saja diambil orang lain: muat ulang daftar terbaru
      load();
      return;
    }
    setBooking(res.data);
    setIsChanging(false);
    setConfirmingAccept(false);
    load();
  };

  const handleAccept = async () => {
    setActionError(null);
    setIsAccepting(true);
    const res = await acceptInterviewBooking();
    setIsAccepting(false);
    setConfirmingAccept(false);
    if (res.error) {
      setActionError(res.error);
      return;
    }
    setBooking(res.data);
  };

  const isAccepted = booking?.status === "accepted";
  // Hanya pewawancara yang sudah mengisi No. WhatsApp; kosong -> kontak NIA sebagai cadangan
  const interviewerContacts = (booking?.interviewer_contacts || []).filter(
    (c): c is { name: string; whatsapp: string } => Boolean(c.whatsapp)
  );
  const showSlotList = !isAccepted && (!booking || isChanging) && !isClosed;

  return (
    <div
      className={`bg-white dark:bg-[#16171a] rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs space-y-4 print:hidden transition-colors ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-[#B22234] shrink-0" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Jadwal Wawancara
          </h2>
        </div>
        {(!isAccepted || !booking?.location) && (
          <button
            type="button"
            onClick={handleReload}
            disabled={isLoading}
            aria-label="Muat ulang jadwal"
            className="p-1 -m-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Memuat jadwal wawancara...</p>
      ) : loadError ? (
        <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{loadError}</span>
        </p>
      ) : (
        <>
          {/* Jadwal yang sudah dipilih */}
          {booking && (
            <div
              className={`p-3.5 sm:p-4 rounded-lg border space-y-2.5 ${
                isAccepted
                  ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60"
                  : "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${
                    isAccepted ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {isAccepted ? (
                    <>
                      <Lock className="w-3 h-3" /> Jadwal Dikonfirmasi
                    </>
                  ) : (
                    "Jadwal Dipilih · Belum Dikonfirmasi"
                  )}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{formatDate(booking.start_at)}</p>
                <p className="text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                  {formatHourRange(booking.start_at)}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>Pewawancara: {booking.interviewers.join(" & ") || "-"}</span>
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {booking.location ? (
                    <LocationText location={booking.location} />
                  ) : isAccepted ? (
                    <span>Tempat belum ditentukan, konfirmasi ke pewawancara di bawah.</span>
                  ) : (
                    <span>Tempat dikonfirmasi ke pewawancara setelah jadwal di-Accept.</span>
                  )}
                </p>
              </div>

              {isAccepted ? (
                interviewerContacts.length > 0 ? (
                  <div className="pt-2.5 border-t border-emerald-200/70 dark:border-emerald-900/50 space-y-2">
                    <span className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {booking.location
                        ? "Hubungi pewawancara bila ada pertanyaan:"
                        : "Konfirmasi tempat ke pewawancara, hubungi salah satu nomor berikut:"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {interviewerContacts.map((c) => (
                        <a
                          key={c.whatsapp}
                          href={`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(
                            `Halo kak ${c.name}, saya calon anggota OPREC Robotika UNS dengan jadwal wawancara pada ${formatDate(
                              booking.start_at
                            )}, pukul ${formatHourRange(booking.start_at)}. ${
                              booking.location
                                ? "Saya ingin mengonfirmasi kehadiran saya."
                                : "Saya ingin mengonfirmasi tempat wawancaranya."
                            }`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25D366] hover:bg-[#1faa4f] text-white text-[11px] font-semibold transition-colors shadow-xs"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                          <span>WhatsApp {c.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pt-2.5 border-t border-emerald-200/70 dark:border-emerald-900/50 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {CONFIRM_CONTACT_LABEL}
                    </span>
                    <a
                      href={ADMIN_WA_CONFIG.getUrl(
                        `Halo kak Nia, saya mengonfirmasi jadwal wawancara OPREC Robotika UNS pada ${formatDate(
                          booking.start_at
                        )}, pukul ${formatHourRange(booking.start_at)}.${
                          booking.location ? "" : " Boleh minta info tempat wawancaranya?"
                        }`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25D366] hover:bg-[#1faa4f] text-white text-[11px] font-semibold transition-colors shadow-xs"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Hubungi via WhatsApp</span>
                    </a>
                  </div>
                )
              ) : confirmingAccept ? (
                <div className="pt-2.5 border-t border-amber-200/70 dark:border-amber-900/50 space-y-2">
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Setelah dikonfirmasi, jadwal <strong>tidak dapat diubah lagi</strong>. Lanjutkan?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleAccept}
                      disabled={isAccepting}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#B22234] hover:bg-[#8B0000] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isAccepting ? "Menyimpan..." : "Ya, Konfirmasi"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingAccept(false)}
                      disabled={isAccepting}
                      className="px-3.5 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2.5 border-t border-amber-200/70 dark:border-amber-900/50 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmingAccept(true);
                      setIsChanging(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#B22234] hover:bg-[#8B0000] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Accept Jadwal</span>
                  </button>
                  {!isClosed && (
                    <button
                      type="button"
                      onClick={() => setIsChanging((v) => !v)}
                      className="px-3.5 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      {isChanging ? "Tutup Pilihan" : "Ganti Jadwal"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Batas pemilihan jadwal */}
          {!isAccepted && isClosed && (
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-2">
              <p className="flex items-start gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Pemilihan jadwal wawancara sudah ditutup
                  {deadline ? ` sejak ${formatDeadline(deadline)}` : ""}.
                </span>
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {booking
                  ? "Jadwal yang sudah Anda pilih tetap berlaku. Tekan Accept Jadwal untuk mengonfirmasinya."
                  : "Anda belum memilih jadwal. Hubungi panitia OPREC bila ada kendala."}
              </p>
              {!booking && (
                <a
                  href={ADMIN_WA_CONFIG.getUrl(
                    "Halo kak Nia, saya belum sempat memilih jadwal wawancara OPREC Robotika UNS sebelum batas waktunya. Apakah masih bisa dibantu?"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25D366] hover:bg-[#1faa4f] text-white text-[11px] font-semibold transition-colors shadow-xs"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Hubungi Panitia</span>
                </a>
              )}
            </div>
          )}
          {!isAccepted && !isClosed && deadline && (
            <p className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300">
              <CalendarClock className="w-3.5 h-3.5 shrink-0" />
              <span>
                Batas memilih jadwal: <strong>{formatDeadline(deadline)}</strong>
              </span>
            </p>
          )}

          {actionError && (
            <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{actionError}</span>
            </p>
          )}

          {/* Daftar jam tersedia */}
          {showSlotList && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {booking
                  ? "Pilih jadwal pengganti. Jadwal lama otomatis dilepas."
                  : `Pilih pewawancara, lalu tanggal dan jam wawancara (${INTERVIEW_SLOT_MINUTES} menit). Anda masih bisa menggantinya sebelum menekan Accept.`}
              </p>

              <InterviewSlotPicker
                slots={slots}
                currentStartAt={booking?.start_at}
                busySlot={busySlot}
                onPick={handleBook}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
