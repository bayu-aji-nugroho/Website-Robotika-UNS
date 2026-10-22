/*
-----------------------------------------
nama file: [ AdminAvatar.tsx ] 
fungsi [ Komponen atom avatar visual ringkas berbasis inisial pengurus admin dengan styling kontras tinggi dan bingkai proporsional. ]
-----------------------------------------------
*/

import React from "react";

export interface AdminAvatarProps {
  initials?: string;
  size?: "sm" | "md";
  className?: string;
}

export const AdminAvatar: React.FC<AdminAvatarProps> = ({
  initials = "AD",
  size = "md",
  className = "",
}) => {
  const sizeStyles = {
    sm: "w-7 h-7 text-[11px]",
    md: "w-9 h-9 text-xs",
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-bold tracking-wider rounded-lg bg-[#FCF2F3] dark:bg-red-950/50 text-[#B22234] dark:text-red-300 border border-[#F8D7DA] dark:border-red-900/60 select-none shrink-0 ${sizeStyles[size]} ${className}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
};
