import type { Metadata } from "next";
import { Suspense } from "react";
import { SelfCheckInCard } from "@/src/components/organisms/SelfCheckInCard";

export const metadata: Metadata = {
  title: "Absen Acara | Robotika Universitas Sebelas Maret",
  description: "Presensi mandiri calon anggota UKM Robotika Universitas Sebelas Maret.",
  robots: { index: false },
};

export default function AbsenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#F9F9F8] dark:bg-[#09090b]">
      <Suspense fallback={null}>
        <SelfCheckInCard />
      </Suspense>
    </main>
  );
}
