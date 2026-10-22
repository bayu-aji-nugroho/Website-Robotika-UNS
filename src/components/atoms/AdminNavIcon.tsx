/*
-----------------------------------------
nama file: [ AdminNavIcon.tsx ] 
fungsi [ Komponen atom ikon navigasi bilah samping admin yang merender simbol visual relevan (Dasbor, Oprec, Aku) dengan penanganan status aktif dan transisi warna halus. ]
-----------------------------------------------
*/

import React from "react";
import { LayoutDashboard, UserCheck, LucideIcon } from "lucide-react";

export type AdminNavKey = "dashboard" | "oprec";

export interface AdminNavIconProps {
  navKey: AdminNavKey;
  isActive?: boolean;
  className?: string;
  size?: number;
}

const iconMap: Record<AdminNavKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  oprec: UserCheck,
};

export const AdminNavIcon: React.FC<AdminNavIconProps> = ({
  navKey,
  isActive = false,
  className = "",
  size = 18,
}) => {
  const IconComponent = iconMap[navKey] || LayoutDashboard;

  return (
    <span
      className={`inline-flex items-center justify-center transition-colors duration-200 ${
        isActive
          ? "text-[#B22234] dark:text-red-400"
          : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
      } ${className}`}
      aria-hidden="true"
    >
      <IconComponent size={size} strokeWidth={isActive ? 2.2 : 1.8} />
    </span>
  );
};
