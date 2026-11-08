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
import { AnnouncementPendingCard, AnnouncementResultCard } from "../organisms";
import {
  GoogleAuthUser,
  getAuthenticatedUser,
  signOutUser,
  supabase,
  formatSupabaseUser,
  ApplicantAnnouncementData,
  getApplicantAnnouncement,
  getAdminSettings,
  isAnnouncementOpen,
} from "@/src/services";

// Batas setTimeout browser ~24,8 hari; cukup jadwalkan muat ulang otomatis bila < 1 hari
const AUTO_RELOAD_WINDOW_MS = 24 * 60 * 60 * 1000;

async function fetchAnnouncementPage() {
  try {
    const [user, settings] = await Promise.all([getAuthenticatedUser(), getAdminSettings()]);
    const announcement = await getApplicantAnnouncement();
    return { user, settings, announcement, fetchedAt: Date.now() };
  } catch (err) {
    console.error("Gagal memuat status pengumuman:", err);
    return null;
  }
}

export const AnnouncementTemplate: React.FC = () => {
  const [user, setUser] = useState<GoogleAuthUser | null>(null);
  const [announcementData, setAnnouncementData] = useState<ApplicantAnnouncementData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [announcementAt, setAnnouncementAt] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const applyData = useCallback((result: Awaited<ReturnType<typeof fetchAnnouncementPage>>) => {
    if (result) {
      setUser(result.user);
      setAnnouncementAt(result.settings.announcement_at ?? null);
      setIsOpen(isAnnouncementOpen(result.settings, result.fetchedAt));
      setIsAuthenticated(result.announcement.isAuthenticated);
      setAnnouncementData(result.announcement.data);
    }
    setIsLoading(false);
  }, []);

  const loadData = useCallback(() => {
    setIsLoading(true);
    return fetchAnnouncementPage().then(applyData);
  }, [applyData]);

  useEffect(() => {
    let isMounted = true;

    fetchAnnouncementPage().then((result) => {
      if (isMounted) applyData(result);
    });

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
  }, [applyData, loadData]);

  // Muat ulang otomatis tepat saat waktu pengumuman tiba (bila halaman sedang dibuka)
  useEffect(() => {
    if (isOpen || !announcementAt) return;
    const delay = new Date(announcementAt).getTime() - Date.now();
    if (delay <= 0 || delay > AUTO_RELOAD_WINDOW_MS) return;
    const timer = window.setTimeout(() => {
      loadData();
    }, delay + 1000);
    return () => window.clearTimeout(timer);
  }, [announcementAt, isOpen, loadData]);

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
              {!isLoading && !isOpen ? (
                <AnnouncementPendingCard announcementAt={announcementAt} onRefresh={loadData} />
              ) : (
                <AnnouncementResultCard
                  isAuthenticated={isAuthenticated}
                  data={announcementData}
                  isLoading={isLoading}
                  onRefresh={loadData}
                />
              )}
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
};
