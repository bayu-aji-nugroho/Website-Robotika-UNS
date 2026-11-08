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
      .select("id, is_oprec, label, announcement_at, created_at, updated_at")
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
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (err) {
    console.error("Kesalahan koneksi saat mengambil admin_settings:", err);
    return DEFAULT_ADMIN_SETTINGS;
  }
}

/** true bila waktu pengumuman hasil seleksi sudah tiba. */
export function isAnnouncementOpen(settings: Pick<AdminSettings, "announcement_at">, nowMs: number): boolean {
  if (!settings.announcement_at) return false;
  return new Date(settings.announcement_at).getTime() <= nowMs;
}
