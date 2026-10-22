/*
-----------------------------------------
nama file: [ RegistrationAuthSection.tsx ] 
fungsi [ Komponen langkah kedua formulir pendaftaran untuk autentikasi akun Google via Supabase Auth dengan antarmuka yang bersih dan terfokus. ]
-----------------------------------------------
*/

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/atoms";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  LogOut,
  Mail,
} from "lucide-react";
import {
  GoogleAuthUser,
  signInWithGoogle,
  signOutUser,
} from "@/src/services";

export interface RegistrationAuthSectionProps {
  user: GoogleAuthUser | null;
  isLocked?: boolean;
  onUserChange: (user: GoogleAuthUser | null) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const RegistrationAuthSection: React.FC<RegistrationAuthSectionProps> = ({
  user,
  isLocked = false,
  onUserChange,
  onPrev,
  onNext,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        throw error;
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal menghubungkan ke Google OAuth. Pastikan konfigurasi Google Provider telah aktif.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      onUserChange(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#18191d] rounded-xl sm:rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-3.5 sm:p-5 md:p-6 space-y-4 sm:space-y-6 shadow-xs transition-colors duration-200">
      {/* Header Langkah */}
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2.5 sm:pb-3">
        <div className="flex items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#B22234] text-white text-xs font-bold shrink-0">
              2
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Autentikasi Akun Google
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
            Langkah 2 dari 6
          </span>
        </div>
      </div>

      {/* Konten Autentikasi */}
      {!user ? (
        <div className="space-y-4">
          {/* Card Google Login Action */}
          <div className="rounded-xl border border-zinc-200/90 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-900/40 p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center">
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>

            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-space-grotesk)]">
                Masuk dengan Akun Google
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                Gunakan akun email SSO UNS (<code className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 font-mono text-xs">@student.uns.ac.id</code>) atau email Google aktif Anda.
              </p>
            </div>

            {/* Error Message jika OAuth gagal/belum disetup */}
            {errorMessage && (
              <div className="max-w-md mx-auto p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-left text-xs text-red-700 dark:text-red-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>Info Autentikasi:</span>
                </div>
                <p className="leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Tombol Login Tunggal */}
            <div className="pt-2 flex items-center justify-center max-w-xs mx-auto">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 font-semibold text-xs sm:text-sm border border-zinc-300 dark:border-zinc-600 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isLoading ? "Menghubungkan..." : "Masuk dengan Google"}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Card Tampilan Jika Sudah Login */
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative">
                {user.avatarUrl ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-zinc-700 shadow-xs">
                    <Image
                      src={user.avatarUrl}
                      alt={user.fullName || "Avatar"}
                      fill
                      unoptimized
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#B22234] text-white font-bold text-base flex items-center justify-center border-2 border-white dark:border-zinc-700 shadow-xs">
                    {(user.fullName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-0.5 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {user.fullName || "Pengguna"}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{user.email || "email@uns.ac.id"}</span>
                </p>
              </div>
            </div>

            <div className="shrink-0 pt-1 sm:pt-0">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isLoading || isLocked}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 transition-colors ${
                  isLocked
                    ? "opacity-50 cursor-not-allowed text-zinc-400 dark:text-zinc-600"
                    : "text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer"
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigasi Bawah */}
      <div className="flex items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button
          type="button"
          variant="outline"
          size="md"
          icon={<ArrowLeft className="w-4 h-4" />}
          iconPosition="left"
          onClick={onPrev}
        >
          <span>Kembali ke Syarat</span>
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
          disabled={!user}
          onClick={onNext}
          className={!user ? "opacity-50 cursor-not-allowed" : ""}
        >
          <span>Lanjut ke Identitas</span>
        </Button>
      </div>
    </div>
  );
};
