/*
-----------------------------------------
nama file: [ AdminDashboardTemplate.tsx ] 
fungsi [ Komponen template tata letak dasbor admin yang menyusun bilah navigasi vertikal di sisi kiri dan area konten di sisi kanan secara modular dan terstruktur. ]
-----------------------------------------------
*/

"use client";

import React, { useState } from "react";
import { AdminNavKey } from "../atoms";
import { AdminSidebar } from "../organisms";

export interface AdminDashboardTemplateProps {
  initialCondition?: AdminNavKey;
  children?: React.ReactNode;
}

export const AdminDashboardTemplate: React.FC<AdminDashboardTemplateProps> = ({
  initialCondition = "dashboard",
  children,
}) => {
  const [currentCondition, setCurrentCondition] = useState<AdminNavKey>(initialCondition);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F9F9F8] dark:bg-[#0c0d0e] text-[#18181b] dark:text-[#f4f4f5] transition-colors duration-200">
      {/* 1. Bilah Samping Vertikal Kiri (Organism) */}
      <AdminSidebar
        activeKey={currentCondition}
        onNavigate={(key) => setCurrentCondition(key)}
      />

      {/* 2. Area Konten Utama */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex-1 p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
