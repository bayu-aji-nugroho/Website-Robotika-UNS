"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "../atoms";
import { AnimatedWordBadge } from "../molecules";

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang-kami" className="py-12 sm:py-16 lg:py-20 bg-white border-t border-[#f4f4f5]">
      <Container size="lg">
        <div className="space-y-10 sm:space-y-12 lg:space-y-16">
          {/* Header & Description Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
            {/* Left Header */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#B22234] font-bold">01</span>
                <span className="text-[#71717a] tracking-wider uppercase font-sans font-semibold text-[11px]">
                  TENTANG KAMI
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-[#18181b] tracking-tight leading-[1.3] max-w-xl font-['Plus_Jakarta_Sans',sans-serif]">
                <span className="block">Tempat di mana</span>
                <span className="inline-flex items-center flex-wrap gap-x-2 gap-y-1.5 sm:gap-x-2.5 sm:gap-y-2 mt-1 sm:mt-1.5">
                  <AnimatedWordBadge />
                  <motion.span
                    layout
                    transition={{
                      layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                    }}
                  >
                    jadi satu.
                  </motion.span>
                </span>
              </h2>
            </div>

            {/* Right Description */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-3.5 pt-0 lg:pt-2">
              <p className="text-sm sm:text-base font-semibold text-[#18181b] leading-relaxed">
                Organisasi Robotika Universitas Sebelas Maret bertransformasi dari inisiatif di bawah naungan Program Studi Fisika menjadi <span className="text-[#B22234] font-bold">Unit Kegiatan Mahasiswa</span> di tingkat universitas.
              </p>
              <p className="text-xs sm:text-sm text-[#52525b] leading-relaxed">
                Perluasan status ini bertujuan merangkul potensi mahasiswa dari lintas program studi. Melalui kolaborasi multidisipliner tersebut, kami berkomitmen mengakselerasi riset dan pengembangan teknologi robotika secara komprehensif, sekaligus meraih prestasi unggul dalam berbagai <span className="font-bold">kompetisi nasional maupun <span className="text-[#B22234]">internasional</span></span>.
              </p>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#f4f4f5]" />

          {/* Statistics ("Robotika Dalam Angka") Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
            {/* Left Label */}
            <div className="lg:col-span-4 space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-[#18181b]">Robotika dalam angka</h3>
              <p className="text-[11px] sm:text-xs text-[#71717a]">
                Perkembangan riset, karya teknologi, dan partisipasi mahasiswa.
              </p>
            </div>

            {/* Right 3 Stat Columns */}
            <div className="lg:col-span-8 grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {/* Stat 1 */}
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#B22234] block font-['Plus_Jakarta_Sans',sans-serif]">
                  30+
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#18181b]">Anggota aktif</h4>
                <p className="hidden sm:block text-[10px] sm:text-xs text-[#71717a] leading-tight sm:leading-normal">Mahasiswa terdaftar bersama UKM.</p>
              </div>

              {/* Stat 2 */}
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#B22234] block font-['Plus_Jakarta_Sans',sans-serif]">
                  5+
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#18181b]">Robot dikembangkan</h4>
                <p className="hidden sm:block text-[10px] sm:text-xs text-[#71717a] leading-tight sm:leading-normal">Prototipe riset & kompetisi.</p>
              </div>

              {/* Stat 3 */}
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#B22234] block font-['Plus_Jakarta_Sans',sans-serif]">
                  2
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#18181b]">Tim robotika</h4>
                <p className="hidden sm:block text-[10px] sm:text-xs text-[#71717a] leading-tight sm:leading-normal">Tim aktif dalam organisasi.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
