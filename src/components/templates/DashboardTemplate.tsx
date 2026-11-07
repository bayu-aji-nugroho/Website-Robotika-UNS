/*
-----------------------------------------
nama file: [ DashboardTemplate.tsx ]
fungsi [ Komponen template halaman dashboard akun pendaftar dengan manajemen status autentikasi, pemuatan data pendaftaran, navigasi, dan tema ]
-----------------------------------------------
*/

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container, ThemeToggle } from "../atoms";
import { NavUserMenu } from "../molecules";
import { AccountDashboard } from "../organisms";
import {
  GoogleAuthUser,
  RegistrationProgressData,
  getAuthenticatedUser,
  getRegistrationProgress,
  signOutUser,
  supabase,
} from "@/src/services";

export const DashboardTemplate: React.FC = () => {
  const [user, setUser] = useState<GoogleAuthUser | null>(null);
  const [progress, setProgress] = useState<RegistrationProgressData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const loadedUserId = useRef<string | null>(null);

  const loadData = useCallback(() => {
    return getAuthenticatedUser().then(async (u) => {
      loadedUserId.current = u?.id ?? null;
      setUser(u);
      setProgress(u ? await getRegistrationProgress() : null);
      setIsLoading(false);
    });
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    loadData();
  };

  const clearData = useCallback(() => {
    loadedUserId.current = null;
    setUser(null);
    setProgress(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    loadData();

    // SIGNED_IN juga terpicu saat tab kembali aktif, muat ulang hanya jika akunnya berganti
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === "SIGNED_OUT") {
        clearData();
      } else if (event === "SIGNED_IN" && session?.user.id !== loadedUserId.current) {
        loadData();
      }
    });

    const handleSignoutEvent = () => {
      if (isMounted) clearData();
    };

    window.addEventListener("supabase-auth-signout", handleSignoutEvent);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener("supabase-auth-signout", handleSignoutEvent);
    };
  }, [loadData, clearData]);

  const handleLogout = async () => {
    await signOutUser();
    clearData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F8] dark:bg-[#121316] text-[#18181b] dark:text-[#f4f4f5] transition-colors duration-200">
      <main className="flex-1 py-4 sm:py-8 lg:py-12">
        <Container size="lg">
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
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

            <h1 className="sr-only">Dashboard Akun Pendaftar Robotika UNS</h1>

            <section aria-label="Detail Data Pendaftaran">
              <AccountDashboard
                user={user}
                progress={progress}
                isLoading={isLoading}
                onRefresh={handleRefresh}
              />
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
};
