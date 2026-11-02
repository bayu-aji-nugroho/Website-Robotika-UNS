import type { Metadata } from "next";
import { Suspense } from "react";
import { AnnouncementTemplate } from "@/src/components/templates";

export const metadata: Metadata = {
  title: "Pengumuman Hasil OPREC | Robotika Universitas Sebelas Maret",
  description:
    "Pengumuman hasil seleksi calon anggota baru UKM Robotika Universitas Sebelas Maret.",
};

export default function PengumumanPage() {
  return (
    <Suspense fallback={null}>
      <AnnouncementTemplate />
    </Suspense>
  );
}
