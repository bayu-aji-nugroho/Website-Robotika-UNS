/*
-----------------------------------------
nama file: [ Navbar.tsx ] 
fungsi [ Komponen navigasi bar utama di bagian atas halaman dengan logo brand, tautan navigasi, tombol pendaftaran, dan menu responsif mobile ]
-----------------------------------------------
*/

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container, ThemeToggle } from "../atoms";
import { NavBrand, NavLinks } from "../molecules";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
            <div className="flex items-center gap-2.5">
              <Link
                href="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#B22234] hover:bg-[#8B0000] rounded-md transition-colors shadow-xs"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-[#18181b] dark:text-zinc-200 border border-[#e4e4e7] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-md hover:bg-[#f4f4f5] dark:hover:bg-zinc-800 transition-colors"
              >
                Masuk
              </Link>
              <ThemeToggle />
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#18181b] dark:text-zinc-200 hover:bg-[#f4f4f5] dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

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
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-xs font-semibold text-[#18181b] dark:text-zinc-200 border border-[#e4e4e7] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-md hover:bg-[#f4f4f5] dark:hover:bg-zinc-800"
              >
                Masuk
              </Link>
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

