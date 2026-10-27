export interface DivisionItem {
  id: string;
  name: string;
  category: string;
  type: "tim" | "teknis" | "non-teknis";
  badge?: string;
  tagline: string;
  desc: string;
  fullDesc: string;
  responsibilities: string[];
  skills: string[];
  projects?: string[];
  tags: string[];
}

export const teamList: DivisionItem[] = [
  {
    id: "werkudara",
    name: "Tim Werkudara",
    category: "Tim Robotika",
    type: "tim",
    badge: "Kontes Robot Indonesia (KRI) & ABU Robocon",
    tagline: "Riset dan Manufaktur Robot Otomasi Kompleks untuk Kontes Robot Indonesia dan ABU Robocon",
    desc: "Fokus pada riset dan manufaktur robot berskala sedang hingga besar dengan mekanisme dan otomasi kompleks untuk KRI dan ABU Robocon.",
    fullDesc:
      "Tim Werkudara berfokus pada riset dan manufaktur robot berskala sedang hingga besar dengan mekanisme serta sistem otomasi kompleks. Tim ini mempersiapkan robot untuk ajang Kontes Robot Indonesia (KRI) dan ABU Robocon melalui perancangan kerangka mekanik presisi, tata kelola daya dan sirkuit listrik, serta integrasi logika kontrol navigasi otomatis.",
    responsibilities: [
      "Merancang kerangka robot (chassis), sistem transmisi, dan simulasi gerak pada perangkat lunak CAD.",
      "Mengeksekusi manufaktur material dan 3D printing untuk pembuatan komponen fisik robot.",
      "Mendesain tata letak skema PCB, sistem pengkabelan (wiring), dan manajemen distribusi daya.",
      "Mengintegrasikan pembacaan sensor dengan sistem penggerak motor robot.",
      "Mengembangkan logika kontrol robot, pemrograman sistem embedded, dan algoritma navigasi otomatis.",
    ],
    skills: [
      "Perancangan Chassis & CAD",
      "Manufaktur & 3D Printing",
      "Desain Skema & Tata Letak PCB",
      "Wiring & Manajemen Daya",
      "Pemrograman Embedded",
      "Algoritma Navigasi Otomatis",
    ],
    projects: [
      "Robot Otomasi ABU Robocon & KRI",
      "Sistem Transmisi dan Kerangka Beban Dinamis",
      "Sistem Navigasi Otomatis & Kontrol Sensorik",
    ],
    tags: ["KRI", "ABU Robocon", "Robot Skala Sedang-Besar", "Sistem Otomasi"],
  },
  {
    id: "cakrawala",
    name: "Tim Cakrawala",
    category: "Tim Robotika",
    type: "tim",
    badge: "Line Follower, Robot Sumo & Kontes Mikrokontroler",
    tagline: "Riset Kecepatan, Presisi Manuver, dan Ketangguhan Robot Berbasis Mikrokontroler",
    desc: "Fokus pada optimasi kecepatan, presisi manuver, dan ketangguhan robot Line Follower, Sumo, serta lomba mikrokontroler.",
    fullDesc:
      "Tim Cakrawala berfokus pada riset kecepatan, kelincahan manuver, dan ketangguhan fisik robot. Tim ini mengembangkan robot untuk perlombaan Line Follower, Robot Sumo, dan kompetisi berbasis mikrokontroler dengan penekanan pada struktur aerodinamis ringan, sirkuit kelistrikan tahan guncangan, respons sensor berlatensi rendah, dan penyesuaian taktik langsung di arena lomba.",
    responsibilities: [
      "Merancang model 3D struktur robot yang ringan, aerodinamis, dan presisi sesuai regulasi lomba.",
      "Menghitung rasio bobot dan kekuatan material serta merakit keseluruhan mekanika penggerak.",
      "Mendesain skematik kelistrikan presisi tinggi untuk mikrokontroler dan driver motor arus tinggi.",
      "Memproduksi PCB, menyolder komponen, dan menata jalur kabel agar tahan guncangan atau benturan keras di arena.",
      "Mengembangkan algoritma kontrol presisi dan pemrosesan data array sensor dengan latensi rendah.",
      "Memprogram logika manuver, taktik tanding, membaca data telemetri real-time, dan mengkalibrasi parameter kode di lokasi lomba.",
      "Mendokumentasikan dan memelihara versi source code secara teratur untuk pengembangan kolaboratif.",
    ],
    skills: [
      "Model 3D Aerodinamis & CAD",
      "Produksi PCB & Solder Presisi",
      "Array Sensor Kecepatan Tinggi",
      "Driver Motor Arus Tinggi",
      "Algoritma Kontrol Cepat & Telemetri",
      "Version Control (Git)",
    ],
    projects: [
      "Robot Line Follower Kecepatan Tinggi",
      "Robot Sumo Tangguh Tahan Benturan",
      "Sistem Telemetri & Kalibrasi Arena",
    ],
    tags: ["Line Follower", "Robot Sumo", "Mikrokontroler", "Manuver Presisi"],
  },
];

export const techList: DivisionItem[] = [
  {
    id: "riset",
    name: "Riset",
    category: "Divisi Teknis",
    type: "teknis",
    badge: "Kajian Regulasi & Analisis Sistem",
    tagline: "Kajian Regulasi Lomba, Analisis Kebutuhan Sistem, dan Perumusan Konsep Rancang Bangun Robot",
    desc: "Mempelajari regulasi kompetisi, menganalisis kebutuhan teknis sistem, dan merumuskan konsep rancang bangun sebelum tahap produksi.",
    fullDesc:
      "Divisi Riset mengkaji regulasi perlombaan robotika, menganalisis kelayakan teknis sistem, dan merumuskan spesifikasi awal rancang bangun robot. Divisi ini menyelaraskan aturan kompetisi dengan kebutuhan perancangan mekanik, elektronika, dan pemrograman agar arah pengembangan robot terencana dan sesuai target pertandingan.",
    responsibilities: [
      "Mempelajari dan menganalisis buku aturan (rulebook) resmi kompetisi robotika.",
      "Menilai kebutuhan sistem dan kelayakan komponen sebelum tahap produksi dan fabrikasi.",
      "Merumuskan parameter teknis rancang bangun bersama divisi mekanika, elektronika, dan pemrograman.",
      "Menyusun dokumentasi teknis dan laporan evaluasi kesiapan robot.",
    ],
    skills: [
      "Analisis Regulasi Kompetisi",
      "Kajian Kelayakan Teknis",
      "Perumusan Spesifikasi Sistem",
      "Dokumentasi & Logbook Teknis",
    ],
    tags: ["Regulasi Lomba", "Analisis Sistem", "Spesifikasi Teknis"],
  },
  {
    id: "pemrograman",
    name: "Pemrograman",
    category: "Divisi Teknis",
    type: "teknis",
    badge: "Software, Kontrol & Embedded",
    tagline: "Pengembangan Logika Kendali, Pemrograman Sistem Embedded, dan Algoritma Gerak Robot",
    desc: "Mengembangkan logika kendali, pemrograman sistem embedded, algoritma navigasi, dan pengolahan data sensor berlatensi rendah.",
    fullDesc:
      "Divisi Pemrograman bertanggung jawab atas perangkat lunak pengendali robot. Pekerjaannya mencakup penulisan kode pada sistem embedded, perumusan algoritma kendali dan navigasi otomatis, pemrosesan sinyal sensor berlatensi rendah, pemantauan telemetri real-time, serta penyesuaian taktik dan variabel kode saat pengujian di arena perlombaan.",
    responsibilities: [
      "Mengembangkan logika kendali robot dan memprogram mikrokontroler (sistem embedded).",
      "Menerapkan algoritma navigasi otomatis dan kontrol manuver gerak presisi.",
      "Memproses data pembacaan sensor berkecepatan tinggi dengan latensi rendah.",
      "Menjalankan uji coba lintasan, memantau telemetri real-time, dan mengkalibrasi parameter kode di lokasi lomba.",
      "Mendokumentasikan dan memelihara riwayat versi source code untuk kerja kolaboratif tim.",
    ],
    skills: [
      "Pemrograman Sistem Embedded",
      "Algoritma Kontrol & Navigasi",
      "Pemrosesan Data Sensor",
      "Pembacaan Telemetri Real-Time",
      "Version Control (Git)",
    ],
    tags: ["Embedded", "Logika Kontrol", "Algoritma Navigasi", "Telemetri"],
  },
  {
    id: "elektronika",
    name: "Elektronika",
    category: "Divisi Teknis",
    type: "teknis",
    badge: "Sirkuit, PCB & Manajemen Daya",
    tagline: "Perancangan Skematik, Produksi PCB, Penataan Perkabelan, dan Distribusi Daya Listrik",
    desc: "Mendesain skematik sirkuit, memproduksi dan menyolder PCB, menata perkabelan tahan guncangan, serta mengelola suplai daya.",
    fullDesc:
      "Divisi Elektronika merancang dan merealisasikan seluruh sistem kelistrikan robot. Tugasnya meliputi perancangan skematik rangkaian presisi tinggi, pembuatan tata letak dan produksi PCB, penyolderan komponen mikrokontroler, integrasi driver motor arus tinggi dan sensor, penataan perkabelan yang kokoh dan tahan benturan, serta pengelolaan suplai daya baterai.",
    responsibilities: [
      "Mendesain skematik rangkaian kelistrikan dan tata letak (layout) PCB presisi tinggi.",
      "Memproduksi PCB dan menyolder komponen elektronik mikrokontroler secara rapi.",
      "Mengintegrasikan array sensor berkecepatan tinggi dengan driver motor arus tinggi.",
      "Menata dan mengamankan jalur pengkabelan (wiring) agar ringkas, kuat, dan tahan benturan arena.",
      "Mengatur sistem manajemen distribusi daya dan proteksi kelistrikan robot.",
    ],
    skills: [
      "Desain Skematik & Layout PCB",
      "Penyolderan Komponen Elektronik",
      "Driver Motor Arus Tinggi",
      "Integrasi Mikrokontroler & Sensor",
      "Sistem Perkabelan & Proteksi Daya",
    ],
    tags: ["Skema PCB", "Driver Motor", "Wiring", "Manajemen Daya"],
  },
  {
    id: "mekanika",
    name: "Mekanika",
    category: "Divisi Teknis",
    type: "teknis",
    badge: "Struktur 3D, CAD & Manufaktur",
    tagline: "Pemodelan CAD 3D, Kalkulasi Kekuatan Material, Manufaktur Komponen, dan Perakitan Robot",
    desc: "Merancang model 3D CAD, menghitung rasio kekuatan material, memproduksi komponen melalui fabrikasi dan 3D printing, serta merakit rangka mekanik.",
    fullDesc:
      "Divisi Mekanika bertanggung jawab atas struktur fisik dan sistem gerak robot. Pekerjaan dimulai dari pemodelan struktur 3D pada perangkat lunak CAD, simulasi dinamika mekanik, perhitungan rasio bobot dan ketahanan material, proses manufaktur bahan dan cetak 3D, hingga perakitan kerangka (chassis) dan sistem transmisi mekanika penggerak.",
    responsibilities: [
      "Merancang model 3D struktur kerangka (chassis) dan mekanisme gerak sesuai regulasi lomba.",
      "Menghitung rasio bobot dan kekuatan material agar robot ringan, kokoh, dan stabil.",
      "Menjalankan simulasi CAD untuk menguji kesiapan struktur dan dinamika gerak komponen.",
      "Memproduksi bagian mekanik melalui proses manufaktur material dan 3D printing.",
      "Merakit dan merawat seluruh sistem transmisi mekanik serta aktuator penggerak robot.",
    ],
    skills: [
      "CAD 3D & Pemodelan Struktur",
      "Simulasi Dinamika Gerak",
      "Fabrikasi Material & 3D Printing",
      "Kalkulasi Bobot & Kekuatan Material",
      "Perakitan Kerangka (Chassis) & Transmisi",
    ],
    tags: ["CAD 3D", "Chassis", "3D Printing", "Sistem Transmisi"],
  },
];

export const nonTechList: DivisionItem[] = [
  {
    id: "administrasi",
    name: "Administrasi",
    category: "Divisi Nonteknis",
    type: "non-teknis",
    badge: "Tata Usaha & Kesekretariatan",
    tagline: "Tata Usaha Surat-Menyurat Resmi, Pengarsipan Basis Data, dan Standar Prosedur Kesekretariatan",
    desc: "Mengelola surat-menyurat resmi, pengarsipan basis data organisasi, notulensi rapat, dan kepatuhan SOP kesekretariatan.",
    fullDesc:
      "Divisi Administrasi mengelola tata usaha dan dokumentasi resmi organisasi. Divisi ini bertanggung jawab atas alur surat-menyurat dinas, legalitas dan perizinan kegiatan, pengarsipan basis data terpadu, penyusunan notulensi setiap rapat, serta penerapan Standar Operasional Prosedur (SOP) kesekretariatan agar seluruh pergerakan manajerial tercatat rapi dan akuntabel.",
    responsibilities: [
      "Mengelola alur lalu lintas surat-menyurat resmi dinas dan permohonan izin kegiatan.",
      "Mengarsipkan basis data terintegrasi dan dokumen legalitas organisasi secara rapi.",
      "Mendokumentasikan notulensi rapat pengurus secara lengkap.",
      "Mengawal penerapan Standar Operasional Prosedur (SOP) kesekretariatan di seluruh agenda organisasi.",
    ],
    skills: [
      "Pengolahan Dokumen (Google Workspace / MS Office)",
      "Penyusunan Surat Dinas & Legalitas",
      "Pengarsipan Basis Data Terintegrasi",
      "Pemahaman Komunikasi Birokrasi",
    ],
    tags: ["Surat Resmi", "Pengarsipan", "Notulensi", "SOP Kesekretariatan"],
  },
  {
    id: "bendahara",
    name: "Bendahara",
    category: "Divisi Nonteknis",
    type: "non-teknis",
    badge: "Keuangan & Akuntabilitas Kas",
    tagline: "Pengelolaan Arus Kas, Perencanaan Anggaran Riset, dan Laporan Pertanggungjawaban Finansial",
    desc: "Mengelola arus kas masuk dan keluar, menyusun Rencana Anggaran Belanja (RAB), dan menyusun Laporan Pertanggungjawaban (LPJ) keuangan.",
    fullDesc:
      "Divisi Bendahara mengelola stabilitas finansial dan aset material organisasi. Divisi ini bertanggung jawab mencatat arus kas masuk dan keluar secara teliti, menyusun Rencana Anggaran Belanja (RAB) untuk kegiatan dan riset robotika, mengawasi kelayakan alokasi pengeluaran dana, mengarsipkan bukti transaksi, serta menyusun Laporan Pertanggungjawaban (LPJ) keuangan secara transparan dan akuntabel.",
    responsibilities: [
      "Mencatat arus kas masuk dan keluar secara teratur dan teliti.",
      "Menyusun Rencana Anggaran Belanja (RAB) untuk operasional kegiatan dan kebutuhan riset.",
      "Mengawasi kelayakan alokasi anggaran di seluruh program kerja organisasi.",
      "Mengarsipkan bukti transaksi, kuitansi, dan nota belanja organisasi.",
      "Menyusun Laporan Pertanggungjawaban (LPJ) keuangan secara transparan dan akuntabel.",
    ],
    skills: [
      "Pencatatan Keuangan (MS Excel / Google Sheets)",
      "Penyusunan Rencana Anggaran Belanja (RAB)",
      "Analisis Kelayakan Anggaran",
      "Penyusunan LPJ Finansial",
      "Pengarsipan Bukti Transaksi",
    ],
    tags: ["Arus Kas", "RAB Kegiatan", "LPJ Finansial", "Pembukuan"],
  },
  {
    id: "pengembangan-organisasi",
    name: "Pengembangan Organisasi",
    category: "Divisi Nonteknis",
    type: "non-teknis",
    badge: "Kaderisasi & Pengembangan SDM",
    tagline: "Kurikulum Pembinaan Anggota, Evaluasi Kinerja Pengurus, dan Penguatan Soliditas Tim",
    desc: "Menyusun kurikulum pelatihan staf, program peningkatan kemampuan (upgrading), kegiatan keakraban (bonding), dan evaluasi performa berbasis KPI.",
    fullDesc:
      "Divisi Pengembangan Organisasi bertugas mengelola pembinaan sumber daya manusia dan menjaga regenerasi organisasi. Divisi ini merancang kurikulum pembinaan untuk pengurus dan staf, menyelenggarakan program peningkatan kemampuan (upgrading) serta kegiatan keakraban (bonding), memantau performa pengurus secara berkala berbasis indikator kinerja (KPI), dan memfasilitasi penyelesaian dinamika kerja internal tim.",
    responsibilities: [
      "Merancang kurikulum pembinaan dan materi pelatihan terstruktur bagi pengurus serta staf.",
      "Menyelenggarakan program peningkatan kapasitas (upgrading) dan agenda keakraban (bonding).",
      "Memantau dan mengevaluasi kinerja berkala pengurus melalui indikator KPI.",
      "Menganalisis suasana kerja internal dan membantu memfasilitasi solusi saat tim menghadapi kendala.",
    ],
    skills: [
      "Perancangan Kurikulum Pelatihan",
      "Evaluasi Kinerja Pengurus (KPI)",
      "Fasilitasi Pertemuan & Mediasi Internal",
      "Pengembangan Kapasitas SDM",
    ],
    tags: ["Kaderisasi", "Pelatihan SDM", "Evaluasi KPI", "Bonding Tim"],
  },
  {
    id: "humas",
    name: "Humas",
    category: "Divisi Nonteknis",
    type: "non-teknis",
    badge: "Relasi Eksternal & Sponsorship",
    tagline: "Komunikasi Eksternal, Penjajakan Kemitraan Sponsorship, dan Kolaborasi Antar-Kampus",
    desc: "Mengelola komunikasi dengan pihak eksternal, menjajaki kemitraan sponsorship dan media partner, serta mengoordinasikan studi banding.",
    fullDesc:
      "Divisi Hubungan Masyarakat (Humas) bertugas mengelola komunikasi publik dan membangun jejaring kerja sama kelembagaan. Divisi ini menjalin relasi dengan instansi pemerintah, perguruan tinggi lain, dan mitra industri, menjalankan lobi sponsorship untuk pendanaan maupun kebutuhan material riset, serta mengoordinasikan agenda studi banding dengan laboratorium robotika universitas lain.",
    responsibilities: [
      "Menyusun strategi komunikasi publik serta mengelola hubungan dengan pihak eksternal (instansi, kampus lain, industri).",
      "Menjalankan lobi kemitraan sponsorship untuk dukungan pendanaan dan material riset.",
      "Menjalin kerja sama publikasi dengan mitra media (media partner).",
      "Mengoordinasikan agenda studi banding bersama laboratorium robotika universitas lain.",
    ],
    skills: [
      "Negosiasi & Diplomasi Sponsorship",
      "Komunikasi Publik & Presentasi Kemitraan",
      "Pengelolaan Relasi Eksternal",
      "Penyusunan Proposal Kerja Sama",
    ],
    tags: ["Sponsorship", "Relasi Eksternal", "Media Partner", "Studi Banding"],
  },
  {
    id: "media-branding",
    name: "Media Branding",
    category: "Divisi Nonteknis",
    type: "non-teknis",
    badge: "Identitas Visual & Konten Digital",
    tagline: "Pedoman Visual, Desain Grafis, Dokumentasi Foto dan Video, serta Publikasi Media Digital",
    desc: "Merumuskan brand guidelines, mendesain materi publikasi visual, memproduksi foto dan video kegiatan, serta mengelola media sosial organisasi.",
    fullDesc:
      "Divisi Media Branding bertanggung jawab atas identitas visual dan publikasi media organisasi. Divisi ini merumuskan pedoman visual (brand guidelines), memproduksi materi desain grafis dan video untuk dokumentasi riset serta kegiatan, dan mengelola saluran media publikasi digital agar informasi tersaji secara teratur, jelas, dan konsisten.",
    responsibilities: [
      "Merumuskan panduan visual (brand guidelines) dan merancang desain konten media sosial.",
      "Memproduksi foto serta video untuk dokumentasi riset laboratorium dan agenda kegiatan.",
      "Mengemas materi visual program kerja dalam bentuk grafis dan video yang informatif.",
      "Mengelola saluran media publikasi digital organisasi untuk mempublikasikan capaian karya dan riset.",
    ],
    skills: [
      "Desain Grafis (Illustrator / Photoshop / Figma / Canva)",
      "Editing Video (Premiere / CapCut)",
      "Fotografi & Videografi Liputan Kegiatan",
      "Penerapan Brand Guidelines",
    ],
    tags: ["Brand Guidelines", "Desain Grafis", "Videografi", "Media Sosial"],
  },
];

export const allDivisions: DivisionItem[] = [...teamList, ...techList, ...nonTechList];

export function getDivisionById(id: string): DivisionItem | undefined {
  return allDivisions.find((item) => item.id.toLowerCase() === id.toLowerCase());
}
