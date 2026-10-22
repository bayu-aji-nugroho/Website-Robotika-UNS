/*
-----------------------------------------
nama file: [ AdminUserProfileCard.tsx ] 
fungsi [ Komponen molekul kartu profil pengurus di bagian bawah bilah samping admin yang menampilkan inisial avatar, status akun, dan tautan langsung ke halaman profil 'Aku'. ]
-----------------------------------------------
*/

import React from "react";
import Link from "next/link";
import { AdminAvatar, AdminLogoutButton, ThemeToggle } from "../atoms";

export interface AdminUserProfileCardProps {
  name?: string;
  role?: string;
  isActive?: boolean;
  onCardClick?: () => void;
  onLogout?: () => void;
  showThemeToggle?: boolean;
  className?: string;
}

export const AdminUserProfileCard: React.FC<AdminUserProfileCardProps> = ({
  name = "Admin",
  role = "Pengurus",
  isActive = false,
  onCardClick,
  onLogout,
  showThemeToggle = true,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between p-1.5 rounded-lg border transition-all duration-150 ${
        isActive
          ? "border-[#B22234]/40 bg-red-50/50 dark:bg-red-950/20"
          : "border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/60"
      } ${className}`}
    >
      <Link
        href="/admin/aku"
        onClick={onCardClick}
        className="flex items-center gap-2 min-w-0 flex-1 px-1 py-0.5 rounded-md hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60 transition-colors group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B22234]"
        aria-label={`Profil ${name} (${role})`}
      >
        <AdminAvatar initials="AD" size="sm" />
        <div className="flex flex-col min-w-0 text-left">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-[#B22234] dark:group-hover:text-red-400 transition-colors">
            {name}
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate leading-tight">
            {role}
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-0.5 shrink-0 ml-1">
        {showThemeToggle && <ThemeToggle size="sm" />}
        <AdminLogoutButton onLogout={onLogout} size="sm" />
      </div>
    </div>
  );
};
