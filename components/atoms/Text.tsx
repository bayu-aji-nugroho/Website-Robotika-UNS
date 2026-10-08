import React from "react";

export interface TextProps {
  children: React.ReactNode;
  variant?: "body" | "lead" | "small" | "muted" | "caption" | "code";
  className?: string;
  as?: React.ElementType;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  className = "",
  as = "p",
}) => {
  const variantStyles = {
    lead: "text-lg sm:text-xl text-[#6E584D] leading-relaxed font-normal",
    body: "text-base text-[#6E584D] leading-relaxed",
    small: "text-sm text-[#6E584D] leading-normal",
    muted: "text-xs text-[#A0522D] leading-normal",
    caption: "text-xs text-[#6E584D] font-medium tracking-wide uppercase",
    code: "font-mono text-xs text-[#B22234] bg-[#F4ECE1] px-1.5 py-0.5 rounded border border-[#E5D8CC]",
  };

  const Component = as;

  return <Component className={`${variantStyles[variant]} ${className}`}>{children}</Component>;
};
