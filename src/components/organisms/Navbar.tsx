/*
-----------------------------------------
nama file: [ Navbar.tsx ] 
fungsi [ Komponen navigasi bar utama di bagian atas halaman dengan logo brand, tautan navigasi, tombol pendaftaran, avatar profil pengguna terautentikasi (dengan tautan dashboard akun dan logout), dan menu responsif mobile ]
-----------------------------------------------
*/

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container, ThemeToggle } from "../atoms";
import { NavBrand, NavLinks, NavNotificationBell, NavUserMenu } from "../molecules";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { OprecOpenBanner } from "./OprecOpenBanner";
import {
  GoogleAuthUser,
  getAuthenticatedUser,
  signOutUser,
  supabase,
  formatSupabaseUser,
} from "@/src/services";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<GoogleAuthUser | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sinkronisasi status autentikasi Google Supabase di Navbar
  useEffect(() => {
    let isMounted = true;

    getAuthenticatedUser().then((u) => {
      if (isMounted) setUser(u);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session?.user) {
          setUser(formatSupabaseUser(session.user));
        } else {
          setUser(null);
        }
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md transition-all duration-300 ease-out ${
        scrolled
          ? "border-b border-[#e4e4e7] dark:border-zinc-800 py-3 sm:py-4 shadow-2xs"
          : "py-3.5 sm:py-6"
      }`}
    >
      {/* Notifikasi OPREC dibuka, menempel tepat di bawah navbar */}
      <OprecOpenBanner hidden={mobileMenuOpen} />
      <Container size="lg">
        <div className="flex items-center justify-between">
          <NavBrand />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
            <div className="flex items-center gap-2.5">
              <Link
                href="/pengumuman"
                className="px-3 py-1.5 text-xs font-semibold text-[#3f3f46] hover:text-[#18181b] dark:text-zinc-300 dark:hover:text-white transition-colors"
              >
                Hasil Seleksi
              </Link>

              <Link
                href="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#B22234] hover:bg-[#8B0000] dark:bg-[#C52233] dark:hover:bg-[#B22234] rounded-md transition-colors shadow-xs"
              >
                Daftar Sekarang
              </Link>

              {/* Lonceng notifikasi pengumuman dari admin */}
              {user && <NavNotificationBell key={user.id} />}

              {/* Avatar Profil Pengguna (Dashboard & Logout) */}
              {user && (
                <NavUserMenu user={user} onLogout={handleLogout} />
              )}

              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {user && <NavNotificationBell key={user.id} />}
            {user && (
              <NavUserMenu user={user} onLogout={handleLogout} />
            )}
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#18181b] dark:text-zinc-200 hover:bg-[#f4f4f5] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="mt-4 mb-1 p-4 rounded-xl bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 space-y-3 shadow-lg">
                <NavLinks
                  className="flex-col items-start gap-3"
                  onItemClick={() => setMobileMenuOpen(false)}
                />

                <div className="pt-3 border-t border-[#e4e4e7] dark:border-zinc-800 space-y-2">
                  <Link
                    href="/pengumuman"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 text-xs font-semibold text-[#18181b] dark:text-zinc-200 border border-[#e4e4e7] dark:border-zinc-800 rounded-md transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Hasil Seleksi
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 text-xs font-semibold text-white bg-[#B22234] hover:bg-[#8B0000] dark:bg-[#C52233] dark:hover:bg-[#B22234] rounded-md transition-colors"
                  >
                    Daftar Sekarang
                  </Link>

                  {/* Opsi Dashboard Mobile jika sedang Login */}
                  {user && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#18181b] dark:text-zinc-200 border border-[#e4e4e7] dark:border-zinc-800 rounded-md transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Dashboard Akun</span>
                    </Link>
                  )}

                  {/* Opsi Logout Mobile jika sedang Login */}
                  {user && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 rounded-md hover:bg-red-100/50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Logout)</span>
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-[#e4e4e7] dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#18181b] dark:text-zinc-300">
                    Mode Tampilan
                  </span>
                  <ThemeToggle showLabel />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
};
