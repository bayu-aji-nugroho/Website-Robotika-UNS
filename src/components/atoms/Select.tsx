/*
-----------------------------------------
nama file: [ Select.tsx ] 
fungsi [ Komponen atom menu pilihan dropdown (select) berbasis forwardRef dengan styling konsisten 
terhadap elemen form lainnya, mendukung rendering opsi dinamis, status error visual, dan cincin fokus aksesibel. ]
-----------------------------------------------
*/

import React, { forwardRef } from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean | string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = "", children, ...props }, ref) => {
    const errorStyles = error
      ? "border-[#B22234] bg-red-50/20 dark:bg-red-950/20 focus:border-[#B22234] focus:ring-[#B22234]"
      : "border-zinc-300 dark:border-zinc-700 focus:border-[#B22234] focus:ring-[#B22234]";

    return (
      <select
        ref={ref}
        className={`w-full min-h-[38px] sm:min-h-[42px] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg border text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 transition-colors focus:ring-1 focus:outline-hidden ${errorStyles} ${className}`}
        {...props}
      >
        {children}
      </select>
    );

  }
);

Select.displayName = "Select";
