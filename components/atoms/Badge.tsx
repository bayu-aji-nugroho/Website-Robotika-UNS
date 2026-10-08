import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "status" | "info" | "section" | "tech" | "warning";
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "status",
  pulse = false,
  className = "",
}) => {
  const baseStyles = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase";

  const variantStyles = {
    status: "bg-[#FDF2F2] text-[#B22234] border border-[#F8D7DA]",
    info: "bg-[#F4ECE1] text-[#A0522D] border border-[#E5D8CC]",
    section: "bg-[#8B0000] text-white font-mono text-[11px] tracking-wider",
    tech: "bg-[#D9C6B2]/30 text-[#6E584D] border border-[#D9C6B2]",
    warning: "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B22234] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B22234]"></span>
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
