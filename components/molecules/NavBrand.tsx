import React from "react";

export const NavBrand: React.FC = () => {
  return (
    <a href="#" className="flex items-center gap-3.5 group">
      <div className="flex flex-col">
        <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-base tracking-wider text-[#18181b] uppercase leading-none">
          ROBOTIKA
        </span>
        <span className="text-[9px] font-semibold text-[#71717a] tracking-tight mt-1">
          Universitas Sebelas Maret
        </span>
      </div>

      <div className="h-7 w-[1px] bg-[#e4e4e7]" />

      <img
        src="https://spmb.uns.ac.id/themes/website/assets/images/logo-uns.png"
        alt="Logo UNS"
        className="h-9 w-auto object-contain"
      />
    </a>
  );
};
