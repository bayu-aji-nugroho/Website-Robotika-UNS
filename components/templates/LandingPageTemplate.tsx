"use client";

import React from "react";
import { Navbar, HeroSection, AboutSection, DivisionSection, ContactFooter } from "../organisms";

export const LandingPageTemplate: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafd] text-[#102e4a]">
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
