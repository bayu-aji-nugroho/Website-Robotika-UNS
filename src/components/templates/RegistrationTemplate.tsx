"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegistrationForm } from "../organisms";
import { Container, ThemeToggle } from "../atoms";

export const RegistrationTemplate: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F8] dark:bg-[#0c0d0e] text-[#18181b] dark:text-[#f4f4f5] print:bg-white print:min-h-0 transition-colors duration-200">
      <main className="flex-1 py-4 sm:py-8 lg:py-12 print:py-0">
        <Container size="lg" className="print:max-w-none print:p-0">
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 print:max-w-none print:space-y-0 print:m-0">
            <div className="print:hidden flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-1 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
                <span>Kembali ke Beranda</span>
              </Link>
              <ThemeToggle />
            </div>


            <h1 className="sr-only">Pendaftaran Calon Anggota Robotika UNS</h1>

            <section aria-label="Formulir Pendaftaran Multi-Sesi">
              <RegistrationForm />
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
};
