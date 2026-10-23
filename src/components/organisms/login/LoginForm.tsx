/*
-----------------------------------------
nama file: [ LoginForm.tsx ] 
fungsi [ Komponen organisme kartu autentikasi Single Door khusus Sign In Google untuk anggota dan pengurus Robotika UNS yang mematuhi prinsip atomic design. ]
-----------------------------------------------
*/

"use client";

import React, { useState } from "react";
import { Lock, AlertCircle } from "lucide-react";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { signInWithGoogle } from "@/src/services";

export interface LoginFormProps {
  onSignIn?: () => void;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSignIn,
  isLoading: externalLoading = false,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = async () => {
    if (onSignIn) {
      onSignIn();
      return;
    }

    setInternalLoading(true);
    setErrorMsg("");
    try {
      const { error } = await signInWithGoogle("/admin");
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghubungkan ke Google OAuth.";
      setErrorMsg(msg);
      setInternalLoading(false);
    }
  };

  const loading = externalLoading || internalLoading;

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-[#141518] rounded-2xl border border-[#e4e4e7] dark:border-zinc-800 shadow-sm p-6 sm:p-8 lg:p-9 transition-colors">
        <div className="space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <GoogleSignInButton
              isLoading={loading}
              onClick={handleSignIn}
              label="Masuk dengan Google"
            />
          </div>

          {/* Catatan Enkripsi & Privasi */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#71717a] dark:text-zinc-500">
            <Lock className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            <span>Otorisasi aman melalui Google OAuth 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
