/*
-----------------------------------------
nama file: [ interview.service.ts ]
fungsi [ Layanan jadwal wawancara calon anggota: mengambil slot tersedia, memilih/mengganti jadwal, mengonfirmasi (accept) jadwal secara permanen, melalui RPC SECURITY DEFINER di Supabase ]
-----------------------------------------------
*/

import { supabase } from "../supabase/supabaseClient";

export type InterviewBookingStatus = "pending" | "accepted";

/** Durasi satu sesi wawancara (menit), sama dengan slot ketersediaan di dashboard admin */
export const INTERVIEW_SLOT_MINUTES = 30;

/** Satu jam kosong milik satu pasangan pewawancara */
export interface InterviewSlot {
  start_at: string;
  pair_id: string;
  location: string | null;
  interviewers: string[];
}

export interface InterviewBooking {
  id: string;
  start_at: string;
  location: string | null;
  status: InterviewBookingStatus;
  accepted_at: string | null;
  interviewers: string[];
  /** Kontak pewawancara untuk konfirmasi (whatsapp format 62xxx, null bila belum diisi) */
  interviewer_contacts?: { name: string; whatsapp: string | null }[];
}

export interface InterviewResult<T> {
  data: T;
  error: string | null;
}

function toMessage(error: { message?: string } | null, fallback: string): string {
  return error?.message?.trim() || fallback;
}

/** Format ringkas dari RPC get_interview_slots_compact (nama & lokasi dikirim sekali saja) */
interface CompactInterviewSlots {
  pairs: { id: string; interviewers: string[] }[];
  locations: string[];
  /** [indeks pasangan, epoch detik, indeks lokasi | null] */
  slots: [number, number, number | null][];
}

export async function getInterviewSlots(): Promise<InterviewResult<InterviewSlot[]>> {
  const { data, error } = await supabase.rpc("get_interview_slots_compact");
  if (error) {
    return { data: [], error: toMessage(error, "Gagal memuat jadwal wawancara.") };
  }
  const compact = data as CompactInterviewSlots | null;
  if (!compact) return { data: [], error: null };

  const slots: InterviewSlot[] = [];
  for (const [pairIdx, epochSec, locIdx] of compact.slots || []) {
    const pair = compact.pairs[pairIdx];
    if (!pair) continue;
    slots.push({
      start_at: new Date(epochSec * 1000).toISOString(),
      pair_id: pair.id,
      location: locIdx === null ? null : compact.locations[locIdx] ?? null,
      interviewers: pair.interviewers,
    });
  }
  return { data: slots, error: null };
}

export async function getMyInterviewBooking(): Promise<InterviewResult<InterviewBooking | null>> {
  const { data, error } = await supabase.rpc("get_my_interview_booking");
  if (error) {
    return { data: null, error: toMessage(error, "Gagal memuat jadwal wawancara Anda.") };
  }
  return { data: (data as InterviewBooking | null) || null, error: null };
}

export async function bookInterviewSlot(
  startAt: string,
  pairId?: string
): Promise<InterviewResult<InterviewBooking | null>> {
  const { data, error } = await supabase.rpc("book_interview_slot", {
    p_start_at: startAt,
    p_pair_id: pairId ?? null,
  });
  if (error) {
    return { data: null, error: toMessage(error, "Gagal memilih jadwal wawancara.") };
  }
  return { data: (data as InterviewBooking | null) || null, error: null };
}

export async function acceptInterviewBooking(): Promise<InterviewResult<InterviewBooking | null>> {
  const { data, error } = await supabase.rpc("accept_interview_booking");
  if (error) {
    return { data: null, error: toMessage(error, "Gagal mengonfirmasi jadwal wawancara.") };
  }
  return { data: (data as InterviewBooking | null) || null, error: null };
}

export async function cancelInterviewBooking(): Promise<InterviewResult<null>> {
  const { error } = await supabase.rpc("cancel_interview_booking");
  if (error) {
    return { data: null, error: toMessage(error, "Gagal membatalkan jadwal wawancara.") };
  }
  return { data: null, error: null };
}
