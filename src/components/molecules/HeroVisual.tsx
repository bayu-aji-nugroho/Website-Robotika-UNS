/*
-----------------------------------------
nama file: [ HeroVisual.tsx ]
fungsi [ Komposisi visual hero beranda: panel foto gedung bernuansa merah, robot di atas panggung, kartu keunggulan mengambang, dan foto polaroid, masing-masing dengan skeleton hingga siap ditampilkan. ]
-----------------------------------------------
*/

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SkeletonReveal } from "../atoms";
import { HERO_MEDIA } from "@/data/heroMedia";

export interface HeroVisualProps {
  ready: boolean;
}

const FLOATING_CARD_CLASS =
  "rounded-xl border border-white/80 dark:border-zinc-700/70 bg-white/95 dark:bg-zinc-900/90 px-2.5 sm:px-4 py-2 sm:py-3 shadow-lg shadow-[#B22234]/10 backdrop-blur-sm";

// Garis tepi memisahkan bentuk skeleton yang saling bertumpuk
const SKELETON_OUTLINE_CLASS = "ring-4 ring-white dark:ring-[#121316]";

export const HeroVisual: React.FC<HeroVisualProps> = ({ ready }) => {
  const { building, robot, polaroid } = HERO_MEDIA;
  const [settled, setSettled] = useState({ building: false, robot: false, polaroid: false });

  // Foto yang gagal dimuat juga dianggap selesai agar skeleton tidak berputar selamanya
  const settle = (key: keyof typeof settled) => ({
    onLoad: () => setSettled((prev) => ({ ...prev, [key]: true })),
    onError: () => setSettled((prev) => ({ ...prev, [key]: true })),
  });

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-xl">
      <div className="absolute right-[7%] top-[3%] h-[64%] w-[62%]">
        <SkeletonReveal ready={ready && settled.building} className="h-full" skeletonClassName="rounded-[2rem] -skew-x-12">
          {/* mix-blend-luminosity membuat foto warna apa pun mengikuti warna merah panel */}
          <div className="relative h-full -skew-x-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#d8384b] to-[#8B0000] shadow-xl shadow-[#B22234]/20">
            <div className="absolute -inset-x-[12%] inset-y-0 skew-x-12">
              <Image
                src={building.src}
                alt={building.alt}
                fill
                sizes="(min-width: 1024px) 400px, 70vw"
                className="object-cover opacity-60 mix-blend-luminosity"
                {...settle("building")}
              />
            </div>
          </div>
        </SkeletonReveal>
      </div>

      {/* Panggung */}
      <div aria-hidden="true" className="absolute inset-x-[4%] bottom-[3%] h-[27%]">
        <SkeletonReveal ready={ready} className="h-full" skeletonClassName={`rounded-[50%] ${SKELETON_OUTLINE_CLASS}`}>
          <div className="absolute inset-0 rounded-[50%] bg-gradient-to-b from-[#ece8ea] to-[#cfcace] shadow-[0_18px_40px_-14px_rgba(178,34,52,0.55)] dark:from-zinc-700 dark:to-zinc-900" />
          <div className="absolute inset-x-[7%] bottom-[20%] top-0 rounded-[50%] bg-gradient-to-b from-white to-[#e6e2e5] dark:from-zinc-600 dark:to-zinc-800" />
          <div className="absolute inset-x-[20%] bottom-[34%] top-[12%] rounded-[50%] border border-[#B22234]/20 bg-[#B22234]/5 dark:border-[#EE3B47]/30" />
          <div className="absolute bottom-[3%] left-1/2 h-1 w-1/4 -translate-x-1/2 rounded-full bg-[#EE3B47] shadow-[0_0_14px_3px_rgba(238,59,71,0.6)]" />
        </SkeletonReveal>
      </div>

      <div className="absolute inset-x-[5%] bottom-[12%] top-[17%] z-10">
        <SkeletonReveal
          ready={ready && settled.robot}
          className="h-full"
          skeletonClassName={`mx-auto w-3/4 rounded-3xl ${SKELETON_OUTLINE_CLASS}`}
        >
          <div className="relative h-full">
            <Image
              src={robot.src}
              alt={robot.alt}
              fill
              priority
              sizes="(min-width: 1024px) 520px, 90vw"
              className="object-contain drop-shadow-[0_14px_14px_rgba(0,0,0,0.25)]"
              {...settle("robot")}
            />
          </div>
        </SkeletonReveal>
      </div>

      <div className="absolute left-0 top-[10%] z-20">
        <SkeletonReveal ready={ready} skeletonClassName={`rounded-xl ${SKELETON_OUTLINE_CLASS}`}>
          <div className={FLOATING_CARD_CLASS}>
            <div className="leading-tight">
              <p className="text-[11px] sm:text-sm font-bold text-[#18181b] dark:text-zinc-100">Riset &amp; Inovasi</p>
              <p className="text-[9px] sm:text-xs text-[#71717a] dark:text-zinc-400">Untuk Masa Depan</p>
            </div>
          </div>
        </SkeletonReveal>
      </div>

      <div className="absolute right-0 top-[15%] z-20">
        <SkeletonReveal ready={ready} skeletonClassName={`rounded-xl ${SKELETON_OUTLINE_CLASS}`}>
          <div className={FLOATING_CARD_CLASS}>
            <div className="leading-tight">
              <p className="text-[11px] sm:text-sm font-bold text-[#18181b] dark:text-zinc-100">Prestasi</p>
              <p className="text-[9px] sm:text-xs text-[#71717a] dark:text-zinc-400">di Tingkat Nasional</p>
            </div>
          </div>
        </SkeletonReveal>
      </div>

      <div className="absolute bottom-[1%] right-0 z-20 w-[26%] rotate-[-6deg]">
        <SkeletonReveal ready={ready && settled.polaroid} skeletonClassName={`rounded-sm ${SKELETON_OUTLINE_CLASS}`}>
          <figure className="rounded-sm bg-white p-1 sm:p-1.5 pb-0 shadow-xl dark:bg-zinc-100">
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image src={polaroid.src} alt={polaroid.alt} fill sizes="160px" className="object-cover" {...settle("polaroid")} />
            </div>
            <figcaption className="py-1 sm:py-1.5 text-center text-[9px] sm:text-xs font-semibold italic text-[#18181b]">
              {polaroid.caption}
            </figcaption>
          </figure>
        </SkeletonReveal>
      </div>
    </div>
  );
};
