"use client";

import React from "react";
import Link from "next/link";
import { Container } from "../atoms";
import { ScrollScaleCard } from "../molecules";
import { teamList, techList, nonTechList } from "@/data/divisions";
import {
  Search,
  Code,
  Cpu,
  Wrench,
  Bot,
  FileText,
  Wallet,
  Compass,
  Camera,
  Share2,
  ArrowRight,
} from "lucide-react";

function getItemIcon(id: string) {
  switch (id) {
    case "werkudara":
    case "cakrawala":
      return <Bot className="h-4 w-4 sm:h-5 sm:w-5 transition-colors" />;
    case "riset":
      return <Search className="h-4 w-4 transition-colors" />;
    case "pemrograman":
      return <Code className="h-4 w-4 transition-colors" />;
    case "elektronika":
      return <Cpu className="h-4 w-4 transition-colors" />;
    case "mekanika":
      return <Wrench className="h-4 w-4 transition-colors" />;
    case "administrasi":
      return <FileText className="h-4 w-4 transition-colors" />;
    case "bendahara":
      return <Wallet className="h-4 w-4 transition-colors" />;
    case "pengembangan-organisasi":
      return <Compass className="h-4 w-4 transition-colors" />;
    case "media-branding":
      return <Camera className="h-4 w-4 transition-colors" />;
    case "humas":
      return <Share2 className="h-4 w-4 transition-colors" />;
    default:
      return <Bot className="h-4 w-4 transition-colors" />;
  }
}

export const DivisionSection: React.FC = () => {
  return (
    <section id="divisi-tim" className="py-12 sm:py-16 lg:py-20 bg-[#F9F9F8] border-t border-[#e4e4e7] overflow-hidden">
      <Container size="lg">
        <div className="space-y-10 sm:space-y-12 lg:space-y-16">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-end">
            <div className="lg:col-span-7 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#B22234] font-bold">02</span>
                <span className="text-[#71717a] tracking-wider uppercase font-sans font-semibold text-[11px]">
                  DIVISI & TIM
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18181b] tracking-tight leading-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Banyak peran. Satu semangat.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-xs text-[#71717a] leading-relaxed">
                Temukan ruang kontribusimu, dari pengembangan teknologi hingga kerja di balik sebuah tim.
              </p>
            </div>
          </div>

          {/* 1. Tim Robotika */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#18181b]">Tim Robotika</h3>
                <p className="text-xs text-[#71717a]">Tim riset dan kompetisi robotika Universitas Sebelas Maret.</p>
              </div>
              <span className="text-[10px] font-mono tracking-wider text-[#B22234] bg-[#FCF2F3] px-2.5 py-1 rounded-sm uppercase font-semibold border border-[#F8D7DA]">
                2 TIM AKTIF
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamList.map((team) => (
                <ScrollScaleCard key={team.name} className="h-full">
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] hover:border-[#B22234]/40 hover:shadow-md transition-all flex flex-col justify-between h-full shadow-xs group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#FCF2F3] border border-[#F8D7DA] flex items-center justify-center text-[#B22234] group-hover:bg-[#B22234] group-hover:text-white group-hover:border-[#B22234] transition-all shrink-0">
                          {getItemIcon(team.id)}
                        </div>
                        {team.badge && (
                          <span className="text-[10px] font-mono tracking-wider text-[#B22234] bg-[#FCF2F3] px-2.5 py-1 rounded-md uppercase font-semibold border border-[#F8D7DA]">
                            {team.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-[#18181b] group-hover:text-[#B22234] transition-colors">
                          {team.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#71717a] leading-relaxed mt-1.5">
                          {team.desc}
                        </p>
                      </div>

                      {team.tags && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {team.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] text-[#52525b] bg-[#f4f4f5] border border-[#e4e4e7] px-2 py-0.5 rounded-md font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer: Tombol Navigasi ke Page Baru */}
                    <div className="pt-4 mt-4 border-t border-[#f4f4f5] flex items-center justify-between">
                      <Link
                        href={`/divisi/${team.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FCF2F3] hover:bg-[#B22234] text-[#B22234] hover:text-white border border-[#F8D7DA] hover:border-[#B22234] text-xs font-semibold transition-all duration-200 group/btn"
                      >
                        <span>Lihat Selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </ScrollScaleCard>
              ))}
            </div>
          </div>

          {/* 2 & 3. Grid Teknis & Nonteknis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
            {/* 2. Teknis */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#18181b]">Teknis</h3>
                  <p className="text-xs text-[#71717a]">Merancang, memprogram, dan membangun teknologi robotika.</p>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-mono tracking-wider text-[#a1a1aa] uppercase">
                  MERANCANG & MEMBANGUN
                </span>
              </div>

              {/* Bidang Teknis */}
              <div className="space-y-3 sm:space-y-3.5">
                {techList.map((item) => (
                  <ScrollScaleCard key={item.name}>
                    <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-[#e4e4e7] hover:border-[#B22234]/40 hover:shadow-md transition-all shadow-xs flex flex-col justify-between group">
                      <div className="flex items-start gap-3.5">
                        <div className="h-9 w-9 rounded-lg bg-[#FCF2F3] border border-[#F8D7DA] flex items-center justify-center shrink-0 mt-0.5 text-[#B22234] group-hover:bg-[#B22234] group-hover:text-white group-hover:border-[#B22234] transition-all">
                          {getItemIcon(item.id)}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-[#18181b] group-hover:text-[#B22234] transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#71717a] leading-relaxed">{item.desc}</p>
                        </div>
                      </div>

                      {/* Footer: Tombol Navigasi ke Page Baru */}
                      <div className="pt-3 mt-3 border-t border-[#f4f4f5] flex items-center justify-between">
                        <Link
                          href={`/divisi/${item.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B22234] hover:text-[#8B0000] transition-colors group/link"
                        >
                          <span>Lihat Selengkapnya</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </ScrollScaleCard>
                ))}
              </div>
            </div>

            {/* 3. Nonteknis */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#18181b]">Nonteknis</h3>
                  <p className="text-xs text-[#71717a]">Mendukung operasional, media visual, keuangan, dan relasi.</p>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-mono tracking-wider text-[#a1a1aa] uppercase">
                  MENGHUBUNGKAN & MENDUKUNG
                </span>
              </div>

              <div className="space-y-3 sm:space-y-3.5">
                {nonTechList.map((item) => (
                  <ScrollScaleCard key={item.name}>
                    <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-[#e4e4e7] hover:border-[#B22234]/40 hover:shadow-md transition-all shadow-xs flex flex-col justify-between group">
                      <div className="flex items-start gap-3.5">
                        <div className="h-9 w-9 rounded-lg bg-[#FCF2F3] border border-[#F8D7DA] flex items-center justify-center shrink-0 mt-0.5 text-[#B22234] group-hover:bg-[#B22234] group-hover:text-white group-hover:border-[#B22234] transition-all">
                          {getItemIcon(item.id)}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-[#18181b] group-hover:text-[#B22234] transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#71717a] leading-relaxed">{item.desc}</p>
                        </div>
                      </div>

                      {/* Footer: Tombol Navigasi ke Page Baru */}
                      <div className="pt-3 mt-3 border-t border-[#f4f4f5] flex items-center justify-between">
                        <Link
                          href={`/divisi/${item.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B22234] hover:text-[#8B0000] transition-colors group/link"
                        >
                          <span>Lihat Selengkapnya</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </ScrollScaleCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
