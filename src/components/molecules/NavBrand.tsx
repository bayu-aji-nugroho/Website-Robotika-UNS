/*
-----------------------------------------
nama file: [ NavBrand.tsx ] 
fungsi [ Komponen identitas merek navigasi utama yang menampilkan wordmark resmi ROBOTIKA Universitas Sebelas Maret beserta lambang logo universitas yang terhubung ke rute beranda. ]
-----------------------------------------------
*/

import React from "react";
import Link from "next/link";
import Image from "next/image";

export const NavBrand: React.FC = () => {
  return (
    <Link href="/" className="flex items-center gap-3.5 group">
      <Image
        src="/logo.jpg"
        alt="Logo Tim Robotika UNS"
        width={36}
        height={36}
        className="h-9 w-9 object-contain rounded-full"
        priority
      />

      <div className="h-7 w-[1px] bg-[#e4e4e7] dark:bg-zinc-800" />

      <img
        src="https://spmb.uns.ac.id/themes/website/assets/images/logo-uns.png"
        alt="Logo UNS"
        className="h-9 w-auto object-contain"
      />
    </Link>
  );
};
