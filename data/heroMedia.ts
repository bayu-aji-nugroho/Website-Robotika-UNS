/*
-----------------------------------------
nama file: [ heroMedia.ts ]
fungsi [ Daftar gambar yang tampil pada hero beranda. Ganti berkas di public/hero atau ubah path di sini untuk mengganti foto tanpa menyentuh komponen. ]
-----------------------------------------------
*/

export const HERO_MEDIA = {
  // Foto gedung bebas warna; warna merah diberikan otomatis oleh komponen
  building: { src: "/hero/building.webp", alt: "Gedung Universitas Sebelas Maret" },
  // Wajib berlatar transparan agar menyatu dengan panggung
  robot: { src: "/hero/robot.webp", alt: "Robot hexapod Robotika UNS" },
  polaroid: { src: "/Photos/Display.webp", alt: "Anggota Tim Robotika UNS berfoto di depan stan Robotika", caption: "Robotika UNS" },
};
