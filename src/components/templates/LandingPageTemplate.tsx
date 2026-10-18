"use client";

import React from "react";
import { Navbar, HeroSection, AboutSection, DivisionSection, ContactFooter } from "../organisms";

export const LandingPageTemplate: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafd] dark:bg-[#0c0d0e] text-[#102e4a] dark:text-[#f4f4f5] transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <DivisionSection />
      </main>
      <ContactFooter />
    </div>
  );
};
