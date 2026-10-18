/*
-----------------------------------------
nama file: [ FormField.tsx ] 
fungsi [ Komponen pembungkus bidang formulir yang menyatukan komponen atom FormLabel, elemen input kontrol anak (children), teks bantuan petunjuk pengisian, serta tampilan ErrorMessage secara rapi dan terstruktur. ]
-----------------------------------------------
*/

import React from "react";
import { FormLabel, ErrorMessage } from "../atoms";

export interface FormFieldProps {
  label: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  sublabel?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  sublabel,
  error,
  helperText,
  children,
  className = "",
}) => {
  return (
    <div className={`space-y-1 sm:space-y-1.5 ${className}`}>
      <FormLabel htmlFor={htmlFor} required={required} sublabel={sublabel}>
        {label}
      </FormLabel>
      {children}
      {helperText && !error && (
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">{helperText}</p>
      )}
      <ErrorMessage message={error} />
    </div>
  );
};
