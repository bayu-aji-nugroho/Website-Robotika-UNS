/*
-----------------------------------------
nama file: [ AdminSidebar.tsx ] 
fungsi [ Komponen organisme bilah navigasi vertikal (atas-bawah) sisi kiri dasbor admin yang menyusun header brand, daftar navigasi utama (Dasbor, Oprec, Aku), dan kartu ringkasan profil pengurus dengan toggle tema. ]
-----------------------------------------------
*/

"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminNavKey, ThemeToggle } from "../../atoms";
import { AdminBrandHeader, AdminNavItem, AdminUserProfileCard } from "../../molecules";
import { Menu, X } from "lucide-react";

export interface AdminSidebarProps {
  activeKey?: AdminNavKey;
  onNavigate?: (key: AdminNavKey) => void;
  className?: string;
}

interface NavItemConfig {
  key: AdminNavKey;
  label: string;
  href: string;
  badge?: string | number;
  badgeVariant?: "primary" | "neutral" | "subtle";
}

const navItems: NavItemConfig[] = [
  {
    key: "dashboard",
    label: "Dasbor",
    href: "/admin",
  },
  {
    key: "oprec",
    label: "Oprec",
    href: "/admin/oprec",
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeKey,
  onNavigate,
  className = "",
}) => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Menentukan status item aktif berdasarkan prop atau rute saat ini
  const resolveActive = (itemKey: AdminNavKey, href: string): boolean => {
    if (activeKey) {
      return activeKey === itemKey;
    }
    if (itemKey === "dashboard") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleItemClick = (key: AdminNavKey) => {
    if (onNavigate) {
      onNavigate(key);
    }
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-3 select-none">
      {/* Bagian Atas: Identitas Brand Admin & Navigasi */}
      <div>
        <AdminBrandHeader onLinkClick={() => setIsMobileOpen(false)} />

        {/* Bilah Navigasi Vertikal */}
        <nav
          aria-label="Navigasi Bilah Samping Admin"
          className="mt-3 flex flex-col space-y-1"
        >
          {navItems.map((item) => {
            const isActive = resolveActive(item.key, item.href);
            return (
              <AdminNavItem
                key={item.key}
                navKey={item.key}
                label={item.label}
                href={item.href}
                isActive={isActive}
                badge={item.badge}
                badgeVariant={item.badgeVariant}
                onClick={() => handleItemClick(item.key)}
              />
            );
          })}
        </nav>
      </div>

      {/* Bagian Bawah: Card Akun Pengurus dengan Logout & Tema */}
      <div className="pt-3 border-t border-[#e4e4e7] dark:border-zinc-800">
        <AdminUserProfileCard
          name="Admin"
          role="Pengurus"
          onCardClick={() => setIsMobileOpen(false)}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Header bar khusus tampilan mobile (< md) */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-3.5 py-2.5 bg-white/95 dark:bg-[#0c0d0e]/95 backdrop-blur-md border-b border-[#e4e4e7] dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#B22234] flex items-center justify-center text-white font-extrabold text-xs">
            R
          </div>
          <span className="font-['League_Spartan',sans-serif] font-extrabold text-xs tracking-wider uppercase text-[#18181b] dark:text-zinc-100">
            ROBOTIKA UNS
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle size="sm" />
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 rounded-md text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B22234]"
            aria-label={isMobileOpen ? "Tutup bilah menu navigasi" : "Buka bilah menu navigasi"}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay untuk mobile saat drawer terbuka */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Desktop (stasioner di kiri) dan Drawer Mobile */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-56 sm:w-60 bg-white dark:bg-[#0c0d0e] border-r border-[#e4e4e7] dark:border-zinc-800 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } ${className}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
