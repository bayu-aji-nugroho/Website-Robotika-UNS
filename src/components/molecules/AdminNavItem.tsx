/*
-----------------------------------------
nama file: [ AdminNavItem.tsx ] 
fungsi [ Komponen molekul item navigasi bilah samping admin yang menggabungkan ikon, teks, lencana, dan indikator aktif vertikal dengan dukungan navigasi rute dan keyboard. ]
-----------------------------------------------
*/

import React from "react";
import Link from "next/link";
import { AdminNavIcon, AdminNavItemText, AdminNavBadge, AdminNavKey } from "../atoms";

export interface AdminNavItemProps {
  navKey: AdminNavKey;
  label: string;
  href: string;
  isActive?: boolean;
  badge?: string | number;
  badgeVariant?: "primary" | "neutral" | "subtle";
  onClick?: () => void;
  className?: string;
}

export const AdminNavItem: React.FC<AdminNavItemProps> = ({
  navKey,
  label,
  href,
  isActive = false,
  badge,
  badgeVariant = "subtle",
  onClick,
  className = "",
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`group flex items-center justify-between w-full px-2.5 py-1.5 rounded-md transition-colors duration-150 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B22234] ${
        isActive
          ? "bg-red-500/10 text-[#B22234] dark:text-red-400 font-semibold"
          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        <AdminNavIcon navKey={navKey} isActive={isActive} size={16} />
        <AdminNavItemText label={label} isActive={isActive} />
      </div>

      {badge !== undefined && (
        <AdminNavBadge label={badge} variant={isActive ? "primary" : badgeVariant} />
      )}
    </Link>
  );
};
