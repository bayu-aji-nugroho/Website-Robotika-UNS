import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info, ListChecks, Wrench, type LucideIcon } from "lucide-react";
import { Navbar, ContactFooter } from "@/src/components/organisms";
import { Container, Skeleton } from "@/src/components/atoms";
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <div className="lg:col-span-5 space-y-5">
        <Skeleton className="h-4 w-44 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-10 sm:h-12 w-4/5 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
        </div>
        <Skeleton className="h-12 w-full rounded" />
      </div>

      <div className="lg:col-span-7 bg-white dark:bg-[#18191d] rounded-xl border border-[#e4e4e7] dark:border-zinc-800 divide-y divide-[#e4e4e7] dark:divide-zinc-800">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex gap-4 p-5 sm:p-6">
            <Skeleton className="h-6 w-6 rounded shrink-0" />
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-5 w-2/5 rounded" />
              <Skeleton className="h-4 w-1/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DetailRowProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

function DetailRow({ icon: Icon, title, subtitle, children }: DetailRowProps) {
  return (
    <section className="flex gap-3.5 sm:gap-4 p-5 sm:p-6">
      <div className="shrink-0 pt-0.5 text-[#B22234] dark:text-red-400">
        <Icon className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-base sm:text-lg font-bold text-[#18181b] dark:text-zinc-100 leading-snug">
          {title}
        </h2>
        <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#B22234] dark:text-red-400">
          {subtitle}
        </p>
        <div className="mt-3">{children}</div>
      </div>
    </section>
  );
}

async function DivisionContent({ params }: PageProps) {
  const { slug } = await params;
  const item = getDivisionById(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Kolom Judul */}
      <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4 sm:space-y-5 motion-safe:animate-rise">
        <Link
          href="/#divisi-tim"
          className="inline-flex items-center text-xs font-semibold text-[#71717a] dark:text-zinc-400 hover:text-[#B22234] dark:hover:text-red-400 transition-colors"
        >
          <span>Kembali ke Divisi dan Tim</span>
        </Link>

        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#B22234] dark:text-red-400 font-sans">
            {item.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#18181b] dark:text-zinc-100 tracking-tight leading-tight">
            {item.name}
          </h1>
        </div>

        <p className="text-sm sm:text-lg text-[#52525b] dark:text-zinc-300 leading-relaxed">
          {item.tagline}
        </p>

        {item.badge && (
          <p className="pl-4 py-1 border-l-2 border-[#B22234] dark:border-[#EE3B47] text-xs sm:text-sm font-medium text-[#18181b] dark:text-zinc-200 leading-relaxed">
            {item.badge}
          </p>
        )}
      </div>

      {/* Panel Detail */}
      <div className="lg:col-span-7 bg-white dark:bg-[#18191d] rounded-xl border border-[#e4e4e7] dark:border-zinc-800 divide-y divide-[#e4e4e7] dark:divide-zinc-800 shadow-xs motion-safe:animate-rise [animation-delay:100ms]">
        <DetailRow icon={Info} title={`Tentang ${item.name}`} subtitle="Gambaran umum">
          <p className="text-xs sm:text-sm text-[#52525b] dark:text-zinc-300 leading-relaxed">
            {item.fullDesc}
          </p>
        </DetailRow>

        <DetailRow
          icon={ListChecks}
          title="Peran dan Tanggung Jawab Utama"
          subtitle="Tanggung Jawab"
        >
          <ul className="space-y-2">
            {item.responsibilities.map((resp, index) => (
              <li
                key={index}
                className="flex gap-2.5 text-xs sm:text-sm text-[#3f3f46] dark:text-zinc-300 leading-relaxed"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B22234] dark:bg-[#EE3B47]"
                />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </DetailRow>

        {item.skills && item.skills.length > 0 && (
          <DetailRow
            icon={Wrench}
            title="Keahlian dan Kualifikasi"
            subtitle="Keahlian"
          >
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium bg-white dark:bg-zinc-900 border border-[#e4e4e7] dark:border-zinc-800 text-[#27272a] dark:text-zinc-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </DetailRow>
        )}
      </div>
    </div>
  );
}

export default function DivisionDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafd] dark:bg-[#121316] text-[#102e4a] dark:text-[#f4f4f5] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 sm:pb-24 bg-grid-pattern">
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
