/*
-----------------------------------------
nama file: [ RegistrationTemplate.tsx ] 
fungsi [ Komponen template halaman pendaftaran calon anggota baru dengan pengecekan gerbang OPREC basis data, navigasi profil pengguna, dan wadah formulir atau pemblokir akses jika pendaftaran ditutup ]
-----------------------------------------------
*/

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegistrationForm, RegistrationClosedBlocker } from "../organisms";
import { Container, ThemeToggle } from "../atoms";
import { NavUserMenu } from "../molecules";
import {
  GoogleAuthUser,
  getAuthenticatedUser,
  signOutUser,
  supabase,
  formatSupabaseUser,
  AdminSettings,
  DEFAULT_ADMIN_SETTINGS,
  getAdminSettings,
} from "@/src/services";

interface RegistrationTemplateProps {
  initialSettings?: AdminSettings | null;
}

export const RegistrationTemplate: React.FC<RegistrationTemplateProps> = ({
  initialSettings,
}) => {
  const [user, setUser] = useState<GoogleAuthUser | null>(null);
  const [settings, setSettings] = useState<AdminSettings>(
    initialSettings || DEFAULT_ADMIN_SETTINGS
  );

  useEffect(() => {
    let isMounted = true;

    // Ambil konfigurasi status OPREC terpusat dari database
    getAdminSettings().then((s) => {
      if (isMounted) setSettings(s);
    });

    getAuthenticatedUser().then((u) => {
      if (isMounted) setUser(u);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
      } else {
        setUser(formatSupabaseUser(session.user));
      }
    });

    const handleSignoutEvent = () => {
      if (isMounted) setUser(null);
    };

    window.addEventListener("supabase-auth-signout", handleSignoutEvent);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener("supabase-auth-signout", handleSignoutEvent);
    };
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F8] dark:bg-[#121316] text-[#18181b] dark:text-[#f4f4f5] print:bg-white print:min-h-0 transition-colors duration-200">
      <main className="flex-1 py-4 sm:py-8 lg:py-12 print:py-0">
        <Container size="lg" className="print:max-w-none print:p-0">
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 print:max-w-none print:space-y-0 print:m-0">
            <div className="print:hidden flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-1 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
                <span>Kembali ke Beranda</span>
              </Link>

              <div className="flex items-center gap-2.5">
                {user && <NavUserMenu user={user} onLogout={handleLogout} />}
                <ThemeToggle />
              </div>
            </div>

            <h1 className="sr-only">Pendaftaran Calon Anggota Robotika UNS</h1>

            <section aria-label="Gerbang Pendaftaran Anggota">
              {settings.is_oprec ? (
                <RegistrationForm />
              ) : (
                <RegistrationClosedBlocker label={settings.label} />
              )}
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
};
