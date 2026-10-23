/*
-----------------------------------------
nama file: [ HeroSection.tsx ] 
fungsi [ Komponen hero section beranda yang menampilkan tagline utama, deskripsi singkat organisasi, tombol aksi pendaftaran, dan foto dokumentasi kegiatan ]
-----------------------------------------------
*/

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../atoms";
import { AdminSettings, DEFAULT_ADMIN_SETTINGS, getAdminSettings } from "@/src/services";

export const HeroSection: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    getAdminSettings().then((s) => {
      if (isMounted) setSettings(s);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 bg-white dark:bg-[#121316] transition-colors duration-200">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
            <div>
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md border border-[#e4e4e7] dark:border-zinc-800/80 bg-white dark:bg-[#1a1b20] text-xs shadow-xs">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#B22234] dark:bg-[#C52233] text-white">
                  OPREC
                </span>
                <span className="text-[#52525b] dark:text-zinc-300 font-medium text-xs">
                  {settings.label}
                </span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-5">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#18181b] dark:text-zinc-100 tracking-tight leading-[1.15] font-[family-name:var(--font-space-grotesk)]">
                <span className="block text-[#B22234] dark:text-[#EE3B47]">Robotika</span>
                <span className="block text-2xl sm:text-4xl lg:text-5xl font-bold sm:font-extrabold mt-0.5 sm:mt-1">
                  Universitas Sebelas Maret
                </span>
              </h1>

              <div className="space-y-1.5 sm:space-y-2 pt-1">
                <p className="text-sm sm:text-lg font-semibold text-[#18181b] dark:text-zinc-100 tracking-tight">
                  Innovate and <span className="text-[#B22234] dark:text-[#EE3B47] font-bold">Elevate</span>
                </p>
                <p className="text-xs sm:text-base text-[#71717a] dark:text-zinc-400 leading-relaxed max-w-lg">
                  Tempat riset, inovasi, dan pengembangan robotika mahasiswa Universitas Sebelas Maret. Berkomitmen merancang teknologi serta <span className="font-bold text-[#18181b] dark:text-zinc-200">berprestasi di tingkat nasional dan</span> <span className="font-bold text-[#B22234] dark:text-[#EE3B47]">internasional</span>.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-4 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#B22234] hover:bg-[#8B0000] dark:bg-[#C52233] dark:hover:bg-[#B22234] text-white text-xs font-semibold rounded-sm transition-colors shadow-sm"
                >
                  <span>Daftar Sekarang</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="block lg:col-span-6 w-full pt-1 sm:pt-4 lg:pt-0">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] rounded-lg overflow-hidden bg-[#f4f4f5] dark:bg-zinc-900 border border-[#e4e4e7] dark:border-zinc-800 flex items-center justify-center group shadow-xs">
              <Image
                src="https://lh3.googleusercontent.com/d/1d5OfoyB7kNo5F8ybHxzZ7WxOVKNqEpEY"
                alt="Robotika Universitas Sebelas Maret"
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                unoptimized
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
