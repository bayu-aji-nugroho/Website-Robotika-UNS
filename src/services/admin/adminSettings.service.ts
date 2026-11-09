/*
-----------------------------------------
nama file: [ adminSettings.service.ts ] 
fungsi [ Layanan pengambil status konfigurasi admin & gerbang pendaftaran (OPREC) dari basis data Supabase ]
-----------------------------------------------
*/

import { supabase } from "../supabase/supabaseClient";

export interface AdminSettings {
  id: number;
  is_oprec: boolean;
  label: string;
  /** Waktu hasil seleksi boleh dilihat calon anggota. null = belum ditentukan. */
  announcement_at?: string | null;
  /** Jadwal OPREC otomatis. Bila salah satu diisi, status buka/tutup mengikuti jadwal. */
  oprec_open_at?: string | null;
  oprec_close_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  id: 1,
  is_oprec: false,
  label: "Informasi pendaftaran segera diumumkan",
};

/**
 * Mengambil konfigurasi sistem admin (status OPREC & teks pengumuman) dari tabel public.admin_settings.
 * Jika terjadi kegagalan jaringan atau record belum siap, mengembalikan fallback aman: is_oprec = false (tertutup).
 */
export async function getAdminSettings(): Promise<AdminSettings> {
  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("id, is_oprec, label, announcement_at, oprec_open_at, oprec_close_at, created_at, updated_at")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.warn("Gagal mengambil admin_settings dari Supabase:", error.message);
      }
      return DEFAULT_ADMIN_SETTINGS;
    }

    return {
      id: data.id ?? 1,
      is_oprec: Boolean(data.is_oprec),
      label: data.label || DEFAULT_ADMIN_SETTINGS.label,
      announcement_at: data.announcement_at ?? null,
      oprec_open_at: data.oprec_open_at ?? null,
      oprec_close_at: data.oprec_close_at ?? null,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (err) {
    console.error("Kesalahan koneksi saat mengambil admin_settings:", err);
    return DEFAULT_ADMIN_SETTINGS;
  }
}

/**
 * Status OPREC efektif saat ini (sama dengan fungsi database oprec_open_from_schedule):
 * bila jadwal buka/tutup diisi, ikuti jadwal; bila kosong, ikuti toggle is_oprec.
 */
export function isOprecOpenNow(
  settings: Pick<AdminSettings, "is_oprec" | "oprec_open_at" | "oprec_close_at">,
  nowMs: number
): boolean {
  const openAt = settings.oprec_open_at ? new Date(settings.oprec_open_at).getTime() : null;
  const closeAt = settings.oprec_close_at ? new Date(settings.oprec_close_at).getTime() : null;
  if (openAt === null && closeAt === null) return Boolean(settings.is_oprec);
  return (openAt === null || nowMs >= openAt) && (closeAt === null || nowMs < closeAt);
}

/** Waktu pergantian status OPREC berikutnya (buka atau tutup) setelah nowMs, bila ada. */
export function nextOprecChangeMs(
  settings: Pick<AdminSettings, "oprec_open_at" | "oprec_close_at">,
  nowMs: number
): number | null {
  const times = [settings.oprec_open_at, settings.oprec_close_at]
    .filter((v): v is string => Boolean(v))
    .map((v) => new Date(v).getTime())
    .filter((t) => t > nowMs);
  return times.length ? Math.min(...times) : null;
}

/** true bila waktu pengumuman hasil seleksi sudah tiba. */
export function isAnnouncementOpen(settings: Pick<AdminSettings, "announcement_at">, nowMs: number): boolean {
  if (!settings.announcement_at) return false;
  return new Date(settings.announcement_at).getTime() <= nowMs;
}
