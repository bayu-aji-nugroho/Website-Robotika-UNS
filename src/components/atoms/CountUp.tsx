/*
-----------------------------------------
nama file: [ CountUp.tsx ]
fungsi [ Komponen angka yang menghitung naik saat pertama kali masuk ke area pandang pengguna; akhiran seperti "+" baru muncul setelah angka mencapai nilai akhir. ]
-----------------------------------------------
*/

"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

export interface CountUpProps {
  from?: number;
  to: number;
  suffix?: string;
  // Tahan hitungan selama angka masih tertutup skeleton
  start?: boolean;
  duration?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to,
  suffix = "",
  start = true,
  duration = 2,
  className = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView || !start) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = animate(from, to, {
      duration: reducedMotion ? 0 : duration,
      ease: "easeOut",
      onUpdate: (latest) => setValue(Math.round(latest)),
      onComplete: () => setValue(to),
    });

    return () => controls.stop();
  }, [inView, start, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{`${to}${suffix}`}</span>
      <span aria-hidden="true" className="tabular-nums">
        {value}
        {value === to && suffix}
      </span>
    </span>
  );
};
