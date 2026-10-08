"use client";

import React, { useState, useEffect } from "react";
import { Container } from "../atoms";
import { NavBrand, NavLinks } from "../molecules";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
        scrolled ? "border-b border-[#e4e4e7] py-3 sm:py-4" : "py-3.5 sm:py-6"
      }`}
    >
      <Container size="lg">
        <div className="flex items-center justify-between">
          <NavBrand />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
            <a
              href="#kontak"
              className="px-4 py-1.5 text-xs font-semibold text-[#18181b] border border-[#e4e4e7] rounded-md hover:bg-[#f4f4f5] transition-colors"
            >
              Masuk
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 rounded-xl bg-white border border-[#e4e4e7] space-y-3">
            <NavLinks
              className="flex-col items-start gap-3"
              onItemClick={() => setMobileMenuOpen(false)}
            />
            <div className="pt-3 border-t border-[#e4e4e7]">
              <a
                href="#kontak"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-xs font-semibold text-[#18181b] border border-[#e4e4e7] rounded-md hover:bg-[#f4f4f5]"
              >
                Masuk
              </a>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};
