/*
-----------------------------------------
nama file: [ AnimatedWordBadge.tsx ] 
fungsi [ Komponen badge interaktif dengan animasi pergantian kata kunci (teknologi, riset, inovasi) berbasis Framer Motion yang berganti otomatis secara berkala atau manual saat diklik oleh pengguna. ]
-----------------------------------------------
*/

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
    text: "teknologi",
    icon: Cpu,
    textColor: "text-[#0284c7] dark:text-[#38bdf8]",
    bgColor: "bg-[#F0F7FF] dark:bg-sky-950/40",
    borderColor: "border-[#BAE6FD] dark:border-sky-800/60",
    iconBg: "bg-[#E0F2FE] dark:bg-sky-900/60 text-[#0284c7] dark:text-sky-200 border border-[#BAE6FD] dark:border-sky-700",
    iconColor: "text-[#0284c7] dark:text-sky-200",
    shadowColor: "shadow-[0_2px_12px_rgba(2,132,199,0.12)] dark:shadow-[0_2px_14px_rgba(56,189,248,0.2)]",
  },
  {
    text: "riset",
    icon: Microscope,
    textColor: "text-[#B22234] dark:text-[#ef4444]",
    bgColor: "bg-[#FFF6F7] dark:bg-red-950/40",
    borderColor: "border-[#F8D2D6] dark:border-red-900/60",
    iconBg: "bg-[#FCF0F2] dark:bg-red-900/60 text-[#B22234] dark:text-red-200 border border-[#F4C7CD] dark:border-red-800",
    iconColor: "text-[#B22234] dark:text-red-200",
    shadowColor: "shadow-[0_2px_12px_rgba(178,34,52,0.08)] dark:shadow-[0_2px_12px_rgba(239,68,68,0.15)]",
  },
  {
    text: "inovasi",
    icon: Lightbulb,
    textColor: "text-[#A0522D] dark:text-[#fb923c]",
    bgColor: "bg-[#FDF8F4] dark:bg-amber-950/40",
    borderColor: "border-[#EBD8CA] dark:border-amber-900/60",
    iconBg: "bg-[#F7ECE1] dark:bg-amber-900/60 text-[#A0522D] dark:text-amber-200 border border-[#E5D2C2] dark:border-amber-800",
    iconColor: "text-[#A0522D] dark:text-amber-200",
    shadowColor: "shadow-[0_2px_12px_rgba(160,82,45,0.08)] dark:shadow-[0_2px_12px_rgba(245,158,11,0.15)]",
  },
];


export const AnimatedWordBadge: React.FC = () => {
  const [index, setIndex] = useState(0);

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
              className="inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap font-['League_Spartan',sans-serif]"
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
