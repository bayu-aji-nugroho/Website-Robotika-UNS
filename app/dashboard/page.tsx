import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardTemplate } from "@/src/components/templates";

export const metadata: Metadata = {
  title: "Dashboard Akun | Robotika Universitas Sebelas Maret",
  description:
    "Detail data pendaftaran calon anggota UKM Robotika Universitas Sebelas Maret.",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardTemplate />
    </Suspense>
  );
}
