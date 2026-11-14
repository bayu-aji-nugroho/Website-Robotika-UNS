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
  /** Warna notifikasi "Open Recruitment dibuka" (#rrggbb). null = hijau bawaan. Diatur di admin. */
  oprec_banner_color?: string | null;
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
      .select("id, is_oprec, label, announcement_at, oprec_open_at, oprec_close_at, oprec_banner_color, created_at, updated_at")
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
      oprec_banner_color: data.oprec_banner_color ?? null,
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

/** Warna bawaan notifikasi OPREC (hijau), sama dengan admin (utils/bannerColor.ts) */
export const DEFAULT_OPREC_BANNER_COLOR = "#059669";

function relativeLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Warna latar & teks notifikasi OPREC. Teks putih diutamakan selama kontrasnya >= 3:1,
 * bila latar terlalu terang pakai teks hitam (logika sama dengan pratinjau di admin).
 */
export function getOprecBannerColors(color?: string | null): { background: string; text: string } {
  const background = color && /^#[0-9a-f]{6}$/i.test(color) ? color.toLowerCase() : DEFAULT_OPREC_BANNER_COLOR;
  const whiteContrast = 1.05 / (relativeLuminance(background) + 0.05);
  return { background, text: whiteContrast >= 3 ? "#ffffff" : "#18181b" };
}

/** true bila waktu pengumuman hasil seleksi sudah tiba. */
export function isAnnouncementOpen(settings: Pick<AdminSettings, "announcement_at">, nowMs: number): boolean {
  if (!settings.announcement_at) return false;
  return new Date(settings.announcement_at).getTime() <= nowMs;
}
