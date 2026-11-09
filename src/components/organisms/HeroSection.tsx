/*
-----------------------------------------
nama file: [ HeroSection.tsx ] 
fungsi [ Komponen hero section beranda yang menampilkan tagline utama, deskripsi singkat organisasi, tombol aksi pendaftaran, dan visual robot ]
-----------------------------------------------
*/

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Container, DrawnText, SkeletonReveal } from "../atoms";
import { HeroVisual } from "../molecules";
import { heroTitleRobotika, heroTitleUniversity } from "@/data/heroTitlePaths";
import { getAdminSettings } from "@/src/services";
import { useLandingReveal } from "@/src/context";

// Selaras dengan animasi gambar judul; batas maksimal mencegah skeleton tertahan jika foto gagal dimuat
const SKELETON_MIN_MS = 1800;
const SKELETON_MAX_MS = 4000;

export const HeroSection: React.FC = () => {
  const { ready, markReady } = useLandingReveal();
  useEffect(() => {
    let isMounted = true;
    // Status OPREC ditampilkan oleh notifikasi di bawah navbar (OprecOpenBanner);
    // pengaturan tetap dimuat di sini agar skeleton hero menunggu data siap.
    const settingsLoaded = getAdminSettings();

    const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    Promise.race([
      Promise.all([settingsLoaded, delay(reducedMotion ? 0 : SKELETON_MIN_MS)]),
      delay(SKELETON_MAX_MS),
    ]).then(() => {
      if (isMounted) markReady();
    });

    return () => {
      isMounted = false;
    };
  }, [markReady]);

  return (
    <section className="relative overflow-hidden pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-16 bg-white dark:bg-[#121316] transition-colors duration-200">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 right-0 hidden h-2/3 w-44 translate-x-1/3 skew-x-[-24deg] lg:block">
          <SkeletonReveal ready={ready} className="h-full" skeletonClassName="rounded-none">
            <div className="h-full bg-gradient-to-b from-[#B22234] to-[#d8384b]" />
          </SkeletonReveal>
        </div>
        <div className="absolute -bottom-6 right-0 h-16 sm:h-24 w-2/3 lg:w-1/3 translate-x-16 skew-x-[-32deg]">
          <SkeletonReveal ready={ready} className="h-full" skeletonClassName="rounded-none rounded-tl-3xl">
            <div className="h-full rounded-tl-3xl bg-gradient-to-r from-[#d8384b] to-[#8B0000]" />
          </SkeletonReveal>
        </div>
        <div className="absolute left-[32%] top-24 hidden size-28 opacity-40 lg:block bg-[radial-gradient(#a1a1aa_1.2px,transparent_1.2px)] [background-size:18px_18px]" />
        <span className="absolute -bottom-6 left-2 hidden select-none text-[9rem] lg:block font-extrabold leading-none text-black/[0.03] dark:text-white/[0.03]">
          UNS
        </span>
      </div>

      <Container size="lg" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
            <div className="space-y-3 sm:space-y-5 motion-safe:animate-rise [animation-delay:100ms]">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#18181b] dark:text-zinc-100 tracking-tight leading-[1.15]">
                <span className="sr-only">Robotika Universitas Sebelas Maret</span>
                <DrawnText line={heroTitleRobotika} delay={0.1} stagger={0.07} className="text-[#B22234] dark:text-[#EE3B47]" />
                <span className="block text-2xl sm:text-4xl lg:text-5xl mt-0.5 sm:mt-1">
                  <DrawnText line={heroTitleUniversity} delay={0.5} stagger={0.03} />
                </span>
              </h1>

              <div className="space-y-1.5 sm:space-y-2 pt-1">
                <SkeletonReveal ready={ready} className="w-fit">
                  <p className="flex items-center gap-3 text-sm sm:text-lg font-semibold text-[#18181b] dark:text-zinc-100 tracking-tight">
                    <span>Innovate and <span className="text-[#B22234] dark:text-[#EE3B47] font-bold">Elevate</span></span>
                    <span aria-hidden="true" className="h-px w-16 sm:w-28 bg-gradient-to-r from-[#B22234] to-transparent" />
                  </p>
                </SkeletonReveal>
                <SkeletonReveal ready={ready} lines={3} className="max-w-lg">
                  <p className="text-xs sm:text-base text-[#71717a] dark:text-zinc-400 leading-relaxed max-w-lg">
                    Tempat riset, inovasi, dan pengembangan robotika mahasiswa Universitas Sebelas Maret. Berkomitmen merancang teknologi serta <span className="font-bold text-[#18181b] dark:text-zinc-200">berprestasi di tingkat nasional dan</span> <span className="font-bold text-[#B22234] dark:text-[#EE3B47]">internasional</span>.
                  </p>
                </SkeletonReveal>
              </div>
            </div>

            <div className="space-y-2.5 pt-1 motion-safe:animate-rise [animation-delay:200ms]">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <SkeletonReveal ready={ready} className="flex" skeletonClassName="rounded-sm">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#B22234] hover:bg-[#8B0000] dark:bg-[#C52233] dark:hover:bg-[#B22234] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-md shadow-[#B22234]/25"
                  >
                    <ArrowRight className="size-4" aria-hidden="true" />
                    <span>Daftar Sekarang</span>
                  </Link>
                </SkeletonReveal>
                <SkeletonReveal ready={ready} className="flex" skeletonClassName="rounded-sm">
                  <Link
                    href="/pengumuman"
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-zinc-900 border border-[#e4e4e7] dark:border-zinc-700 hover:bg-[#f4f4f5] dark:hover:bg-zinc-800 text-[#18181b] dark:text-zinc-100 text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <Play className="size-3.5 fill-current" aria-hidden="true" />
                    <span>Hasil Seleksi</span>
                  </Link>
                </SkeletonReveal>
              </div>
            </div>
          </div>

          <div className="block lg:col-span-6 w-full pt-1 sm:pt-4 lg:pt-0 motion-safe:animate-rise [animation-delay:250ms]">
            <HeroVisual ready={ready} />
          </div>
        </div>
      </Container>
    </section>
  );
};
