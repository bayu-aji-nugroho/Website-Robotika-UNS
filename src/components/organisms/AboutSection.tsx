/*
-----------------------------------------
nama file: [ AboutSection.tsx ] 
fungsi [ Komponen section profil tentang organisasi Robotika UNS, menampilkan animasi kata interaktif, sejarah singkat, dan statistik pencapaian organisasi ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "../atoms";
import { AnimatedWordBadge } from "../molecules";

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang-kami" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-[#121316] border-t border-[#f4f4f5] dark:border-zinc-800/80 transition-colors duration-200">
      <Container size="lg">
        <div className="space-y-10 sm:space-y-12 lg:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#B22234] dark:text-[#EE3B47] font-bold">01</span>
                <span className="text-[#71717a] dark:text-zinc-400 tracking-wider uppercase font-sans font-semibold text-[11px]">
                  TENTANG KAMI
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-[#18181b] dark:text-zinc-100 tracking-tight leading-[1.3] max-w-xl font-['League_Spartan',sans-serif]">
                <span className="block">Ketika ide dan</span>
                <span className="inline-flex items-center flex-wrap gap-x-2 gap-y-1.5 sm:gap-x-2.5 sm:gap-y-2 mt-1 sm:mt-1.5">
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
            </div>

            <div className="lg:col-span-6 space-y-3 sm:space-y-3.5 pt-0 lg:pt-2">
              <p className="text-sm sm:text-base font-semibold text-[#18181b] dark:text-zinc-100 leading-relaxed">
                Berawal dari Inisiatif Program Studi Fisika hingga Menjadi <span className="text-[#B22234] dark:text-[#EE3B47] font-bold">Unit Kegiatan Mahasiswa</span> Universitas Sebelas Maret.
              </p>
              <p className="text-xs sm:text-sm text-[#52525b] dark:text-zinc-300 leading-relaxed">
                Kami mewadahi potensi mahasiswa lintas disiplin untuk berkolaborasi, mengakselerasi riset teknologi robotika, dan mencetak prestasi di kancah <span className="font-bold text-[#18181b] dark:text-zinc-100">nasional maupun <span className="text-[#B22234] dark:text-[#EE3B47]">internasional</span></span>.
              </p>
            </div>
          </div>

          <div className="pt-8 sm:pt-10 border-t border-[#e4e4e7] dark:border-zinc-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
              <div className="lg:col-span-4">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#18181b] dark:text-zinc-100 tracking-tight leading-tight font-['League_Spartan',sans-serif]">
                  Robotika dalam angka
                </h3>
              </div>

              <div className="lg:col-span-8 grid grid-cols-3 gap-4 sm:gap-8">
                <div>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#B22234] dark:text-[#EE3B47] block tracking-tight font-['League_Spartan',sans-serif]">
                    30+
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#18181b] dark:text-zinc-200 block mt-1">
                    Anggota aktif
                  </span>
                </div>

                <div>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#B22234] dark:text-[#EE3B47] block tracking-tight font-['League_Spartan',sans-serif]">
                    12+
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#18181b] dark:text-zinc-200 block mt-1">
                    Robot dikembangkan
                  </span>
                </div>

                <div>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#B22234] dark:text-[#EE3B47] block tracking-tight font-['League_Spartan',sans-serif]">
                    2
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#18181b] dark:text-zinc-200 block mt-1">
                    Tim robotika
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );

};
