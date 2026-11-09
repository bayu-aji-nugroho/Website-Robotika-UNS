"use client";

/*
-----------------------------------------
nama file: [ error.tsx ]
fungsi [ Halaman cadangan saat terjadi error tak terduga di sebuah halaman: menampilkan pesan ramah, tombol coba lagi, dan kembali ke beranda alih-alih layar error bawaan ]
-----------------------------------------------
*/

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCw } from "lucide-react";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error("Terjadi error pada halaman:", error);
  }, [error]);

  const digest =
    error instanceof Error && "digest" in error ? (error as Error & { digest?: string }).digest : undefined;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#F9F9F8] dark:bg-[#121316]">
      <div className="w-full max-w-md text-center space-y-5 bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-xl shadow-xs p-8">
        <AlertTriangle className="w-12 h-12 mx-auto text-[#B22234]" />
        <div className="space-y-1.5">
          <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Terjadi Kendala
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Halaman ini gagal dimuat. Silakan coba lagi. Bila masih berlanjut, muat ulang halaman atau
            hubungi admin OPREC.
          </p>
          {digest && <p className="text-[11px] font-mono text-zinc-400">Kode: {digest}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#B22234] hover:bg-[#8B0000] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
