/*
-----------------------------------------
nama file: [ Skeleton.tsx ]
fungsi [ Komponen placeholder skeleton berkilau (shimmer) dan pembungkus yang menahan konten asli di bawahnya hingga siap ditampilkan, tanpa menggeser tata letak halaman. ]
-----------------------------------------------
*/

import React from "react";

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return <span aria-hidden="true" className={`skeleton block ${className}`} />;
};

export interface SkeletonRevealProps {
  ready: boolean;
  children: React.ReactNode;
  className?: string;
  skeletonClassName?: string;
  lines?: number;
}

export const SkeletonReveal: React.FC<SkeletonRevealProps> = ({
  ready,
  children,
  className = "",
  skeletonClassName = "rounded",
  lines = 1,
}) => {
  return (
    <div className={`relative ${className}`}>
      <div inert={!ready} className={`h-full w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
        {children}
      </div>

      <div
        className={`absolute inset-0 flex flex-col justify-around transition-[opacity,visibility] duration-500 ${
          ready ? "invisible opacity-0" : "opacity-100"
        }`}
      >
        {lines === 1 ? (
          <Skeleton className={`h-full ${skeletonClassName}`} />
        ) : (
          Array.from({ length: lines }, (_, i) => (
            <Skeleton
              key={i}
              className={`h-[0.8em] ${skeletonClassName} ${i === lines - 1 ? "w-2/3" : "w-full"}`}
            />
          ))
        )}
      </div>
    </div>
  );
};
