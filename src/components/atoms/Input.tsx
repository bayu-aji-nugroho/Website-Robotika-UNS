/*
-----------------------------------------
nama file: [ Input.tsx ] 
fungsi [ Komponen atom input teks satu baris  berbasis forwardRef dengan dukungan styling status validasi error, mode tipografi monospace opsional, placeholder responsif,
 serta penanganan fokus aksesibel untuk formulir. ]
-----------------------------------------------
*/

import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string;
  isMono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, isMono = false, className = "", ...props }, ref) => {
    const errorStyles = error
      ? "border-[#B22234] bg-red-50/20 dark:bg-red-950/20 focus:border-[#B22234] focus:ring-[#B22234] field-error"
      : "border-zinc-300 dark:border-zinc-700 focus:border-[#B22234] focus:ring-[#B22234]";

    const fontStyles = isMono ? "font-mono uppercase" : "";

    return (
      <input
        ref={ref}
        className={`w-full min-h-[38px] sm:min-h-[42px] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg border text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900/90 placeholder-zinc-400 dark:placeholder-zinc-500 transition-colors focus:ring-1 focus:outline-hidden ${fontStyles} ${errorStyles} ${className}`}
        {...props}
      />
    );

  }
);

Input.displayName = "Input";
