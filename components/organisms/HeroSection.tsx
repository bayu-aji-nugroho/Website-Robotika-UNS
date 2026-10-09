"use client";

import React from "react";
import Image from "next/image";
import { Container } from "../atoms";

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 bg-white">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-start">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
            {/* Top Red Status Badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-sm text-[10px] sm:text-[11px] font-semibold text-[#B22234] bg-[#FCF2F3]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B22234]" />
                OPREC - Informasi segera diperbarui
              </span>
            </div>

            {/* Title, Tagline & Supporting Description */}
            <div className="space-y-3 sm:space-y-5">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#18181b] tracking-tight leading-[1.15] font-[family-name:var(--font-space-grotesk)]">
                <span className="block text-[#B22234]">Robotika</span>
                <span className="block text-2xl sm:text-4xl lg:text-5xl font-bold sm:font-extrabold mt-0.5 sm:mt-1">
                  Universitas Sebelas Maret
                </span>
              </h1>

              <div className="space-y-1.5 sm:space-y-2 pt-1">
                <p className="text-sm sm:text-lg font-semibold text-[#18181b] tracking-tight">
                  Innovate and <span className="text-[#B22234] font-bold">Elevate</span>
                </p>
                <p className="text-xs sm:text-base text-[#71717a] leading-relaxed max-w-lg">
                  Tempat riset, inovasi, dan pengembangan teknologi robotika mahasiswa Universitas Sebelas Maret. Berkomitmen merancang teknologi serta berprestasi di tingkat nasional dan internasional.
                </p>
              </div>
            </div>

            {/* Buttons & Registration Note */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <a
                  href="#divisi-tim"
                  className="inline-flex items-center gap-4 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#B22234] hover:bg-[#8B0000] text-white text-xs font-semibold rounded-sm transition-colors shadow-sm"
                >
                  <span>Daftar Sekarang</span>
                </a>
                <a
                  href="#kontak"
                  className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-[#18181b] border border-[#e4e4e7] hover:bg-[#f4f4f5] text-xs font-semibold rounded-sm transition-colors"
                >
                  Masuk
                </a>
              </div>

              <p className="text-[11px] sm:text-xs text-[#a1a1aa]">
                Jadwal dan tautan pendaftaran menunggu pengumuman resmi.
              </p>
            </div>
          </div>

          {/* Image: Displayed below 'Daftar Sekarang' on mobile, and on right column on desktop */}
          <div className="block lg:col-span-6 w-full pt-1 sm:pt-4 lg:pt-0">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] rounded-lg overflow-hidden bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center group shadow-xs">
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
