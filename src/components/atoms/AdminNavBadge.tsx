/*
-----------------------------------------
nama file: [ AdminNavBadge.tsx ] 
fungsi [ Komponen atom lencana status atau counter mini pada item navigasi admin yang menginformasikan status rute atau notifikasi data secara ringkas. ]
-----------------------------------------------
*/

import React from "react";

export interface AdminNavBadgeProps {
  label: string | number;
  variant?: "primary" | "neutral" | "subtle";
  className?: string;
}

export const AdminNavBadge: React.FC<AdminNavBadgeProps> = ({
  label,
  variant = "subtle",
  className = "",
}) => {
  const variantStyles = {
    primary:
      "bg-[#B22234] text-white border-transparent",
    neutral:
      "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
    subtle:
      "bg-[#FCF2F3] dark:bg-red-950/40 text-[#B22234] dark:text-red-300 border-[#F8D7DA] dark:border-red-900/50",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold font-mono tracking-tight rounded-md border transition-colors ${variantStyles[variant]} ${className}`}
    >
      {label}
    </span>
  );
};
