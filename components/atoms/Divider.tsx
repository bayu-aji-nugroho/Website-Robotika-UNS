import React from "react";

export interface DividerProps {
  className?: string;
  dashed?: boolean;
}

export const Divider: React.FC<DividerProps> = ({ className = "", dashed = false }) => {
  const borderStyle = dashed ? "border-dashed" : "border-solid";
  return <hr className={`w-full border-t border-[#E5D8CC] my-8 ${borderStyle} ${className}`} />;
};
