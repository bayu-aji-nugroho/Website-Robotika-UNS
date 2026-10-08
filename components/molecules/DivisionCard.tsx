import React from "react";
import { Heading, Text, Badge } from "../atoms";

export interface DivisionCardProps {
  title: string;
  focus: string;
  category?: string;
  icon?: React.ReactNode;
  tags?: string[];
  badgeText?: string;
}

export const DivisionCard: React.FC<DivisionCardProps> = ({
  title,
  focus,
  category,
  icon,
  tags,
  badgeText,
}) => {
  return (
    <div className="glass-card p-6 rounded-2xl bg-white border border-[#E5D8CC] flex flex-col justify-between hover:border-[#B22234] hover:shadow-lg transition-all duration-300 group">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4ECE1] text-[#B22234] group-hover:bg-[#8B0000] group-hover:text-white transition-colors">
              {icon}
            </div>
          )}
          {badgeText && <Badge variant="info">{badgeText}</Badge>}
          {category && <span className="text-[11px] font-mono uppercase tracking-wider text-[#A0522D] bg-[#F4ECE1] px-2 py-0.5 rounded">{category}</span>}
        </div>
        <div>
          <Heading level={4} className="group-hover:text-[#B22234] transition-colors">
            {title}
          </Heading>
          <Text variant="small" className="mt-1 text-[#6E584D]">
            {focus}
          </Text>
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[#F4ECE1]">
          {tags.map((tag) => (
            <span key={tag} className="text-[11px] font-medium text-[#6E584D] bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#E5D8CC]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
