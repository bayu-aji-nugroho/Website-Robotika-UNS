"use client";

/*
-----------------------------------------
nama file: [ global-error.tsx ]
fungsi [ Halaman cadangan terakhir bila layout utama gagal dirender. Harus memiliki <html> dan <body> sendiri dan tidak memuat CSS global, sehingga gaya ditulis inline ]
-----------------------------------------------
*/

import { useEffect } from "react";

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error("Terjadi error pada layout utama:", error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#F9F9F8",
          color: "#18181b",
          padding: "16px",
        }}
      >
        <title>Terjadi Kendala | Robotika UNS</title>
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>Terjadi Kendala</h1>
          <p style={{ fontSize: 14, color: "#52525b", lineHeight: 1.6, marginBottom: 20 }}>
            Website Robotika UNS gagal dimuat. Silakan coba lagi beberapa saat lagi.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              background: "#B22234",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 20px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              marginRight: 8,
            }}
          >
            Coba Lagi
          </button>
          {/* Navigasi penuh (bukan router Next) karena layout utama sedang gagal */}
          <button
            type="button"
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- router Next bisa ikut gagal di sini
            onClick={() => window.location.assign("/")}
            style={{
              background: "transparent",
              color: "#B22234",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Ke Beranda
          </button>
        </div>
      </body>
    </html>
  );
}
