/*
-----------------------------------------
nama file: [ DivisionSection.tsx ] 
fungsi [ Komponen section ekosistem organisasi yang menampilkan daftar tim robotika, divisi teknis, dan divisi nonteknis beserta tautan ke halaman profil masing-masing ]
-----------------------------------------------
*/

"use client";

import React from "react";
import Link from "next/link";
import { Container, Reveal, SkeletonReveal } from "../atoms";
import { useLandingReveal } from "@/src/context";
import { teamList, techList, nonTechList } from "@/data/divisions";
import {
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
      return <Bot className="h-5 w-5 transition-colors" />;
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
  const { ready } = useLandingReveal();

  return (
    <section id="divisi-tim" className="relative py-12 sm:py-16 lg:py-20 bg-[#F9F9F8] dark:bg-[#121316] border-t border-[#e4e4e7] dark:border-transparent transition-colors duration-200">
      {/* z-20 menjaga konten di atas lingkaran dekorasi dari AboutSection */}
      <Container size="lg" className="relative z-20">
        <div className="space-y-10 sm:space-y-12 lg:space-y-16">
          <Reveal className="space-y-2 sm:space-y-3">
            <SkeletonReveal ready={ready} className="w-fit">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18181b] dark:text-zinc-100 tracking-tight leading-tight">
                Ekosistem Kami
              </h2>
            </SkeletonReveal>
          </Reveal>

          <div className="space-y-5">
            <div className="border-b border-[#e4e4e7] dark:border-zinc-800 pb-3">
              <SkeletonReveal ready={ready} className="w-fit">
                <h3 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">Tim Robotika</h3>
              </SkeletonReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {teamList.map((team, i) => (
                <Reveal key={team.id} delay={i * 0.1} className="h-full">
                  <SkeletonReveal ready={ready} className="h-full" skeletonClassName="rounded-xl">
                    <Link
                      href={`/divisi/${team.id}`}
                      className="group h-full flex flex-col justify-between p-6 sm:p-7 bg-white dark:bg-[#18191d] rounded-xl border border-[#e4e4e7] dark:border-zinc-800 hover:border-[#B22234] dark:hover:border-[#e03144] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#B22234] focus-visible:outline-hidden"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg font-bold text-[#18181b] dark:text-zinc-100 group-hover:text-[#B22234] dark:group-hover:text-[#e03144] transition-colors leading-tight">
                              {team.name}
                            </h4>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#a1a1aa] dark:text-zinc-500 group-hover:text-[#B22234] dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                        </div>

                        <p className="text-xs sm:text-sm text-[#52525b] dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {team.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-5 border-t border-[#f4f4f5] dark:border-zinc-800/80 text-xs font-semibold text-[#B22234] dark:text-red-400">
                        <span className="group-hover:underline">Buka profil tim</span>
                      </div>
                    </Link>
                  </SkeletonReveal>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="border-b border-[#e4e4e7] dark:border-zinc-800 pb-3">
                <SkeletonReveal ready={ready} className="w-fit">
                  <h3 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">Teknis</h3>
                </SkeletonReveal>
              </div>

              <div className="space-y-2.5">
                {techList.map((item, i) => (
                  <Reveal key={item.id} delay={i * 0.05}>
                    <SkeletonReveal ready={ready} skeletonClassName="rounded-lg">
                      <Link
                        href={`/divisi/${item.id}`}
                        className="group flex items-center justify-between p-3.5 sm:p-4 bg-white dark:bg-[#18191d] rounded-lg border border-[#e4e4e7] dark:border-zinc-800 hover:border-[#B22234] dark:hover:border-[#e03144] hover:bg-[#FCF2F3]/20 dark:hover:bg-red-950/20 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#B22234] focus-visible:outline-hidden"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-[#71717a] dark:text-zinc-400 group-hover:text-[#B22234] dark:group-hover:text-red-400 transition-colors shrink-0">
                            {getItemIcon(item.id)}
                          </div>
                          <span className="text-sm font-semibold text-[#18181b] dark:text-zinc-100 group-hover:text-[#B22234] dark:group-hover:text-red-400 transition-colors">
                            {item.name}
                          </span>
                        </div>

                        <ArrowRight className="w-4 h-4 text-[#a1a1aa] dark:text-zinc-500 group-hover:text-[#B22234] dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    </SkeletonReveal>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="border-b border-[#e4e4e7] dark:border-zinc-800 pb-3">
                <SkeletonReveal ready={ready} className="w-fit">
                  <h3 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">Nonteknis</h3>
                </SkeletonReveal>
              </div>

              <div className="space-y-2.5">
                {nonTechList.map((item, i) => (
                  <Reveal key={item.id} delay={i * 0.05}>
                    <SkeletonReveal ready={ready} skeletonClassName="rounded-lg">
                      <Link
                        href={`/divisi/${item.id}`}
                        className="group flex items-center justify-between p-3.5 sm:p-4 bg-white dark:bg-[#18191d] rounded-lg border border-[#e4e4e7] dark:border-zinc-800 hover:border-[#B22234] dark:hover:border-[#e03144] hover:bg-[#FCF2F3]/20 dark:hover:bg-red-950/20 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#B22234] focus-visible:outline-hidden"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-[#71717a] dark:text-zinc-400 group-hover:text-[#B22234] dark:group-hover:text-red-400 transition-colors shrink-0">
                            {getItemIcon(item.id)}
                          </div>
                          <span className="text-sm font-semibold text-[#18181b] dark:text-zinc-100 group-hover:text-[#B22234] dark:group-hover:text-red-400 transition-colors">
                            {item.name}
                          </span>
                        </div>

                        <ArrowRight className="w-4 h-4 text-[#a1a1aa] dark:text-zinc-500 group-hover:text-[#B22234] dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    </SkeletonReveal>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
