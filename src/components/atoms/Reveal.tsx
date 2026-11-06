/*
-----------------------------------------
nama file: [ Reveal.tsx ] 
fungsi [ Komponen pembungkus yang memunculkan konten dengan animasi fade dan geser halus berbasis Framer Motion saat pertama kali masuk ke area pandang pengguna. ]
-----------------------------------------------
*/

"use client";

import React from "react";
import { motion } from "framer-motion";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const Reveal: React.FC<RevealProps> = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
};
