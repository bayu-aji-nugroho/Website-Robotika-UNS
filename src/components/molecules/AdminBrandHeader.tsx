/*
-----------------------------------------
nama file: [ AdminBrandHeader.tsx ] 
fungsi [ Komponen molekul header bilah samping admin yang menampilkan identitas resmi Robotika UNS, tag portal admin, dan tautan kembali ke situs publik. ]
-----------------------------------------------
*/

import React from "react";
import Link from "next/link";

export interface AdminBrandHeaderProps {
  className?: string;
  onLinkClick?: () => void;
}

export const AdminBrandHeader: React.FC<AdminBrandHeaderProps> = ({
  className = "",
  onLinkClick,
}) => {
  return (
    <div className={`pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80 ${className}`}>
      <Link
        href="/admin"
        onClick={onLinkClick}
        className="flex items-center gap-2 group w-fit focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B22234] rounded"
        aria-label="Beranda Dasbor Admin Robotika UNS"
      >
        <div className="w-7 h-7 rounded-md bg-[#B22234] flex items-center justify-center text-white font-extrabold text-xs shadow-xs group-hover:bg-[#8B0000] transition-colors">
          R
        </div>
        <span className="font-['League_Spartan',sans-serif] font-extrabold text-xs tracking-wider text-[#18181b] dark:text-zinc-100 uppercase leading-none">
          ROBOTIKA UNS
        </span>
      </Link>
    </div>
  );
};
