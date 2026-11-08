"use client";

import React from "react";
import { MotionConfig } from "framer-motion";
import { LandingRevealProvider } from "@/src/context";
import {
  Navbar,
  HeroSection,
  AboutSection,
  DivisionSection,
  ContactFooter,
  RegisterGuideButton,
} from "../organisms";

export const LandingPageTemplate: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <LandingRevealProvider>
        <div className="min-h-screen flex flex-col bg-[#f7fafd] dark:bg-[#121316] text-[#102e4a] dark:text-[#f4f4f5] transition-colors duration-200">
          <Navbar />
          <main className="flex-1">
            <HeroSection />
            <AboutSection />
            <DivisionSection />
          </main>
          <ContactFooter />
          <RegisterGuideButton />
        </div>
      </LandingRevealProvider>
    </MotionConfig>
  );
};
