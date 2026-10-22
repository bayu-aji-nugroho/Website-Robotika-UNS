/*
-----------------------------------------
nama file: [ NavUserMenu.tsx ] 
fungsi [ Komponen molekul menu avatar pengguna di Navbar dengan popover informasi profil dan opsi logout tunggal. ]
-----------------------------------------------
*/

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { GoogleAuthUser } from "@/src/services";

export interface NavUserMenuProps {
  user: GoogleAuthUser;
  onLogout: () => void;
}

export const NavUserMenu: React.FC<NavUserMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const initial = (user.fullName || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:ring-2 hover:ring-[#B22234]/30 focus:outline-none focus:ring-2 focus:ring-[#B22234] transition-all cursor-pointer flex items-center justify-center shrink-0 bg-[#B22234] text-white shadow-xs"
        aria-label="Menu Akun Pengguna"
        aria-expanded={isOpen}
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.fullName || "Avatar"}
            fill
            unoptimized
            sizes="34px"
            className="object-cover"
          />
        ) : (
          <span className="text-xs font-bold leading-none select-none">{initial}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white dark:bg-[#141518] border border-zinc-200/90 dark:border-zinc-800 shadow-xl p-3 z-50 text-left animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#B22234] text-white flex items-center justify-center shrink-0 text-xs font-bold">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.fullName || "Avatar"}
                  fill
                  unoptimized
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {user.fullName || "Pengguna"}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {user.email || "email@uns.ac.id"}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors shrink-0" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
