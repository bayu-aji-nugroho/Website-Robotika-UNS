import React from "react";

export interface NavLinkItem {
  label: string;
  href: string;
}

const defaultLinks: NavLinkItem[] = [
  { label: "Tentang Kami", href: "#tentang-kami" },
  { label: "Divisi", href: "#divisi-tim" },
];

export interface NavLinksProps {
  links?: NavLinkItem[];
  className?: string;
  onItemClick?: () => void;
}

export const NavLinks: React.FC<NavLinksProps> = ({
  links = defaultLinks,
  className = "",
  onItemClick,
}) => {
  return (
    <nav className={`flex items-center gap-6 ${className}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          onClick={onItemClick}
          className="text-xs font-semibold text-[#3f3f46] hover:text-[#18181b] transition-colors"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};
