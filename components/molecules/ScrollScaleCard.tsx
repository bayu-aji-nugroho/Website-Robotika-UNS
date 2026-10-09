"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export interface ScrollScaleCardProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollScaleCard: React.FC<ScrollScaleCardProps> = ({
  children,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scale: starts smaller (0.88), expands smoothly to 1.0 around the viewport center,
  // then scales down again (0.88) as it leaves past the top.
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.88, 1, 1, 0.88]
  );

  // Opacity: starts at 0.65, reaches 1.0 when entering viewport center,
  // shrinks to 0.65 when scrolling away.
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0.65, 1, 1, 0.65]
  );

  const scale = useSpring(rawScale, { stiffness: 350, damping: 30, mass: 0.1 });
  const opacity = useSpring(rawOpacity, { stiffness: 350, damping: 30, mass: 0.1 });

  return (
    <motion.div
      ref={ref}
      style={
        isDesktop
          ? undefined
          : {
              scale,
              opacity,
              transformOrigin: "center center",
            }
      }
      className={`lg:!transform-none lg:!opacity-100 ${!isDesktop ? "will-change-transform" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
};
