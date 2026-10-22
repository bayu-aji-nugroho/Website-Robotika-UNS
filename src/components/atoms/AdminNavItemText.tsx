/*
-----------------------------------------
nama file: [ AdminNavItemText.tsx ] 
fungsi [ Komponen atom teks label menu navigasi bilah samping admin dengan tipografi konsisten dan hierarki kontras aktif/non-aktif. ]
-----------------------------------------------
*/

import React from "react";

export interface AdminNavItemTextProps {
  label: string;
  isActive?: boolean;
  className?: string;
}

export const AdminNavItemText: React.FC<AdminNavItemTextProps> = ({
  label,
  isActive = false,
  className = "",
}) => {
  return (
    <span
      className={`text-xs tracking-normal transition-colors duration-150 select-none ${
        isActive
          ? "font-semibold text-[#18181b] dark:text-zinc-100"
          : "font-normal text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
      } ${className}`}
    >
      {label}
    </span>
  );
};
