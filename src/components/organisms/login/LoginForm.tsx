/*
-----------------------------------------
nama file: [ LoginForm.tsx ] 
fungsi [ Komponen organisme kartu autentikasi Single Door khusus Sign In Google untuk anggota dan pengurus Robotika UNS yang mematuhi prinsip atomic design. ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { Lock } from "lucide-react";
import { GoogleSignInButton } from "./GoogleSignInButton";

export interface LoginFormProps {
  onSignIn?: () => void;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSignIn,
  isLoading = false,
}) => {
  return (
    <div className="w-full">
      <div className="bg-white dark:bg-[#141518] rounded-2xl border border-[#e4e4e7] dark:border-zinc-800 shadow-sm p-6 sm:p-8 lg:p-9 transition-colors">
        <div className="space-y-5">
          <div>
            <GoogleSignInButton
              isLoading={isLoading}
              onClick={onSignIn}
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
