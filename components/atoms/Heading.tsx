import React from "react";

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  font?: "jakarta" | "inter";
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  children,
  className = "",
  font = "jakarta",
}) => {
  const fontStyle = font === "jakarta" ? "font-['Plus_Jakarta_Sans',sans-serif]" : "font-sans";

  const levelStyles = {
    1: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#8B0000] leading-[1.15]",
    2: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#8B0000] leading-tight",
    3: "text-xl sm:text-2xl font-bold text-[#2D0A0E] leading-snug",
    4: "text-lg sm:text-xl font-semibold text-[#2D0A0E]",
    5: "text-base font-semibold text-[#2D0A0E]",
    6: "text-sm font-semibold text-[#6E584D] uppercase tracking-wider",
  };

  const Component = `h${level}` as React.ElementType;

  return (
    <Component className={`${fontStyle} ${levelStyles[level]} ${className}`}>
      {children}
    </Component>
  );
};
