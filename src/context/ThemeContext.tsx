"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";

export interface ThemeToggleOrigin {
  x: number;
  y: number;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: (origin?: ThemeToggleOrigin) => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyDomTheme = (t: Theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const body = document.body;
  if (t === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";
    if (body) {
      body.classList.add("dark");
      body.classList.remove("light");
    }
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
    root.style.colorScheme = "light";
    if (body) {
      body.classList.remove("dark");
      body.classList.add("light");
    }
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const activeRipple = useRef<ViewTransition | null>(null);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      try {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
          setThemeState("dark");
          applyDomTheme("dark");
        } else {
          setThemeState("light");
          applyDomTheme("light");
        }
      } catch {
        setThemeState("light");
        applyDomTheme("light");
      }
      setMounted(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {}
    applyDomTheme(newTheme);
  };

  const toggleTheme = (origin?: ThemeToggleOrigin) => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    if (
      !origin ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    // Efek tetesan air: tema baru menyebar melingkar dari tombol hingga menutup seluruh layar
    const { x, y } = origin;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const root = document.documentElement;

    root.classList.add("theme-ripple");
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });
    activeRipple.current = transition;

    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 800,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});

    transition.finished.finally(() => {
      if (activeRipple.current === transition) {
        root.classList.remove("theme-ripple");
      }
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === "dark",
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
