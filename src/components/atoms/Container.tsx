/*
-----------------------------------------
nama file: [ Container.tsx ] 
fungsi [ Komponen pembungkus tata letak (layout wrapper) responsif yang membatasi lebar maksimum konten (sm, md, lg, full) 
serta memberikan padding horizontal terstandarisasi untuk menjaga konsistensi visual di berbagai resolusi layar. ]
-----------------------------------------------
*/

import React from "react";

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  size = "lg",
}) => {
  const sizeStyles = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeStyles[size]} ${className}`}>
      {children}
    </div>
  );
};
