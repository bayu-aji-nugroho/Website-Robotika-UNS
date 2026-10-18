/*
-----------------------------------------
nama file: [ Button.tsx ] 
fungsi [ Komponen tombol interaktif dasar yang menangani aksi pengguna dengan dukungan varian styling (primary, secondary, outline, ghost),
 tiga skala ukuran (sm, md, lg), opsi lebar penuh (fullWidth), serta integrasi ikon di sisi kiri atau kanan teks secara terstandarisasi. ]
-----------------------------------------------
*/

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  iconPosition = "right",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-[#B22234] text-white hover:bg-[#8B0000] dark:bg-[#C92A3E] dark:hover:bg-[#B22234] focus:ring-[#B22234] dark:focus:ring-offset-[#120D0C] shadow-sm hover:shadow-md",
    secondary:
      "bg-[#F4ECE1] text-[#8B0000] border border-[#E5D8CC] hover:bg-[#D9C6B2]/40 dark:bg-[#2A1D1A] dark:text-[#FF5A6B] dark:border-[#382622] dark:hover:bg-[#382622] focus:ring-[#A0522D] dark:focus:ring-offset-[#120D0C]",
    outline:
      "border border-[#B22234] text-[#B22234] hover:bg-[#B22234]/10 dark:border-[#FF5A6B] dark:text-[#FF5A6B] dark:hover:bg-[#FF5A6B]/15 focus:ring-[#B22234] dark:focus:ring-offset-[#120D0C]",
    ghost:
      "text-[#6E584D] hover:text-[#8B0000] hover:bg-[#F4ECE1] dark:text-[#BFAFA6] dark:hover:text-[#FF5A6B] dark:hover:bg-[#2A1D1A] focus:ring-[#A0522D] dark:focus:ring-offset-[#120D0C]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 min-h-[32px]",
    md: "px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm gap-1.5 sm:gap-2 min-h-[38px] sm:min-h-[42px]",
    lg: "px-5 py-2.5 sm:px-6 sm:py-3.5 text-sm sm:text-base gap-2 sm:gap-2.5 font-semibold min-h-[44px] sm:min-h-[48px]",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="inline-flex shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="inline-flex shrink-0">{icon}</span>
      )}
    </button>
  );
};
