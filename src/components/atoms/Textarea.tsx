/*
-----------------------------------------
nama file: [ Textarea.tsx ] 
fungsi [ Komponen atom input teks multibaris (textarea) berbasis forwardRef yang mendukung penyesuaian tinggi vertikal, 
indikasi status validasi error terintegrasi, dan styling fokus terstandarisasi untuk pengisian teks panjang. ]
-----------------------------------------------
*/

import React, { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", ...props }, ref) => {
    const errorStyles = error
      ? "border-[#B22234] bg-red-50/20 dark:bg-red-950/20 focus:border-[#B22234] focus:ring-[#B22234] field-error"
      : "border-zinc-300 dark:border-zinc-700 focus:border-[#B22234] focus:ring-[#B22234]";

    return (
      <textarea
        ref={ref}
        className={`w-full p-2.5 sm:p-3.5 rounded-lg border text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900/90 placeholder-zinc-400 dark:placeholder-zinc-500 transition-colors focus:ring-1 focus:outline-hidden leading-relaxed resize-y ${errorStyles} ${className}`}
        {...props}
      />
    );

  }
);

Textarea.displayName = "Textarea";
