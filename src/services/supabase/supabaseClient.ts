/*
-----------------------------------------
nama file: [ supabaseClient.ts ] 
fungsi [ Inisialisasi Supabase JS Client dan wrapper fungsi helper autentikasi Google OAuth serta manajemen sesi pengguna. ]
-----------------------------------------------
*/

import { createClient, SupabaseClient, User, Session } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nrjorfpizemjgtaajgvh.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yam9yZnBpemVtamd0YWFqZ3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMTEzOTIsImV4cCI6MjEwNzg4NzM5Mn0.KF1eOOfUIjuY1VsS-rPd2vu1AbD7XZZlKX4irNd9AlI";

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface GoogleAuthUser {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  isMock?: boolean;
}

const LOCAL_STORAGE_MOCK_USER_KEY = "robotika_uns_mock_auth_user";

/**
 * Memulai alur login dengan Akun Google melalui Supabase Auth
 */
export async function signInWithGoogle(redirectTo?: string) {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "http://localhost:3000";

  const targetRedirect = redirectTo || `${origin}/register`;

  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: targetRedirect,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
}

/**
 * Logout dari sesi Supabase Auth dan bersihkan mock user jika ada
 */
export async function signOutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY);
    window.dispatchEvent(new Event("supabase-auth-signout"));
  }
  return await supabase.auth.signOut();
}

/**
 * Helper untuk mendapatkan data user terautentikasi (baik dari Supabase session maupun mock mode)
 */
export async function getAuthenticatedUser(): Promise<GoogleAuthUser | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return formatSupabaseUser(session.user);
    }
  } catch (error) {
    console.warn("Gagal membaca sesi Supabase:", error);
  }

  // Cek mock user jika sedang dalam pengujian lokal
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as GoogleAuthUser;
      } catch {
        return null;
      }
    }
  }

  return null;
}

/**
 * Format user objek Supabase menjadi struktur yang mudah digunakan di UI
 */
export function formatSupabaseUser(user: User): GoogleAuthUser {
  const meta = user.user_metadata || {};
  return {
    id: user.id,
    email: user.email || meta.email,
    fullName:
      meta.full_name ||
      meta.name ||
      (user.email ? user.email.split("@")[0].replace(/[._]/g, " ") : "Calon Anggota"),
    avatarUrl: meta.avatar_url || meta.picture,
    isMock: false,
  };
}

/**
 * Helper login simulasi untuk pengujian lokal saat Google OAuth di Supabase belum disetup
 */
export function setMockGoogleUser(customData?: Partial<GoogleAuthUser>): GoogleAuthUser {
  const mockUser: GoogleAuthUser = {
    id: `mock-google-${Date.now()}`,
    email: customData?.email || "dimas.arya@student.uns.ac.id",
    fullName: customData?.fullName || "Dimas Arya Prasetya",
    avatarUrl:
      customData?.avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    isMock: true,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_MOCK_USER_KEY, JSON.stringify(mockUser));
  }

  return mockUser;
}
