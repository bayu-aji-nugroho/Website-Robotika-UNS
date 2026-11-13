/*
-----------------------------------------
nama file: [ supabaseClient.ts ] 
fungsi [ Inisialisasi Supabase JS Client dan wrapper fungsi helper autentikasi Google OAuth serta manajemen sesi pengguna. ]
-----------------------------------------------
*/

import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

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

// Pengaman sesi basi: getSession() hanya membaca sesi tersimpan di browser tanpa
// memastikan akunnya masih ada. Bila akun sudah dihapus dari server (mis. setelah
// pembersihan data uji), bersihkan sesi lokal sekali saat halaman dimuat agar
// pengguna langsung kembali ke tombol login, bukan melihat akun lama yang tidak valid.
if (typeof window !== "undefined") {
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (!session) return;
    const { error } = await supabase.auth.getUser();
    if (!error) return;
    const status = (error as { status?: number }).status;
    const isMissingUser =
      status === 401 ||
      status === 403 ||
      /not found|does not exist|session.*(missing|not found)|invalid/i.test(error.message);
    if (isMissingUser) {
      await supabase.auth.signOut({ scope: "local" });
      window.dispatchEvent(new Event("supabase-auth-signout"));
    }
  });
}

// ---------------------------------------------------------------------------
// Pembatasan login calon anggota: hanya email SSO mahasiswa UNS.
// Lapis 1: parameter `hd` di Google OAuth (pemilih akun hanya menawarkan domain ini).
// Lapis 2: sesi dengan email lain langsung dikeluarkan di sini + pesan ditampilkan.
// Lapis 3: database menolak data pendaftaran dari email lain (trigger applicants).
// Pengecualian: email non-SSO yang di-whitelist admin (akun SSO bermasalah) tetap diizinkan,
// dicek ke database lewat RPC am_i_allowed_applicant.
// ---------------------------------------------------------------------------
export const ALLOWED_APPLICANT_EMAIL_DOMAIN = "student.uns.ac.id";

export function isAllowedApplicantEmail(email?: string | null): boolean {
  return Boolean(email && email.trim().toLowerCase().endsWith(`@${ALLOWED_APPLICANT_EMAIL_DOMAIN}`));
}

// Hasil cek whitelist per email (agar RPC tidak dipanggil berulang-ulang)
const whitelistChecks = new Map<string, Promise<boolean>>();

/** true bila email SSO, atau email non-SSO yang sudah di-whitelist admin. */
export async function isApplicantAccessAllowed(email?: string | null): Promise<boolean> {
  if (isAllowedApplicantEmail(email)) return true;
  const key = (email || "").trim().toLowerCase();
  if (!key) return false;
  let check = whitelistChecks.get(key);
  if (!check) {
    check = Promise.resolve(supabase.rpc("am_i_allowed_applicant")).then(({ data, error }) => !error && data === true);
    whitelistChecks.set(key, check);
  }
  return check;
}

const SSO_REJECTED_KEY = "robotika_uns_sso_rejected_email";
let ssoRejectedEmail: string | null = null;
const ssoRejectionListeners = new Set<() => void>();

function notifySsoRejection() {
  ssoRejectionListeners.forEach((listener) => listener());
}

/** Email non-SSO terakhir yang ditolak (untuk ditampilkan sebagai pesan), atau null. */
export function getSsoRejectedEmail(): string | null {
  if (ssoRejectedEmail === null && typeof window !== "undefined") {
    try {
      ssoRejectedEmail = sessionStorage.getItem(SSO_REJECTED_KEY);
    } catch {
      // sessionStorage tidak tersedia
    }
  }
  return ssoRejectedEmail;
}

export function subscribeSsoRejection(listener: () => void): () => void {
  ssoRejectionListeners.add(listener);
  return () => ssoRejectionListeners.delete(listener);
}

export function clearSsoRejection() {
  ssoRejectedEmail = null;
  try {
    sessionStorage.removeItem(SSO_REJECTED_KEY);
  } catch {
    // abaikan
  }
  notifySsoRejection();
}

async function rejectNonSsoSession(email: string) {
  ssoRejectedEmail = email;
  try {
    sessionStorage.setItem(SSO_REJECTED_KEY, email);
  } catch {
    // abaikan
  }
  await supabase.auth.signOut({ scope: "local" });
  window.dispatchEvent(new Event("supabase-auth-signout"));
  notifySsoRejection();
}

if (typeof window !== "undefined") {
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    const email = session?.user?.email;
    if (session && !(await isApplicantAccessAllowed(email))) {
      rejectNonSsoSession(email || "akun ini");
    }
  });
  supabase.auth.onAuthStateChange((event, session) => {
    if (event !== "SIGNED_IN" || !session) return;
    const email = session.user.email;
    // Ditunda agar tidak memanggil RPC/signOut di dalam callback auth itu sendiri
    setTimeout(async () => {
      if (!(await isApplicantAccessAllowed(email))) {
        rejectNonSsoSession(email || "akun ini");
      } else if (getSsoRejectedEmail()) {
        clearSsoRejection();
      }
    }, 0);
  });
}

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
export async function signInWithGoogle(
  redirectTo?: string,
  options?: {
    /** true = pemilih akun Google tidak dibatasi domain SSO (hanya untuk email yang di-whitelist admin) */
    nonSso?: boolean;
  }
) {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let targetRedirect: string;
  if (!redirectTo) {
    targetRedirect = `${origin}/register`;
  } else if (redirectTo.startsWith("http://") || redirectTo.startsWith("https://")) {
    targetRedirect = redirectTo;
  } else {
    const path = redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`;
    targetRedirect = `${origin}${path}`;
  }

  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: targetRedirect,
      queryParams: options?.nonSso
        ? { access_type: "offline", prompt: "select_account consent" }
        : {
            access_type: "offline",
            prompt: "consent",
            // Pemilih akun Google hanya menawarkan akun SSO mahasiswa UNS
            hd: ALLOWED_APPLICANT_EMAIL_DOMAIN,
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
      // Sesi non-SSO yang tidak di-whitelist diperlakukan seperti belum login (dikeluarkan oleh pengaman di atas)
      return (await isApplicantAccessAllowed(session.user.email)) ? formatSupabaseUser(session.user) : null;
    }
  } catch (error) {
    console.warn("Gagal membaca sesi Supabase:", error);
  }

  // Cek mock user jika sedang dalam pengujian lokal di mode development
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
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
  if (process.env.NODE_ENV !== "development") {
    throw new Error("setMockGoogleUser hanya diizinkan pada mode development.");
  }

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
