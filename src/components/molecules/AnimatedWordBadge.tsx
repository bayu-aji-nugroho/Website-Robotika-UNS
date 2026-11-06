/*
-----------------------------------------
nama file: [ AnimatedWordBadge.tsx ] 
fungsi [ Komponen badge interaktif dengan animasi teks berputar per huruf untuk kata kunci (teknologi, riset, inovasi) berbasis Framer Motion yang berganti otomatis secara berkala atau manual saat diklik oleh pengguna. ]
-----------------------------------------------
*/

"use client";

import { motion, AnimatePresence, MotionConfig, type Variants } from "framer-motion";
import React, { useState, useEffect } from "react";

interface WordItem {
  text: string;
  textColor: string;
}

const WORDS: WordItem[] = [
  {
    text: "teknologi",
    textColor: "text-[#B22234] dark:text-[#EE3B47]",
  },
  {
    text: "riset",
    textColor: "text-[#B22234] dark:text-[#EE3B47]",
  },
  {
    text: "inovasi",
    textColor: "text-[#B22234] dark:text-[#EE3B47]",
  },
];

const wordVariants: Variants = {
  enter: {},
  center: { transition: { staggerChildren: 0.03 } },
  leave: { transition: { staggerChildren: 0.02 } },
};

const rotateVariants: Variants = {
  enter: { y: "90%", rotateX: -90, opacity: 0 },
  center: { y: 0, rotateX: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  leave: { y: "-90%", rotateX: 90, opacity: 0, transition: { duration: 0.22, ease: "easeIn" } },
};

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
          className="relative inline-flex items-center overflow-hidden py-0.5 sm:py-1 h-[40px] sm:h-[56px] lg:h-[66px]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentItem.text}
              variants={wordVariants}
              initial="enter"
              animate="center"
              exit="leave"
              style={{ perspective: 400 }}
              className="inline-flex items-center whitespace-nowrap"
            >
              <span
                className={`inline-flex text-3xl sm:text-5xl lg:text-[56px] font-extrabold uppercase tracking-tight ${currentItem.textColor}`}
              >
                <span className="sr-only">{currentItem.text}</span>
                {currentItem.text.split("").map((char, i) => (
                  <motion.span key={i} aria-hidden="true" variants={rotateVariants} className="inline-block">
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </motion.span>
    </MotionConfig>
  );
};
