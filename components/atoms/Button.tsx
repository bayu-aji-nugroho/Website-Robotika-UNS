import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-[#B22234] text-white hover:bg-[#8B0000] focus:ring-[#B22234] shadow-sm hover:shadow-md",
    secondary:
      "bg-[#F4ECE1] text-[#8B0000] border border-[#E5D8CC] hover:bg-[#D9C6B2]/40 focus:ring-[#A0522D]",
    outline:
      "border border-[#B22234] text-[#B22234] hover:bg-[#B22234]/10 focus:ring-[#B22234]",
    ghost:
      "text-[#6E584D] hover:text-[#8B0000] hover:bg-[#F4ECE1] focus:ring-[#A0522D]",
  };

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5 font-semibold",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
};
