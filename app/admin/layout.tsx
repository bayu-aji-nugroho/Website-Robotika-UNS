/*
-----------------------------------------
nama file: [ layout.tsx ] 
fungsi [ Layout rute admin portal Robotika UNS yang mengatur metadata halaman serta membungkus tata letak sub-halaman admin secara terisolasi dari navbar publik. ]
-----------------------------------------------
*/

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | Robotika Universitas Sebelas Maret",
  description:
    "Portal administrasi internal UKM Robotika Universitas Sebelas Maret untuk dasbor, oprec, dan profil pengurus.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
