/*
-----------------------------------------
nama file: [ AboutSection.tsx ]
fungsi [ Komponen section profil tentang organisasi Robotika UNS mengikuti tema terang dan gelap, menampilkan animasi kata interaktif, sejarah singkat, dan kartu statistik pencapaian organisasi dengan animasi hitung saat di-scroll ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container, CountUp, Reveal, SkeletonReveal } from "../atoms";
import { useLandingReveal } from "@/src/context";
import { AnimatedWordBadge } from "../molecules";

const STATS = [
  { to: 30, suffix: "+", label: "Anggota aktif" },
  { to: 12, suffix: "+", label: "Robot dikembangkan" },
  { to: 2, suffix: "", label: "Tim robotika" },
];

const DOT_GRID_CLASS = "bg-[radial-gradient(#a1a1aa_1px,transparent_1px)] [background-size:16px_16px] opacity-40";

export const AboutSection: React.FC = () => {
  const { ready } = useLandingReveal();

  return (
    <section id="tentang-kami" className="relative z-10 py-14 sm:py-20 lg:py-24 bg-white dark:bg-[#121316] transition-colors duration-200">
      {/* Sengaja di luar pembungkus overflow-hidden agar lingkaran berlanjut ke section Ekosistem */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-32 size-80 rounded-full border-t-2 border-[#B22234]/40 dark:border-[#EE3B47]/60 bg-[#B22234]/10 dark:bg-[#B22234]/15 blur-[1px]" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Memudar di tepi atas agar menyambung tanpa batas dengan hero */}
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_12rem)]">
          <div className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-[#B22234]/10 dark:bg-[#B22234]/20 blur-3xl" />
          <div className="absolute -right-24 -top-48 size-[32rem] rounded-full border border-[#B22234]/15 dark:border-[#EE3B47]/25" />
        </div>
        <div className={`absolute left-8 top-8 hidden h-12 w-36 lg:block ${DOT_GRID_CLASS}`} />
        <div className={`absolute bottom-10 right-8 hidden h-12 w-36 lg:block ${DOT_GRID_CLASS}`} />
        <div className="absolute right-8 top-10 hidden items-center gap-3 text-[10px] font-semibold tracking-[0.3em] text-[#71717a] dark:text-zinc-400 lg:flex">
          ROBOTIKA UNS
          <span className="h-px w-48 bg-black/10 dark:bg-white/20" />
          <span className="size-1.5 bg-[#B22234] dark:bg-[#EE3B47]" />
        </div>
        <div className="absolute bottom-8 left-8 hidden items-center gap-3 text-[10px] font-semibold tracking-[0.3em] text-[#71717a] dark:text-zinc-400 lg:flex">
          UNS
          <span className="h-px w-48 bg-black/10 dark:bg-white/20" />
          <span className="size-1.5 bg-[#B22234] dark:bg-[#EE3B47]" />
        </div>
      </div>

      <Container size="lg" className="relative">
        <div className="space-y-10 sm:space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-center">
            <Reveal className="space-y-4 sm:space-y-5">
              <SkeletonReveal ready={ready} className="w-fit">
                <p className="border-l-[3px] border-[#B22234] dark:border-[#EE3B47] pl-3 text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-[#52525b] dark:text-zinc-300">
                  TENTANG ROBOTIKA UNS
                </p>
              </SkeletonReveal>
              <SkeletonReveal ready={ready} lines={2} className="text-3xl sm:text-5xl lg:text-[56px]">
                <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-[#18181b] dark:text-zinc-100 tracking-tight leading-[1.15]">
                  <span className="block">Ketika ide dan</span>
                  <span className="inline-flex items-center flex-wrap gap-x-2 sm:gap-x-3 gap-y-1.5">
                    <AnimatedWordBadge />
                    <motion.span
                      layout
                      transition={{
                        layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                      }}
                    >
                      bertemu.
                    </motion.span>
                  </span>
                </h2>
              </SkeletonReveal>
              <div aria-hidden="true" className="h-1 w-40 sm:w-56 rounded-full bg-gradient-to-r from-[#B22234] via-[#B22234]/30 dark:from-[#EE3B47] dark:via-[#EE3B47]/30 to-transparent" />
            </Reveal>

            <div aria-hidden="true" className="hidden h-full w-px bg-[#e4e4e7] dark:bg-zinc-800 lg:block" />

            <Reveal delay={0.1} className="space-y-3 sm:space-y-4">
              <SkeletonReveal ready={ready} lines={2}>
                <p className="text-sm sm:text-base font-medium text-[#18181b] dark:text-zinc-100 leading-relaxed">
                  Berawal dari inisiatif Program Studi Fisika hingga menjadi <span className="text-[#B22234] dark:text-[#EE3B47] font-bold">Unit Kegiatan Mahasiswa Universitas Sebelas Maret.</span>
                </p>
              </SkeletonReveal>
              <SkeletonReveal ready={ready} lines={3}>
                <p className="text-xs sm:text-sm text-[#52525b] dark:text-zinc-300 leading-relaxed">
                  Kami mewadahi potensi mahasiswa dalam bidang robotika, mengembangkan inovasi, dan berkompetisi di tingkat <span className="font-semibold text-[#B22234] dark:text-[#EE3B47]">nasional</span> maupun <span className="font-semibold text-[#B22234] dark:text-[#EE3B47]">internasional</span>.
                </p>
              </SkeletonReveal>
            </Reveal>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#e4e4e7] dark:divide-zinc-800 rounded-2xl border border-[#e4e4e7] dark:border-zinc-800 bg-[#F9F9F8] dark:bg-[#1a1b20] py-5 sm:py-8 transition-colors duration-200">
            {STATS.map(({ to, suffix, label }, i) => (
              <Reveal key={label} delay={i * 0.1} className="px-3 sm:px-8 lg:px-12">
                <SkeletonReveal ready={ready} className="w-fit">
                  <CountUp to={to} suffix={suffix} start={ready} className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#B22234] dark:text-[#EE3B47] block tracking-tight" />
                </SkeletonReveal>
                <SkeletonReveal ready={ready} className="w-fit">
                  <span className="text-[11px] sm:text-sm font-semibold text-[#18181b] dark:text-zinc-200 block mt-1">
                    {label}
                  </span>
                </SkeletonReveal>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );

};
