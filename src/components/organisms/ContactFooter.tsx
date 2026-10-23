/*
-----------------------------------------
nama file: [ ContactFooter.tsx ] 
fungsi [ Komponen footer kontak dan informasi organisasi yang menampilkan identitas resmi UKM Robotika UNS, kanal media sosial, alamat sekretariat, dan peta interaktif ]
-----------------------------------------------
*/

"use client";

import React from "react";
import Image from "next/image";
import { Container } from "../atoms";
import {
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";

const InstagramIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export const ContactFooter: React.FC = () => {
  return (
    <footer id="kontak" className="pt-10 sm:pt-14 pb-8 bg-white dark:bg-[#121316] border-t border-[#e4e4e7] dark:border-zinc-800 transition-colors duration-200">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Logo Tim Robotika UNS"
                width={44}
                height={44}
                className="h-11 w-11 object-contain rounded-full shrink-0"
              />

              <div className="h-8 w-[1px] bg-[#e4e4e7] dark:bg-zinc-800 shrink-0" />

              <img
                src="https://spmb.uns.ac.id/themes/website/assets/images/logo-uns.png"
                alt="Logo Universitas Sebelas Maret"
                className="h-11 w-auto object-contain shrink-0"
              />
            </div>

            <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-2.5 pt-1">
              <a
                href="mailto:robotika@uns.ac.id"
                aria-label="Email robotika@uns.ac.id"
                className="inline-flex items-center justify-center sm:justify-start gap-2.5 h-10 w-10 sm:h-auto sm:w-auto p-2.5 sm:px-3 sm:py-2 rounded-lg border border-[#e4e4e7] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-900/80 hover:bg-[#FCF2F3] dark:hover:bg-red-950/40 hover:border-[#F8D7DA] dark:hover:border-red-900/50 hover:text-[#B22234] dark:hover:text-red-400 text-xs font-medium text-[#18181b] dark:text-zinc-200 transition-all"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">robotika@mail.uns.ac.id</span>
              </a>

              <a
                href="https://www.instagram.com/uns_robotika/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @uns_robotika"
                className="inline-flex items-center justify-center sm:justify-start gap-2.5 h-10 w-10 sm:h-auto sm:w-auto p-2.5 sm:px-3 sm:py-2 rounded-lg border border-[#e4e4e7] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-900/80 hover:bg-[#FCF2F3] dark:hover:bg-red-950/40 hover:border-[#F8D7DA] dark:hover:border-red-900/50 hover:text-[#B22234] dark:hover:text-red-400 text-xs font-medium text-[#18181b] dark:text-zinc-200 transition-all"
              >
                <InstagramIcon />
                <span className="hidden sm:inline">@uns_robotika</span>
              </a>

              <a
                href="https://linkedin.com/company/robotika-uns"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Robotika UNS"
                className="inline-flex items-center justify-center sm:justify-start gap-2.5 h-10 w-10 sm:h-auto sm:w-auto p-2.5 sm:px-3 sm:py-2 rounded-lg border border-[#e4e4e7] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-900/80 hover:bg-[#FCF2F3] dark:hover:bg-red-950/40 hover:border-[#F8D7DA] dark:hover:border-red-900/50 hover:text-[#B22234] dark:hover:text-red-400 text-xs font-medium text-[#18181b] dark:text-zinc-200 transition-all"
              >
                <LinkedinIcon />
                <span className="hidden sm:inline">Robotika UNS</span>
              </a>

              <a
                href="https://github.com/robotika-uns"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub robotika-uns"
                className="inline-flex items-center justify-center sm:justify-start gap-2.5 h-10 w-10 sm:h-auto sm:w-auto p-2.5 sm:px-3 sm:py-2 rounded-lg border border-[#e4e4e7] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-900/80 hover:bg-[#FCF2F3] dark:hover:bg-red-950/40 hover:border-[#F8D7DA] dark:hover:border-red-900/50 hover:text-[#B22234] dark:hover:text-red-400 text-xs font-medium text-[#18181b] dark:text-zinc-200 transition-all"
              >
                <GithubIcon />
                <span className="hidden sm:inline">robotika-uns</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#18181b] dark:text-zinc-100">
                  <MapPin className="w-3.5 h-3.5 text-[#B22234] shrink-0" />
                  <span>Gedung Graha UKM UNS</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#71717a] dark:text-zinc-400 mt-0.5">
                  Jl. Ir. Sutami No. 36A, Kentingan, Kec. Jebres, Surakarta, Jawa Tengah 57126
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Gedung+Graha+UKM+UNS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B22234] dark:text-red-400 hover:text-[#8B0000] dark:hover:text-red-300 transition-colors shrink-0 pt-0.5"
              >
                <span>Buka Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="w-full h-[180px] sm:h-[220px] rounded-xl overflow-hidden border border-[#e4e4e7] dark:border-zinc-800 bg-[#f4f4f5] dark:bg-zinc-900">
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

        <div className="mt-8 pt-5 border-t border-[#e4e4e7] dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#71717a] dark:text-zinc-400">
          <p>© 2026 Robotika Universitas Sebelas Maret</p>
          <a
            href="https://uns.ac.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-[#B22234] dark:hover:text-red-400 transition-colors"
          >
            <span>Portal UNS</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </Container>
    </footer>
  );

};
