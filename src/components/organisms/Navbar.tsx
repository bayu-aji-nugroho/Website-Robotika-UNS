/*
-----------------------------------------
nama file: [ Navbar.tsx ] 
fungsi [ Komponen navigasi bar utama di bagian atas halaman dengan logo brand, tautan navigasi, tombol pendaftaran, avatar profil pengguna terautentikasi (dengan aksi logout saja), dan menu responsif mobile ]
-----------------------------------------------
*/

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container, ThemeToggle } from "../atoms";
import { NavBrand, NavLinks, NavUserMenu } from "../molecules";
import { Menu, X, LogOut } from "lucide-react";
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
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0c0d0e]/95 backdrop-blur-md transition-all duration-200 ${
        scrolled
          ? "border-b border-[#e4e4e7] dark:border-zinc-800 py-3 sm:py-4 shadow-2xs"
          : "py-3.5 sm:py-6"
      }`}
    >
      <Container size="lg">
        <div className="flex items-center justify-between">
          <NavBrand />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
            <div className="flex items-center gap-2.5">
              <Link
                href="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#B22234] hover:bg-[#8B0000] rounded-md transition-colors shadow-xs"
              >
                Daftar Sekarang
              </Link>

              {/* Avatar Profil Pengguna (Hanya Logout) */}
              {user && (
                <NavUserMenu user={user} onLogout={handleLogout} />
              )}

              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
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
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 rounded-xl bg-white dark:bg-[#141518] border border-[#e4e4e7] dark:border-zinc-800 space-y-3 shadow-lg">
            <NavLinks
              className="flex-col items-start gap-3"
              onItemClick={() => setMobileMenuOpen(false)}
            />

            <div className="pt-3 border-t border-[#e4e4e7] dark:border-zinc-800 space-y-2">
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-xs font-semibold text-white bg-[#B22234] hover:bg-[#8B0000] rounded-md transition-colors"
              >
                Daftar Sekarang
              </Link>

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
        )}
      </Container>
    </header>
  );
};
