/*
-----------------------------------------
nama file: [ DivisionSection.tsx ] 
fungsi [ Komponen section ekosistem organisasi yang menampilkan daftar tim robotika, divisi teknis, dan divisi nonteknis beserta tautan ke halaman profil masing-masing ]
-----------------------------------------------
*/

"use client";

import React from "react";
import Link from "next/link";
import { Container } from "../atoms";
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
      return <Bot className="h-5 w-5 transition-colors" />;
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
    <section id="divisi-tim" className="py-12 sm:py-16 lg:py-20 bg-[#F9F9F8] dark:bg-[#121316] border-t border-[#e4e4e7] dark:border-zinc-800 transition-colors duration-200">
      <Container size="lg">
        <div className="space-y-10 sm:space-y-12 lg:space-y-16">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#B22234] font-bold">02</span>
              <span className="text-[#71717a] dark:text-zinc-400 tracking-wider uppercase font-sans font-semibold text-[11px]">
                DIVISI DAN TIM
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18181b] dark:text-zinc-100 tracking-tight leading-tight font-['League_Spartan',sans-serif]">
              Ekosistem Kami
            </h2>
          </div>

          <div className="space-y-5">
            <div className="border-b border-[#e4e4e7] dark:border-zinc-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">Tim Robotika</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {teamList.map((team) => (
                <Link
                  key={team.id}
                  href={`/divisi/${team.id}`}
                  className="group flex flex-col justify-between p-6 sm:p-7 bg-white dark:bg-[#18191d] rounded-xl border border-[#e4e4e7] dark:border-zinc-800 hover:border-[#B22234] dark:hover:border-[#e03144] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#B22234] focus-visible:outline-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-[#FCF2F3] dark:bg-red-950/40 border border-[#F8D7DA] dark:border-red-900/50 flex items-center justify-center text-[#B22234] dark:text-red-400 group-hover:bg-[#B22234] group-hover:text-white group-hover:border-[#B22234] transition-all shrink-0 mt-0.5">
                          {getItemIcon(team.id)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-lg font-bold text-[#18181b] dark:text-zinc-100 group-hover:text-[#B22234] dark:group-hover:text-[#e03144] transition-colors leading-tight">
                            {team.name}
                          </h4>
                          {team.badge && (
                            <span className="block text-xs text-[#71717a] dark:text-zinc-400 font-normal leading-snug mt-1">
                              {team.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#a1a1aa] dark:text-zinc-500 group-hover:text-[#B22234] dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                    </div>

                    <p className="text-xs sm:text-sm text-[#52525b] dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {team.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-5 border-t border-[#f4f4f5] dark:border-zinc-800/80 text-xs font-semibold text-[#B22234] dark:text-red-400">
                    <span className="group-hover:underline">Buka profil tim</span>
                    <span className="text-[11px] font-mono text-[#71717a] dark:text-zinc-400 group-hover:text-[#B22234] dark:group-hover:text-red-400 transition-colors">
                      /divisi/{team.id}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="border-b border-[#e4e4e7] dark:border-zinc-800 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">Teknis</h3>
              </div>

              <div className="space-y-2.5">
                {techList.map((item) => (
                  <Link
                    key={item.id}
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
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="border-b border-[#e4e4e7] dark:border-zinc-800 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">Nonteknis</h3>
              </div>

              <div className="space-y-2.5">
                {nonTechList.map((item) => (
                  <Link
                    key={item.id}
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
