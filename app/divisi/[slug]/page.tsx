import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar, ContactFooter } from "@/src/components/organisms";
import { Container } from "@/src/components/atoms";
import {
  allDivisions,
  getDivisionById,
} from "@/data/divisions";

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

function DivisionDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="mb-6 sm:mb-8">
        <div className="h-4 w-44 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="bg-white dark:bg-[#18191d] rounded-2xl p-6 sm:p-10 border border-[#e4e4e7] dark:border-zinc-800 shadow-xs mb-8 sm:mb-10">
        <div className="space-y-2 pb-6 border-b border-[#f4f4f5] dark:border-zinc-800">
          <div className="h-5 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 sm:h-10 w-3/5 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="mt-6 space-y-2">
          <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>

      <div className="space-y-8 sm:space-y-10">
        <div className="bg-white dark:bg-[#18191d] rounded-2xl p-6 sm:p-8 border border-[#e4e4e7] dark:border-zinc-800 shadow-xs space-y-4">
          <div className="h-5 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#18191d] rounded-2xl p-6 sm:p-8 border border-[#e4e4e7] dark:border-zinc-800 shadow-xs space-y-4">
          <div className="h-5 w-52 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function DivisionContent({ params }: PageProps) {
  const { slug } = await params;
  const item = getDivisionById(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <Link
          href="/#divisi-tim"
          className="inline-flex items-center text-xs font-semibold text-[#71717a] dark:text-zinc-400 hover:text-[#B22234] dark:hover:text-red-400 transition-colors"
        >
          <span>Kembali ke Divisi dan Tim</span>
        </Link>
      </div>

      {/* Hero Banner Header */}
      <div className="bg-white dark:bg-[#18191d] rounded-2xl p-6 sm:p-10 border border-[#e4e4e7] dark:border-zinc-800 shadow-xs mb-8 sm:mb-10">
        <div className="space-y-2 pb-6 border-b border-[#f4f4f5] dark:border-zinc-800">
          <div className="text-xs">
            <span className="font-bold uppercase tracking-wider text-[#B22234] dark:text-red-400 font-sans">
              {item.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#18181b] dark:text-zinc-100 tracking-tight font-['League_Spartan',sans-serif] leading-tight">
            {item.name}
          </h1>
        </div>

        <p className="text-sm sm:text-lg font-medium text-[#18181b] dark:text-zinc-200 mt-6 max-w-3xl leading-relaxed">
          {item.tagline}
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8 sm:space-y-10">
        {/* Sekilas Divisi / Tim */}
        <div className="bg-white dark:bg-[#18191d] rounded-2xl p-6 sm:p-8 border border-[#e4e4e7] dark:border-zinc-800 shadow-xs space-y-4">
          <div className="border-b border-[#f4f4f5] dark:border-zinc-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">
              Tentang {item.name}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#52525b] dark:text-zinc-300 leading-relaxed">
            {item.fullDesc}
          </p>
        </div>

        {/* Peran dan Tanggung Jawab Utama */}
        <div className="bg-white dark:bg-[#18191d] rounded-2xl p-6 sm:p-8 border border-[#e4e4e7] dark:border-zinc-800 shadow-xs space-y-4">
          <div className="border-b border-[#f4f4f5] dark:border-zinc-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">
              Peran dan Tanggung Jawab Utama
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-1">
            {item.responsibilities.map((resp, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-[#fafafa] dark:bg-zinc-900/70 border border-[#f4f4f5] dark:border-zinc-800"
              >
                <p className="text-xs sm:text-sm text-[#3f3f46] dark:text-zinc-300 leading-relaxed">
                  {resp}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Keahlian & Kualifikasi */}
        {item.skills && item.skills.length > 0 && (
          <div className="bg-white dark:bg-[#18191d] rounded-2xl p-6 sm:p-8 border border-[#e4e4e7] dark:border-zinc-800 shadow-xs space-y-4">
            <div className="border-b border-[#f4f4f5] dark:border-zinc-800 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100">
                Keahlian dan Kualifikasi
              </h2>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {item.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#fafafa] dark:bg-zinc-900 border border-[#f4f4f5] dark:border-zinc-800 text-[#27272a] dark:text-zinc-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DivisionDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafd] dark:bg-[#121316] text-[#102e4a] dark:text-[#f4f4f5] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 sm:pb-24">
        <Container size="lg">
          <Suspense fallback={<DivisionDetailSkeleton />}>
            <DivisionContent params={params} />
          </Suspense>
        </Container>
      </main>

      <ContactFooter />
    </div>
  );
}
