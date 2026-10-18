/*
-----------------------------------------
nama file: [ ErrorMessage.tsx ] 
fungsi [ Komponen atom untuk menampilkan pesan umpan balik kesalahan validasi input formulir secara jelas,
 dilengkapi ikon peringatan (AlertCircle) dan atribut aksesibilitas role="alert" dengan warna kontras standar brand. ]
-----------------------------------------------
*/

import React from "react";
import { AlertCircle } from "lucide-react";

export interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <p
      className={`text-[11px] font-medium text-[#B22234] dark:text-[#FF6B7A] flex items-center gap-1 mt-1 ${className}`}
      role="alert"
    >
      <AlertCircle className="w-3 h-3 shrink-0" />
      <span>{message}</span>
    </p>
  );
};
