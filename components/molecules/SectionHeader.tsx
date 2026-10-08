import React from "react";
import { Badge, Heading, Text } from "../atoms";

export interface SectionHeaderProps {
  marker: string;
  label: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  marker,
  label,
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Badge variant="section">{marker}</Badge>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#A0522D]">
          {label}
        </span>
      </div>
      <Heading level={2} className="text-3xl sm:text-4xl text-[#8B0000]">
        {title}
      </Heading>
      {subtitle && <Text variant="lead">{subtitle}</Text>}
    </div>
  );
};
