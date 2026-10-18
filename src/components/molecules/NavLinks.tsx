/*
-----------------------------------------
nama file: [ NavLinks.tsx ] 
fungsi [ Komponen tautan navigasi bilah menu yang merender daftar rute navigasi antarbagian halaman dengan penanganan klik interaktif dan transisi warna hover yang halus. ]
-----------------------------------------------
*/

import React from "react";
import Link from "next/link";

export interface NavLinkItem {
  label: string;
  href: string;
}

const defaultLinks: NavLinkItem[] = [
  { label: "Tentang Kami", href: "/#tentang-kami" },
  { label: "Divisi", href: "/#divisi-tim" },
];

export interface NavLinksProps {
  links?: NavLinkItem[];
  className?: string;
  onItemClick?: () => void;
}

export const NavLinks: React.FC<NavLinksProps> = ({
  links = defaultLinks,
  className = "",
  onItemClick,
}) => {
  return (
    <nav className={`flex items-center gap-6 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          onClick={onItemClick}
          className="text-xs font-semibold text-[#3f3f46] hover:text-[#18181b] dark:text-zinc-300 dark:hover:text-white transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
