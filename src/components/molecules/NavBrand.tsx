/*
-----------------------------------------
nama file: [ NavBrand.tsx ] 
fungsi [ Komponen identitas merek navigasi utama yang menampilkan wordmark resmi ROBOTIKA Universitas Sebelas Maret beserta lambang logo universitas yang terhubung ke rute beranda. ]
-----------------------------------------------
*/

import React from "react";
import Link from "next/link";

export const NavBrand: React.FC = () => {
  return (
    <Link href="/" className="flex items-center gap-3.5 group">
      <div className="flex flex-col">
        <span className="font-['League_Spartan',sans-serif] font-extrabold text-base tracking-wider text-[#18181b] dark:text-zinc-100 uppercase leading-none">
          ROBOTIKA
        </span>
        <span className="text-[9px] font-semibold text-[#71717a] dark:text-zinc-400 tracking-tight mt-1">
          Universitas Sebelas Maret
        </span>
      </div>

      <div className="h-7 w-[1px] bg-[#e4e4e7] dark:bg-zinc-800" />

      <img
        src="https://spmb.uns.ac.id/themes/website/assets/images/logo-uns.png"
        alt="Logo UNS"
        className="h-9 w-auto object-contain"
      />
    </Link>
  );
};
