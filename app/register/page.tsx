import type { Metadata } from "next";
import { Suspense } from "react";
import { RegistrationTemplate } from "@/src/components/templates";

export const metadata: Metadata = {
  title: "Pendaftaran Calon Anggota | Robotika Universitas Sebelas Maret",
  description:
    "Formulir pendaftaran calon anggota baru UKM Robotika Universitas Sebelas Maret.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegistrationTemplate />
    </Suspense>
  );
}
