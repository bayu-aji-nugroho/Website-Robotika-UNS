import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar, ContactFooter } from "@/src/components/organisms";
import { Container } from "@/src/components/atoms";
import {
  allDivisions,
  getDivisionById,
} from "@/data/divisions";
import {
  ArrowLeft,
  CheckCircle2,
  Bot,
  Search,
  Code,
  Cpu,
  Wrench,
  FileText,
  Wallet,
  Compass,
  Camera,
  Share2,
  Sparkles,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return allDivisions.map((item) => ({
    slug: item.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getDivisionById(slug);

  if (!item) {
    return {
      title: "Divisi Tidak Ditemukan - Robotika UNS",
    };
  }

  return {
    title: `${item.name} | Robotika Universitas Sebelas Maret`,
    description: item.tagline,
  };
}

function getIconForDivision(id: string) {
  switch (id) {
    case "werkudara":
    case "cakrawala":
      return <Bot className="h-6 w-6 text-[#B22234]" />;
    case "riset":
      return <Search className="h-6 w-6 text-[#B22234]" />;
    case "pemrograman":
      return <Code className="h-6 w-6 text-[#B22234]" />;
    case "elektronika":
      return <Cpu className="h-6 w-6 text-[#B22234]" />;
    case "mekanika":
      return <Wrench className="h-6 w-6 text-[#B22234]" />;
    case "administrasi":
      return <FileText className="h-6 w-6 text-[#B22234]" />;
    case "bendahara":
      return <Wallet className="h-6 w-6 text-[#B22234]" />;
    case "pengembangan-organisasi":
      return <Compass className="h-6 w-6 text-[#B22234]" />;
    case "media-branding":
      return <Camera className="h-6 w-6 text-[#B22234]" />;
    case "humas":
      return <Share2 className="h-6 w-6 text-[#B22234]" />;
    default:
      return <Bot className="h-6 w-6 text-[#B22234]" />;
  }
}

export default async function DivisionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getDivisionById(slug);

  if (!item) {
    notFound();
  }


  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafd] dark:bg-[#0c0d0e] text-[#102e4a] dark:text-[#f4f4f5] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 sm:pb-24">
        <Container size="lg">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8 flex items-center justify-between">
              <Link
                href="/#divisi-tim"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#71717a] dark:text-zinc-400 hover:text-[#B22234] dark:hover:text-red-400 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Kembali ke Divisi dan Tim</span>
              </Link>

              <span className="text-[11px] font-mono text-[#a1a1aa] dark:text-zinc-500 uppercase tracking-wider hidden sm:inline-block">
                ROBOTIKA UNS · {item.type.toUpperCase()}
              </span>
            </div>

            {/* Hero Banner Header */}
            <div className="bg-white dark:bg-[#18191d] rounded-2xl p-6 sm:p-10 border border-[#e4e4e7] dark:border-zinc-800 shadow-xs mb-8 sm:mb-10">
              <div className="flex items-center gap-4 sm:gap-5 pb-6 border-b border-[#f4f4f5] dark:border-zinc-800">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-[#FCF2F3] dark:bg-red-950/40 border border-[#F8D7DA] dark:border-red-900/50 flex items-center justify-center shrink-0">
                  {getIconForDivision(item.id)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-[#B22234] dark:text-red-400 bg-[#FCF2F3] dark:bg-red-950/40 px-2.5 py-1 rounded-md uppercase font-semibold border border-[#F8D7DA] dark:border-red-900/50">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-[#71717a] dark:text-zinc-300 bg-[#f4f4f5] dark:bg-zinc-800 px-2.5 py-1 rounded-md uppercase font-semibold border border-[#e4e4e7] dark:border-zinc-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-[#18181b] dark:text-zinc-100 tracking-tight font-['League_Spartan',sans-serif]">
                    {item.name}
                  </h1>
                </div>
              </div>

              <p className="text-sm sm:text-lg font-medium text-[#18181b] dark:text-zinc-200 mt-6 max-w-3xl leading-relaxed">
                {item.tagline}
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-8 sm:space-y-10">
              {/* Sekilas Divisi / Tim */}
              <div className="bg-white dark:bg-[#18191d] rounded-2xl p-6 sm:p-8 border border-[#e4e4e7] dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#f4f4f5] dark:border-zinc-800 pb-3">
                  <span className="h-2 w-2 rounded-full bg-[#B22234]" />
                  <h2 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">
                    Tentang {item.name}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#52525b] dark:text-zinc-300 leading-relaxed">
                  {item.fullDesc}
                </p>
              </div>

              <div className="bg-white dark:bg-[#18191d] rounded-2xl p-6 sm:p-8 border border-[#e4e4e7] dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#f4f4f5] dark:border-zinc-800 pb-3">
                  <span className="h-2 w-2 rounded-full bg-[#B22234]" />
                  <h2 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">
                    Peran dan Tanggung Jawab Utama
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-1">
                  {item.responsibilities.map((resp, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fafafa] dark:bg-zinc-900/70 border border-[#f4f4f5] dark:border-zinc-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#B22234] shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-[#3f3f46] dark:text-zinc-300 leading-relaxed">
                        {resp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proyek / Inisiatif (jika ada) */}
              {item.projects && item.projects.length > 0 && (
                <div className="bg-white dark:bg-[#18191d] rounded-2xl p-6 sm:p-8 border border-[#e4e4e7] dark:border-zinc-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#f4f4f5] dark:border-zinc-800 pb-3">
                    <Sparkles className="h-4 w-4 text-[#B22234]" />
                    <h2 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">
                      Proyek dan Misi Unggulan
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {item.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-[#e4e4e7] dark:border-zinc-800 bg-[#FCF2F3]/40 dark:bg-red-950/20 space-y-1.5"
                      >
                        <span className="text-[10px] font-mono text-[#B22234] uppercase font-bold">
                          PROYEK 0{idx + 1}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-[#18181b] dark:text-zinc-100">
                          {proj}
                        </h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      <ContactFooter />
    </div>

  );
}
