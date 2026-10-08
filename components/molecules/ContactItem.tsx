import React from "react";

export interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  status?: string;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  icon,
  label,
  value,
  href,
  status,
}) => {
  const content = (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E5D8CC] hover:border-[#B22234] hover:bg-[#F4ECE1]/50 transition-all group">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F4ECE1] text-[#B22234] group-hover:bg-[#8B0000] group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E584D] block">
          {label}
        </span>
        <span className="text-sm font-medium text-[#2D0A0E] truncate block">
          {value}
        </span>
        {status && (
          <span className="text-[10px] text-[#A0522D] font-medium block">
            {status}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
};
