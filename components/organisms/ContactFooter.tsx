"use client";

import React from "react";
import { Container } from "../atoms";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const InstagramIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const ContactFooter: React.FC = () => {
  return (
    <footer id="kontak" className="pt-8 sm:pt-14 pb-6 sm:pb-8 bg-white border-t border-[#e4e4e7] overflow-hidden">
      <Container size="lg">
        {/* Main Footer Content: Accounts & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-start">
          {/* Left Column: Identitas & Akun-akun Robotika UNS (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Brand & Description */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://spmb.uns.ac.id/themes/website/assets/images/logo-uns.png"
                  alt="Logo Universitas Sebelas Maret"
                  className="h-10 sm:h-12 w-auto object-contain shrink-0"
                />
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#18181b] tracking-tight leading-snug">
                    Universitas Sebelas Maret
                  </h3>
                  <p className="text-[11px] sm:text-xs font-bold text-[#B22234] leading-tight mt-0.5">
                    Unit Kegiatan Mahasiswa Robotika
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#71717a] leading-relaxed max-w-xl">
                Wadah multidisipliner riset teknologi, pengembangan sistem robotika otonom, dan perancangan wahana kompetisi mahasiswa Universitas Sebelas Maret.
              </p>
            </div>

            {/* Akun & Kanal Resmi Robotika UNS */}
            <div className="space-y-2.5 sm:space-y-3">
              <span className="hidden sm:block text-xs font-mono font-bold uppercase tracking-wider text-[#B22234]">
                AKUN & KANAL RESMI
              </span>

              {/* 1. Baris Media Sosial Khusus Mobile (1 Baris Ringkas) */}
              <div className="grid grid-cols-4 gap-2 sm:hidden">
                <a
                  href="https://www.instagram.com/uns_robotika/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Robotika UNS"
                  className="h-11 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-[#B22234] hover:bg-[#FCF2F3] hover:border-[#F8D7DA] active:scale-95 flex items-center justify-center transition-all shadow-2xs"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://linkedin.com/company/robotika-uns"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Robotika UNS"
                  className="h-11 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-[#B22234] hover:bg-[#FCF2F3] hover:border-[#F8D7DA] active:scale-95 flex items-center justify-center transition-all shadow-2xs"
                >
                  <LinkedinIcon />
                </a>
                <a
                  href="https://github.com/robotika-uns"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Robotika UNS"
                  className="h-11 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-[#B22234] hover:bg-[#FCF2F3] hover:border-[#F8D7DA] active:scale-95 flex items-center justify-center transition-all shadow-2xs"
                >
                  <GithubIcon />
                </a>
                <a
                  href="https://youtube.com/@robotikauns"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Robotika UNS"
                  className="h-11 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-[#B22234] hover:bg-[#FCF2F3] hover:border-[#F8D7DA] active:scale-95 flex items-center justify-center transition-all shadow-2xs"
                >
                  <YoutubeIcon />
                </a>
              </div>

              {/* 2. Grid Akun di Layar Tablet & Desktop (sm ke atas) */}
              <div className="hidden sm:grid grid-cols-2 gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/uns_robotika/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#e4e4e7] bg-[#fafafa] hover:bg-[#FCF2F3] hover:border-[#F8D7DA] transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center text-[#B22234] group-hover:bg-[#B22234] group-hover:text-white group-hover:border-[#B22234] transition-all shrink-0">
                    <InstagramIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono uppercase text-[#71717a] block">Instagram</span>
                    <span className="text-xs font-bold text-[#18181b] group-hover:text-[#B22234] transition-colors truncate block">@uns_robotika</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#B22234] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/robotika-uns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#e4e4e7] bg-[#fafafa] hover:bg-[#FCF2F3] hover:border-[#F8D7DA] transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center text-[#B22234] group-hover:bg-[#B22234] group-hover:text-white group-hover:border-[#B22234] transition-all shrink-0">
                    <LinkedinIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono uppercase text-[#71717a] block">LinkedIn</span>
                    <span className="text-xs font-bold text-[#18181b] group-hover:text-[#B22234] transition-colors truncate block">Robotika UNS</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#B22234] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/robotika-uns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#e4e4e7] bg-[#fafafa] hover:bg-[#FCF2F3] hover:border-[#F8D7DA] transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center text-[#B22234] group-hover:bg-[#B22234] group-hover:text-white group-hover:border-[#B22234] transition-all shrink-0">
                    <GithubIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono uppercase text-[#71717a] block">GitHub</span>
                    <span className="text-xs font-bold text-[#18181b] group-hover:text-[#B22234] transition-colors truncate block">robotika-uns</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#B22234] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@robotikauns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#e4e4e7] bg-[#fafafa] hover:bg-[#FCF2F3] hover:border-[#F8D7DA] transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center text-[#B22234] group-hover:bg-[#B22234] group-hover:text-white group-hover:border-[#B22234] transition-all shrink-0">
                    <YoutubeIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono uppercase text-[#71717a] block">YouTube</span>
                    <span className="text-xs font-bold text-[#18181b] group-hover:text-[#B22234] transition-colors truncate block">Robotika UNS</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#B22234] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>
              </div>

              {/* 3. Kontak Langsung (Email & WhatsApp) - Tampil di Semua Layar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Email */}
                <a
                  href="mailto:robotika@uns.ac.id"
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#e4e4e7] bg-[#fafafa] hover:bg-[#FCF2F3] hover:border-[#F8D7DA] transition-all group shadow-2xs"
                >
                  <div className="h-9 w-9 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center text-[#B22234] group-hover:bg-[#B22234] group-hover:text-white group-hover:border-[#B22234] transition-all shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono uppercase text-[#71717a] block">Email Resmi</span>
                    <span className="text-xs font-bold text-[#18181b] group-hover:text-[#B22234] transition-colors truncate block">robotika@uns.ac.id</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#B22234] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/6281226001199"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#e4e4e7] bg-[#fafafa] hover:bg-[#FCF2F3] hover:border-[#F8D7DA] transition-all group shadow-2xs"
                >
                  <div className="h-9 w-9 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center text-[#B22234] group-hover:bg-[#B22234] group-hover:text-white group-hover:border-[#B22234] transition-all shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono uppercase text-[#71717a] block">Narahubung (WA)</span>
                    <span className="text-xs font-bold text-[#18181b] group-hover:text-[#B22234] transition-colors truncate block">+62 812-2600-1199</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#B22234] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Graha UKM UNS (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-2.5 sm:space-y-3">
            {/* Header / Label (Hanya Tampil di Desktop/Tablet) */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B22234]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B22234]">
                  SEKRETARIAT & LAB
                </span>
              </div>
              <a
                href="https://maps.google.com/?q=Gedung+Graha+UKM+UNS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#71717a] hover:text-[#B22234] transition-colors"
              >
                <span>Buka Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Address Box */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B22234] shrink-0 sm:hidden" />
                  <p className="font-bold text-[#18181b]">Gedung Graha UKM UNS</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Gedung+Graha+UKM+UNS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:hidden inline-flex items-center gap-1 text-[11px] font-semibold text-[#B22234] hover:text-[#8B0000] transition-colors"
                >
                  <span>Buka Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[#71717a] text-[11px] sm:text-xs leading-relaxed sm:pl-0">
                Jl. Ir. Sutami No. 36A, Kentingan, Kec. Jebres, Kota Surakarta, Jawa Tengah 57126
              </p>
            </div>

            {/* Map Iframe */}
            <div className="w-full h-[190px] sm:h-[260px] lg:h-[280px] rounded-2xl overflow-hidden border border-[#e4e4e7] shadow-xs bg-[#f4f4f5]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d404.51541371318524!2d110.85741876644003!3d-7.555033515931137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a171d23917ed9%3A0xb9460041569d15fd!2sGedung%20Graha%20UKM%20UNS!5e1!3m2!1sen!2sid!4v1791539741450!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Peta Lokasi Gedung Graha UKM UNS"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-[#e4e4e7] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs text-[#71717a]">
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start text-center">
            <span>© 2026 Robotika Universitas Sebelas Maret.</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-[#a1a1aa] block sm:inline">Surakarta, Jawa Tengah, Indonesia</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://uns.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#B22234] transition-colors"
            >
              <span>Portal UNS</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
