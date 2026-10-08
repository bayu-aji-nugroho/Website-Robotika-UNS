import React from "react";
import { Heading, Text } from "../atoms";

export interface StatCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, description, icon }) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-[#E5D8CC] bg-white flex flex-col justify-between relative overflow-hidden group hover:border-[#B22234] transition-all">
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all text-[#8B0000]">
        {icon}
      </div>
      <div className="space-y-1">
        <Heading level={2} className="text-4xl sm:text-5xl font-extrabold text-[#8B0000] group-hover:text-[#B22234] transition-colors">
          {value}
        </Heading>
        <span className="text-sm font-semibold text-[#2D0A0E] block">{label}</span>
      </div>
      {description && <Text variant="small" className="mt-2 text-[#6E584D]">{description}</Text>}
    </div>
  );
};
