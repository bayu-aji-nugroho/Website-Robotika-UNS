/*
-----------------------------------------
nama file: [ LoginTemplate.tsx ] 
fungsi [ Komponen template halaman login yang menyusun tata letak responsif, navigasi kembali, toggle tema tampilan, serta kartu formulir login terpusat. ]
-----------------------------------------------
*/

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container, ThemeToggle } from "../atoms";
import { LoginForm } from "../organisms";

export const LoginTemplate: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F8] dark:bg-[#0c0d0e] text-[#18181b] dark:text-[#f4f4f5] transition-colors duration-200">
      {/* Top Bar Navigasi */}
      <header className="w-full py-4 sm:py-6 border-b border-[#e4e4e7]/80 dark:border-zinc-800/80 bg-white/60 dark:bg-[#0c0d0e]/60 backdrop-blur-md">
        <Container size="lg">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-[#B22234] dark:text-zinc-400 dark:hover:text-red-400 transition-colors py-1 group"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-[#B22234] dark:group-hover:text-red-400 transition-colors" />
              <span>Kembali ke Beranda</span>
            </Link>

            {/* Switch Mode Gelap / Terang */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </Container>
      </header>

      {/* Konten Utama Terpusat */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 lg:py-16 px-4">
        <div className="w-full max-w-md mx-auto">
          <h1 className="sr-only">Halaman Masuk Portal Robotika Universitas Sebelas Maret</h1>
          <LoginForm />
        </div>
      </main>
    </div>
  );
};
