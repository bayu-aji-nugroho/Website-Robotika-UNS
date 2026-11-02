/*
-----------------------------------------
nama file: [ AnnouncementTemplate.tsx ] 
fungsi [ Komponen template halaman pengumuman hasil OPREC Robotika UNS dengan manajemen status autentikasi, navigasi, dan tema ]
-----------------------------------------------
*/

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Container, ThemeToggle } from "../atoms";
import { NavUserMenu } from "../molecules";
import { AnnouncementResultCard } from "../organisms";
import {
  GoogleAuthUser,
  getAuthenticatedUser,
  signOutUser,
  supabase,
  formatSupabaseUser,
  ApplicantAnnouncementData,
  getApplicantAnnouncement,
} from "@/src/services";

export const AnnouncementTemplate: React.FC = () => {
  const [user, setUser] = useState<GoogleAuthUser | null>(null);
  const [announcementData, setAnnouncementData] = useState<ApplicantAnnouncementData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const u = await getAuthenticatedUser();
      setUser(u);

      const res = await getApplicantAnnouncement();
      setIsAuthenticated(res.isAuthenticated);
      setAnnouncementData(res.data);
    } catch (err) {
      console.error("Gagal memuat status pengumuman:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    loadData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
        setIsAuthenticated(false);
        setAnnouncementData(null);
      } else {
        setUser(formatSupabaseUser(session.user));
        loadData();
      }
    });

    const handleSignoutEvent = () => {
      if (isMounted) {
        setUser(null);
        setIsAuthenticated(false);
        setAnnouncementData(null);
      }
    };

    window.addEventListener("supabase-auth-signout", handleSignoutEvent);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener("supabase-auth-signout", handleSignoutEvent);
    };
  }, [loadData]);

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    setIsAuthenticated(false);
    setAnnouncementData(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F8] dark:bg-[#121316] text-[#18181b] dark:text-[#f4f4f5] transition-colors duration-200">
      <main className="flex-1 py-4 sm:py-8 lg:py-12">
        <Container size="lg">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Top Bar Controls */}
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2.5">
                {user && <NavUserMenu user={user} onLogout={handleLogout} />}
                <ThemeToggle />
              </div>
            </div>

            <h1 className="sr-only">Pengumuman Hasil OPREC Robotika UNS</h1>

            {/* Konten Kartu Status Pengumuman */}
            <section aria-label="Status Hasil OPREC">
              <AnnouncementResultCard
                isAuthenticated={isAuthenticated}
                data={announcementData}
                isLoading={isLoading}
                onRefresh={loadData}
              />
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
};
