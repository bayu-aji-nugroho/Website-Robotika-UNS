/*
-----------------------------------------
nama file: [ notification.service.ts ]
fungsi [ Layanan lonceng notifikasi: mengambil pengumuman dari admin beserta jumlah yang belum dibaca, dan menandai semuanya sudah dibaca, melalui RPC SECURITY DEFINER di Supabase ]
-----------------------------------------------
*/

import { supabase } from "../supabase/supabaseClient";

export interface ApplicantNotification {
  id: string;
  title: string;
  body: string;
  link_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MyNotifications {
  items: ApplicantNotification[];
  unread_count: number;
  last_read_at: string | null;
}

const EMPTY: MyNotifications = { items: [], unread_count: 0, last_read_at: null };

export async function getMyNotifications(limit = 30): Promise<{ data: MyNotifications; error: string | null }> {
  const { data, error } = await supabase.rpc("get_my_notifications", { p_limit: limit });
  if (error) {
    return { data: EMPTY, error: error.message || "Gagal memuat notifikasi." };
  }
  return { data: (data as MyNotifications | null) || EMPTY, error: null };
}

/** Tandai semua pengumuman sudah dibaca; mengembalikan waktu baca (ISO) */
export async function markNotificationsRead(): Promise<string | null> {
  const { data, error } = await supabase.rpc("mark_notifications_read");
  if (error) return null;
  return (data as string | null) || null;
}
