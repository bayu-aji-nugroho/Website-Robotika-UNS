"use client";

import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Microscope, Lightbulb, Cpu } from "lucide-react";
import React, { useState, useEffect } from "react";

interface WordItem {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  textColor: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  shadowColor: string;
}

const WORDS: WordItem[] = [
  {
    text: "riset",
    icon: Microscope,
    textColor: "text-[#B22234]",
    bgColor: "bg-[#FFF6F7]",
    borderColor: "border-[#F8D2D6]",
    iconBg: "bg-[#FCF0F2] text-[#B22234] border border-[#F4C7CD]",
    iconColor: "text-[#B22234]",
    shadowColor: "shadow-[0_2px_12px_rgba(178,34,52,0.08)]",
  },
  {
    text: "inovasi",
    icon: Lightbulb,
    textColor: "text-[#A0522D]",
    bgColor: "bg-[#FDF8F4]",
    borderColor: "border-[#EBD8CA]",
    iconBg: "bg-[#F7ECE1] text-[#A0522D] border border-[#E5D2C2]",
    iconColor: "text-[#A0522D]",
    shadowColor: "shadow-[0_2px_12px_rgba(160,82,45,0.08)]",
  },
  {
    text: "teknologi",
    icon: Cpu,
    textColor: "text-[#8B0000]",
    bgColor: "bg-[#FAF4F5]",
    borderColor: "border-[#ECCBD2]",
    iconBg: "bg-[#F3DFE3] text-[#8B0000] border border-[#E3BFC7]",
    iconColor: "text-[#8B0000]",
    shadowColor: "shadow-[0_2px_12px_rgba(139,0,0,0.08)]",
  },
];

export const AnimatedWordBadge: React.FC = () => {
  const [index, setIndex] = useState(0);

  // Auto cycle every 2.8s; resets timer when index changes (e.g. on manual click)
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2800);

    return () => clearInterval(timer);
  }, [index]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % WORDS.length);
  };

  const currentItem = WORDS[index];
  const CurrentIcon = currentItem.icon;

  return (
    <MotionConfig reducedMotion="never">
      <motion.span
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleNext}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNext();
          }
        }}
        title="Klik untuk melihat kata berikutnya"
        className="inline-block align-middle cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B22234] focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl"
      >
        <motion.span
          layout
          transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
          className={`relative inline-flex items-center overflow-hidden border rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 py-0.5 sm:py-1 h-[36px] sm:h-[46px] lg:h-[52px] transition-colors duration-500 ${currentItem.bgColor} ${currentItem.borderColor} ${currentItem.shadowColor}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentItem.text}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <span
                className={`p-0.5 sm:p-1 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 ${currentItem.iconBg}`}
              >
                <CurrentIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </span>
              <span
                className={`text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${currentItem.textColor}`}
              >
                {currentItem.text}
              </span>
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </motion.span>
    </MotionConfig>
  );
};
