/*
-----------------------------------------
nama file: [ Checkbox.tsx ] 
fungsi [ Komponen atom input centang (checkbox) yang dilengkapi dengan label klik interaktif, 
penanganan forwardRef untuk integrasi formulir, dan indikator status validasi error dengan styling yang konsisten terhadap identitas brand. ]
-----------------------------------------------
*/

import React, { forwardRef } from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: boolean | string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label htmlFor={id} className="flex items-start gap-3 cursor-pointer select-none">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={`mt-0.5 h-4 w-4 rounded ${error ? "border-red-500 ring-1 ring-red-500" : "border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800"
              } text-[#B22234] focus:ring-[#B22234] shrink-0 cursor-pointer ${className}`}
            {...props}
          />
          {label && <span className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{label}</span>}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
