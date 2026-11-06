/*
-----------------------------------------
nama file: [ DrawnText.tsx ]
fungsi [ Komponen yang merender teks berbasis path SVG dan menganimasikannya huruf per huruf seperti sedang digambar, lalu terisi warna. Ukuran mengikuti font-size induk dan warna mengikuti warna teks induk. ]
-----------------------------------------------
*/

import React from "react";
import type { DrawnLine } from "@/data/heroTitlePaths";

export interface DrawnTextProps {
  line: DrawnLine;
  className?: string;
  delay?: number;
  stagger?: number;
}

export const DrawnText: React.FC<DrawnTextProps> = ({ line, className = "", delay = 0, stagger = 0.05 }) => {
  return (
    <svg
      viewBox={line.viewBox}
      aria-hidden="true"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={0}
      className={`block h-[1.15em] w-auto max-w-full overflow-visible ${className}`}
    >
      {line.glyphs.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          className="motion-safe:animate-draw-glyph"
          style={{ animationDelay: `${delay + i * stagger}s` }}
        />
      ))}
    </svg>
  );
};
