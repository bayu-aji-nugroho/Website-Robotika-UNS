/*
-----------------------------------------
nama file: [ ThemeToggle.tsx ] 
fungsi [ Komponen tombol sakelar on/off mode gelap dengan animasi transisi ikon matahari/bulan, dukungan keyboard, dan penanganan status tema aktif ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/src/context";

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabel = false,
}) => {
  const { isDark, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center gap-2 p-2 sm:px-2.5 sm:py-1.5 rounded-md border border-[#e4e4e7] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#18181b] dark:text-zinc-200 hover:bg-[#f4f4f5] dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B22234] cursor-pointer group shadow-2xs ${className}`}
      aria-label={
        mounted
          ? isDark
            ? "Matikan mode gelap (Beralih ke mode terang)"
            : "Aktifkan mode gelap (Beralih ke mode gelap)"
          : "Ganti mode tema"
      }
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* Sun icon (visible in dark mode) */}
        <Sun
          className={`w-4 h-4 text-amber-400 absolute transition-all duration-300 transform ${
            mounted && isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
        {/* Moon icon (visible in light mode) */}
        <Moon
          className={`w-4 h-4 text-[#52525b] group-hover:text-[#18181b] absolute transition-all duration-300 transform ${
            !mounted || !isDark
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-semibold select-none">
          {mounted && isDark ? "Mode Terang" : "Mode Gelap"}
        </span>
      )}
    </button>
  );
};
