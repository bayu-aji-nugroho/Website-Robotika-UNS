/*
-----------------------------------------
nama file: [ interview.service.ts ]
fungsi [ Layanan jadwal wawancara calon anggota: mengambil slot tersedia, memilih/mengganti jadwal, mengonfirmasi (accept) jadwal secara permanen, melalui RPC SECURITY DEFINER di Supabase ]
-----------------------------------------------
*/

import { supabase } from "../supabase/supabaseClient";

export type InterviewBookingStatus = "pending" | "accepted";

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
}

export interface InterviewResult<T> {
  data: T;
  error: string | null;
}

function toMessage(error: { message?: string } | null, fallback: string): string {
  return error?.message?.trim() || fallback;
}

export async function getInterviewSlots(): Promise<InterviewResult<InterviewSlot[]>> {
  const { data, error } = await supabase.rpc("get_interview_slots");
  if (error) {
    return { data: [], error: toMessage(error, "Gagal memuat jadwal wawancara.") };
  }
  return { data: (data as InterviewSlot[]) || [], error: null };
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
