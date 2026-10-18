import type { Metadata } from "next";
import { LoginTemplate } from "@/src/components/templates";

export const metadata: Metadata = {
  title: "Masuk Portal | Robotika Universitas Sebelas Maret",
  description:
    "Halaman masuk portal internal pengurus dan anggota Robotika Universitas Sebelas Maret.",
};

export default function LoginPage() {
  return <LoginTemplate />;
}
