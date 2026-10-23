/*
-----------------------------------------
nama file: [ not-found.tsx ] 
fungsi [ Halaman error 404 minimalis dan terfokus untuk Robotika UNS dengan pesan jelas dan tombol kembali ke beranda ]
-----------------------------------------------
*/

"use client";

import React from "react";
import Link from "next/link";
import { Container, ThemeToggle } from "@/src/components/atoms";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafd] dark:bg-[#121316] text-[#102e4a] dark:text-[#f4f4f5] transition-colors duration-200 relative">
    
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      
      <main className="flex-1 flex items-center justify-center p-4">
        <Container size="md">
          <div className="max-w-md mx-auto text-center space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs">
              <span className="text-xs font-mono font-bold tracking-wider text-zinc-600 dark:text-zinc-400 uppercase">
                Kode Kesalahan 404
              </span>
            </div>

            <div className="space-y-2.5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Halaman Tidak Ditemukan
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Tautan yang Anda tuju mungkin salah ketik, telah dipindahkan, atau halaman tersebut sudah tidak tersedia di portal Robotika UNS.
              </p>
            </div>

    
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#B22234] hover:bg-[#8B0000] dark:bg-[#C52233] dark:hover:bg-[#B22234] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                <Home className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
