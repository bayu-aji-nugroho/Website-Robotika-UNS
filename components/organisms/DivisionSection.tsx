"use client";

import React from "react";
import { Container } from "../atoms";
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
} from "lucide-react";

export const DivisionSection: React.FC = () => {
  const techList = [
    {
      name: "Riset",
      desc: "Eksplorasi konsep, studi literatur, serta perumusan inovasi dan strategi teknologi robotika.",
      icon: <Search className="h-4 w-4 text-[#B22234]" />,
    },
    {
      name: "Pemrograman",
      desc: "Pengembangan algoritma cerdas, sistem kontrol otomatis, dan perangkat lunak kendali robot.",
      icon: <Code className="h-4 w-4 text-[#B22234]" />,
    },
    {
      name: "Elektronika",
      desc: "Perancangan sirkuit PCB, integrasi sensor & aktuator, dan sistem manajemen daya.",
      icon: <Cpu className="h-4 w-4 text-[#B22234]" />,
    },
    {
      name: "Mekanika",
      desc: "Desain CAD 3D, simulasi kinematika, fabrikasi rangka, dan manufaktur sistem mekanik presisi.",
      icon: <Wrench className="h-4 w-4 text-[#B22234]" />,
    },
  ];

  const teamList = [
    {
      name: "Tim ABU",
      desc: "Fokus pada perancangan robot untuk Kontes Robot ABU Indonesia (KRAI) dan ajang kompetisi robotika nasional.",
    },
    {
      name: "Cakrawala",
      desc: "Fokus pada pengembangan sistem robotika otonom, riset terapan, dan kompetisi inovasi robotika.",
    },
  ];

  const nonTechList = [
    {
      name: "Administrasi",
      desc: "Pengelolaan dokumen, arsip, dan administrasi organisasi.",
      icon: <FileText className="h-4 w-4 text-[#B22234]" />,
    },
    {
      name: "Bendahara",
      desc: "Pengelolaan keuangan dan anggaran organisasi.",
      icon: <Wallet className="h-4 w-4 text-[#B22234]" />,
    },
    {
      name: "Pengembangan Organisasi",
      desc: "Pengembangan kapasitas dan arah strategis organisasi.",
      icon: <Compass className="h-4 w-4 text-[#B22234]" />,
    },
    {
      name: "Media Branding",
      desc: "Dokumentasi, desain visual, dan identitas komunitas.",
      icon: <Camera className="h-4 w-4 text-[#B22234]" />,
    },
    {
      name: "Humas",
      desc: "Membangun komunikasi eksternal dan peluang kolaborasi.",
      icon: <Share2 className="h-4 w-4 text-[#B22234]" />,
    },
  ];

  return (
    <section id="divisi-tim" className="py-12 sm:py-16 lg:py-20 bg-[#F9F9F8] border-t border-[#e4e4e7]">
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

          {/* Grid Teknis & Nonteknis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
            {/* Left: Teknis */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
                <h3 className="text-base font-bold text-[#18181b]">Teknis</h3>
                <span className="text-[10px] font-mono tracking-wider text-[#a1a1aa] uppercase">
                  MERANCANG & MEMBANGUN
                </span>
              </div>

              {/* Bidang Teknis */}
              <div className="space-y-6">
                {techList.map((item) => (
                  <div key={item.name} className="flex items-start gap-4 group">
                    <div className="h-8 w-8 rounded bg-[#FCF2F3] border border-[#F8D7DA] flex items-center justify-center shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-bold text-[#18181b] group-hover:text-[#B22234] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#71717a]">{item.desc}</p>
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-[#a1a1aa] font-mono">
                        <span className="uppercase font-semibold text-[#71717a]">KEPALA DIVISI</span>
                        <span>·</span>
                        <span>Segera diperbarui</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dua Tim di Bawah Teknis: Tim ABU & Cakrawala */}
              <div className="pt-4 border-t border-[#e4e4e7] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#18181b]">
                      Tim Robotika
                    </h4>
                    <p className="text-[11px] text-[#71717a]">
                      Tim riset dan kompetisi di bawah naungan teknis.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-[#a1a1aa] uppercase">
                    2 TIM AKTIF
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {teamList.map((team) => (
                    <div
                      key={team.name}
                      className="bg-white p-4 rounded-lg border border-[#e4e4e7] space-y-2 hover:border-[#B22234]/40 transition-colors flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded bg-[#FCF2F3] border border-[#F8D7DA] flex items-center justify-center shrink-0">
                            <Bot className="h-3.5 w-3.5 text-[#B22234]" />
                          </div>
                          <h5 className="text-sm font-bold text-[#18181b]">{team.name}</h5>
                        </div>
                        <p className="text-xs text-[#71717a] leading-relaxed">
                          {team.desc}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#f4f4f5] flex items-center justify-between text-[10px] text-[#a1a1aa] font-mono">
                        <span className="uppercase font-semibold text-[#71717a]">KETUA TIM</span>
                        <span>Segera diperbarui</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Nonteknis */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
                <h3 className="text-base font-bold text-[#18181b]">Nonteknis</h3>
                <span className="text-[10px] font-mono tracking-wider text-[#a1a1aa] uppercase">
                  MENGHUBUNGKAN & MENDUKUNG
                </span>
              </div>

              <div className="space-y-6">
                {nonTechList.map((item) => (
                  <div key={item.name} className="flex items-start gap-4 group">
                    <div className="h-8 w-8 rounded bg-[#FCF2F3] border border-[#F8D7DA] flex items-center justify-center shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-bold text-[#18181b] group-hover:text-[#B22234] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#71717a]">{item.desc}</p>
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-[#a1a1aa] font-mono">
                        <span className="uppercase font-semibold text-[#71717a]">KEPALA DIVISI</span>
                        <span>·</span>
                        <span>Segera diperbarui</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
