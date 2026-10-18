/*
-----------------------------------------
nama file: [ FormLabel.tsx ] 
fungsi [ Komponen atom label formulir yang menampilkan teks keterangan bidang input, 
penanda bintang merah untuk bidang wajib diisi (required), serta teks sublabel opsional
 untuk informasi tambahan atau panduan pengisian pengguna. ]
-----------------------------------------------
*/

import React from "react";

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  sublabel?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required = false,
  sublabel,
  className = "",
  ...props
}) => {
  return (
    <label
      className={`text-[11px] sm:text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 ${className}`}
      {...props}
    >
      <span>
        {children} {required && <span className="text-[#B22234]">*</span>}
      </span>
      {sublabel && (
        <span className="text-[10px] sm:text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
          {sublabel}
        </span>
      )}
    </label>
  );
};
