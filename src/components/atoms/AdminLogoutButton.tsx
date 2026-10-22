/*
-----------------------------------------
nama file: [ AdminLogoutButton.tsx ] 
fungsi [ Komponen atom tombol keluar (logout) dari portal admin dengan ikon LogOut, umpan balik interaktif, aksesibilitas keyboard, dan navigasi pengalihan rute login. ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export interface AdminLogoutButtonProps {
  onLogout?: () => void;
  className?: string;
  redirectTo?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export const AdminLogoutButton: React.FC<AdminLogoutButtonProps> = ({
  onLogout,
  className = "",
  redirectTo = "/login",
  size = "md",
  showLabel,
}) => {
  const router = useRouter();
  const isCompact = size === "sm";
  const shouldShowLabel = showLabel ?? !isCompact;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      router.push(redirectTo);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        isCompact
          ? `inline-flex items-center justify-center p-1.5 rounded-md text-zinc-500 hover:text-[#B22234] dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-950/40 transition-colors cursor-pointer group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B22234] ${className}`
          : `inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold text-zinc-500 hover:text-[#B22234] dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-950/30 transition-all duration-150 cursor-pointer w-fit group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B22234] ${className}`
      }
      title="Keluar (Logout)"
      aria-label="Keluar dari portal admin"
    >
      <LogOut className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#B22234] dark:group-hover:text-red-400 transition-colors" />
      {shouldShowLabel && <span>Logout</span>}
    </button>
  );
};
