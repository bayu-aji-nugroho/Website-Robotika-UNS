"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

export interface LandingRevealContextType {
  ready: boolean;
  markReady: () => void;
}

const LandingRevealContext = createContext<LandingRevealContextType>({
  ready: true,
  markReady: () => {},
});

// Skeleton hanya tampil saat situs pertama dibuka, tidak saat kembali lewat navigasi internal
let revealedOnce = false;

export const LandingRevealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(revealedOnce);

  const markReady = useCallback(() => {
    revealedOnce = true;
    setReady(true);
  }, []);

  return (
    <LandingRevealContext.Provider value={{ ready, markReady }}>
      {children}
    </LandingRevealContext.Provider>
  );
};

export const useLandingReveal = (): LandingRevealContextType => useContext(LandingRevealContext);
