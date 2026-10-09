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
    category: "Tim Robotika KRAI",
    type: "tim",
    badge: "KRAI & KRI",
    tagline: "Delegasi Robotika UNS untuk Kontes Robot ABU Indonesia",
    desc: "Rancang bangun robot kompetisi KRAI.",
    fullDesc:
      "Tim Werkudara adalah delegasi kompetisi robotika Universitas Sebelas Maret yang bertanding di Kontes Robot ABU Indonesia (KRAI) di bawah naungan Puspresnas Kemendikbudristek. Tim ini merancang robot otomatis dan manual kompleks yang dirancang khusus menyelesaikan misi tema tahunan ABU Robocon dengan kecepatan, akurasi, dan strategi tanding tingkat tinggi.",
    responsibilities: [
      "Perancangan arsitektur robot kompetisi sesuai regulasi resmi KRAI.",
      "Fabrikasi rangka mekanik presisi, ringan, dan kuat terhadap beban dinamis.",
      "Pemrograman algoritma navigasi otomatis, pelacakan rute, dan strategi arena.",
      "Uji coba lapangan (field test), gladi tanding intensif, dan kalibrasi sensor.",
      "Penyusunan logbook teknis dan laporan evaluasi kesiapan kompetisi.",
    ],
    skills: [
      "KRAI Tactics & Rule Engine",
      "Sistem Pneumatik Presisi",
      "High-Power Motor Driver",
      "Sensor Odometri & IMU",
      "CAD Fabrikasi Logam & Akrilik",
      "C++ / STM32 Firmware",
    ],
    projects: [
      "Robot Werkudara KRAI Nasional",
      "Mekanisme Pelontar dan Pengambil Bola Otomatis",
      "Sistem Navigasi Cepat Garis dan Titik Lapangan",
    ],
    tags: ["KRAI", "Robot Tanding", "Sistem Otonom & Manual", "Riset Mekanik"],
  },
  {
    id: "cakrawala",
    name: "Cakrawala",
    category: "Tim Riset Otonom",
    type: "tim",
    badge: "Riset & Otonom",
    tagline: "Eksplorasi Robot Otonom Cerdas Berbasis Visi Komputer dan AI",
    desc: "Riset sistem robot otonom dan AI.",
    fullDesc:
      "Tim Cakrawala berfokus pada eksplorasi inovasi robotika mutakhir, sistem visi komputer (computer vision), navigasi otonom tanpa kendali langsung manusia, serta penerapan kecerdasan buatan untuk riset terapan dan ajang inovasi teknologi nasional maupun internasional.",
    responsibilities: [
      "Riset algoritma persepsi visual dan deep learning untuk deteksi objek dinamis.",
      "Implementasi sistem pemetaan lingkungan mandiri (SLAM) dan penghindaran rintangan.",
      "Pengembangan robot inspeksi dan prototipe otonom modular.",
      "Partisipasi dalam kompetisi inovasi teknologi dan publikasi karya ilmiah terapan.",
    ],
    skills: [
      "Computer Vision (OpenCV)",
      "ROS / ROS 2 Ecosystem",
      "YOLO Object Detection",
      "LiDAR SLAM & Path Planning",
      "Embedded Linux (NVIDIA Jetson / Raspberry Pi)",
      "Python & Modern C++",
    ],
    projects: [
      "Wahana Mobile Robot Navigasi Indoor Mandiri",
      "Sistem Deteksi Objek Real-Time Berbasis Edge AI",
      "Prototipe Robot Patroli dan Inspeksi Ruang",
    ],
    tags: ["Computer Vision", "Autonomous Navigation", "AI & Robotics", "Inovasi Terapan"],
  },
];

export const techList: DivisionItem[] = [
  {
    id: "riset",
    name: "Riset",
    category: "Divisi Teknis",
    type: "teknis",
    badge: "Fondasi Inovasi",
    tagline: "Perumus Konsep Ilmiah, Arsitektur Teknologi, dan Strategi Riset",
    desc: "Eksplorasi konsep dan inovasi teknologi.",
    fullDesc:
      "Divisi Riset menjadi garda depan dalam penelusuran ide, analisis kelayakan teknologi, dan studi literatur ilmiah. Divisi ini mengkaji tren robotika terkini, menelaah aturan kompetisi, merumuskan arsitektur sistem, serta memastikan setiap inovasi robotika didasari perhitungan teoretis yang matang.",
    responsibilities: [
      "Kajian literatur berkala mengenai jurnal dan teknologi robotika terbaru.",
      "Analisis mendalam mengenai regulasi dan aturan perlombaan robotika nasional.",
      "Penyusunan dokumen desain konseptual sebelum proses perancangan dan perakitan.",
      "Dokumentasi laporan ilmiah dan persiapan paper riset kompetisi.",
    ],
    skills: [
      "Literature Review & Benchmarking",
      "System Architecture & Feasibility Analysis",
      "Metodologi Riset Eksperimental",
      "Penyusunan Paper Teknis",
      "Data Analysis",
    ],
    tags: ["Literature Review", "Analisis Sistem", "Inovasi Konsep"],
  },
  {
    id: "pemrograman",
    name: "Pemrograman",
    category: "Divisi Teknis",
    type: "teknis",
    badge: "Software & Kontrol",
    tagline: "Arsitek Kode Kendali, Algoritma Cerdas, dan Logika Otomasi Robot",
    desc: "Pengembangan algoritma dan kendali robot.",
    fullDesc:
      "Divisi Pemrograman bertanggung jawab penuh atas seluruh perangkat lunak yang menggerakkan robot. Dari penulisan firmware mikrokontroler tingkat rendah (low-level), algoritma kontrol PID, antarmuka komunikasi antar-perangkat, pengolahan citra komputer, hingga logika navigasi otomatis di arena.",
    responsibilities: [
      "Penulisan firmware kendali mikrokontroler (STM32, ESP32, ARM).",
      "Implementasi algoritma kontrol PID dan odometri untuk pergerakan presisi.",
      "Integrasi protokol komunikasi data berkecepatan tinggi (CAN Bus, UART, SPI, I2C).",
      "Pengembangan antarmuka GUI monitoring telemetri data robot secara nirkabel.",
    ],
    skills: [
      "C / C++ (Embedded Systems)",
      "Python untuk AI & Visi Komputer",
      "FreeRTOS & Multi-threading",
      "Control Algorithms (PID, Kinematics)",
      "ROS / ROS 2",
      "Git & Collaborative Coding",
    ],
    tags: ["C / C++", "Python", "ROS", "Control Algorithm"],
  },
  {
    id: "elektronika",
    name: "Elektronika",
    category: "Divisi Teknis",
    type: "teknis",
    badge: "Sirkuit & Daya",
    tagline: "Perancang Jalur Daya, Skematik Sirkuit, dan Integrasi Sensor Presisi",
    desc: "Perancangan sirkuit PCB dan kelistrikan.",
    fullDesc:
      "Divisi Elektronika merancang dan merealisasikan seluruh sistem kelistrikan robot. Mulai dari perancangan skematik dan layout papan sirkuit cetak (PCB) kustom, sistem manajemen daya baterai bertegangan tinggi, hingga pengkondisian sinyal berbagai sensor dan driver motor bertenaga tinggi.",
    responsibilities: [
      "Perancangan skematik dan layout custom PCB dengan standar industri.",
      "Proses perakitan, soldering komponen SMD/THT, dan debugging rangkaian.",
      "Manajemen distribusi daya aman menggunakan baterai LiPo/LiFePO4 serta konverter step-down.",
      "Kalibrasi sensor IMU, encoder magnetik, sensor lidar, dan modul aktuator.",
    ],
    skills: [
      "KiCAD / Altium Designer",
      "Soldering Presisi & SMD Assembly",
      "Sistem Proteksi Daya & BMS",
      "Oscilloscope, Logic Analyzer, Multimeter",
      "Power Electronics & Motor Drivers",
    ],
    tags: ["PCB Design", "Sensor & Actuator", "Power Management", "Microcontroller"],
  },
  {
    id: "mekanika",
    name: "Mekanika",
    category: "Divisi Teknis",
    type: "teknis",
    badge: "Rancang Bangun Fisik",
    tagline: "Master Desain 3D, Simulasi Struktur, dan Fabrikasi Presisi",
    desc: "Desain CAD dan manufaktur presisi.",
    fullDesc:
      "Divisi Mekanika mewujudkan struktur fisik robot secara kokoh, presisi, dan proporsional. Mulai dari pemodelan CAD 3D, simulasi kekuatan material, pemilihan material ringan seperti aluminium dan akrilik, manufaktur CNC/laser-cutting, hingga perakitan sistem transmisi mekanis roda omni/mecanum dan penjepit (gripper).",
    responsibilities: [
      "Pemodelan CAD 3D lengkap untuk chassis, mekanisme gerak, dan dudukan komponen.",
      "Simulasi kekuatan struktur material dan kalkulasi pusat gravitasi (Center of Mass).",
      "Manufaktur komponen menggunakan laser cutting, 3D printing, milling, dan bubut.",
      "Perakitan dan perawatan berkala komponen transmisi mekanik dan aktuator mekanis.",
    ],
    skills: [
      "SolidWorks / Autodesk Fusion 360",
      "3D Printing FDM & Slicing Optimization",
      "CNC Machining & Laser Cutting Fabrication",
      "Analisis Beban Struktur (FEA)",
      "Kinematika Robot Omni & Mecanum Wheel",
    ],
    tags: ["CAD 3D", "Kinematika", "Fabrikasi & CNC", "3D Printing"],
  },
];

export const nonTechList: DivisionItem[] = [
  {
    id: "administrasi",
    name: "Administrasi",
    category: "Divisi Nonteknis",
    type: "non-teknis",
    badge: "Tata Kelola",
    tagline: "Pilar Tata Kelola Surat-Menyurat, Legalitas, dan Pengarsipan Resmi",
    desc: "Pengelolaan dokumen dan administrasi organisasi.",
    fullDesc:
      "Divisi Administrasi memastikan seluruh operasional birokrasi organisasi berjalan tertib, legal, dan terdokumentasi dengan baik. Divisi ini mengelola korespondensi resmi dengan rektorat, dekanat, mitra eksternal, izin laboratorium, serta arsip inventaris organisasi.",
    responsibilities: [
      "Penyusunan surat-menyurat resmi dinas dan permohonan izin kompetisi.",
      "Pengelolaan administrasi laboratorium dan peminjaman fasilitas kampus.",
      "Pengarsipan terstruktur database anggota, sertifikat, dan piagam prestasi.",
      "Notulensi rapat evaluasi serta penyusunan jadwal timeline kegiatan berkala.",
    ],
    skills: [
      "Administrasi Organisasi Kemahasiswaan",
      "Tata Naskah Surat Dinas",
      "Google Workspace & Cloud Storage Management",
      "Time Management & Scheduling",
    ],
    tags: ["Surat & Dokumen", "Arsip Legal", "Sekretariat"],
  },
  {
    id: "bendahara",
    name: "Bendahara",
    category: "Divisi Nonteknis",
    type: "non-teknis",
    badge: "Akuntabilitas Finansial",
    tagline: "Manajemen Anggaran Riset, Transparansi Kas, dan Pelaporan Keuangan",
    desc: "Pengelolaan anggaran dan keuangan organisasi.",
    fullDesc:
      "Divisi Bendahara mengemban amanah pengelolaan keuangan organisasi dengan prinsip transparansi, disiplin, dan akuntabel. Meliputi perencanaan anggaran riset dan perlombaan, pencatatan kas, pengelolaan uang kas anggota, hingga penyusunan Laporan Pertanggungjawaban (LPJ) keuangan.",
    responsibilities: [
      "Perencanaan Rencana Anggaran Biaya (RAB) kegiatan riset dan perlombaan tahunan.",
      "Pencatatan mutasi kas masuk dan kas keluar secara sistematis dan real-time.",
      "Pemeriksaan dan pengarsipan bukti transaksi, invoice, serta nota belanja komponen.",
      "Penyusunan Laporan Pertanggungjawaban (LPJ) keuangan untuk pihak universitas dan sponsor.",
    ],
    skills: [
      "Financial Planning & Budgeting",
      "Pembukuan Kas Organisasi",
      "Audit Nota & Dokumen Transaksi",
      "Penyusunan LPJ Finansial",
      "Spreadsheet & Akuntansi Sederhana",
    ],
    tags: ["Budgeting", "Pembukuan", "LPJ", "Finansial"],
  },
  {
    id: "pengembangan-organisasi",
    name: "Pengembangan Organisasi",
    category: "Divisi Nonteknis",
    type: "non-teknis",
    badge: "Sumber Daya Manusia",
    tagline: "Pengembang Kapasitas Anggota, Kaderisasi, dan Budaya Tim",
    desc: "Pengembangan kapasitas dan kaderisasi anggota.",
    fullDesc:
      "Divisi Pengembangan Organisasi fokus pada pengembangan modal manusia (human capital) dan keberlanjutan regenerasi kepengurusan Robotika UNS. Bertanggung jawab atas rekrutmen anggota baru, onboarding, workshop keterampilan dasar, evaluasi iklim kerja tim, dan kegiatan keakraban.",
    responsibilities: [
      "Pelaksanaan program Open Recruitment dan kurikulum orientasi anggota baru.",
      "Penyelenggaraan pelatihan internal soft skills, kepemimpinan, dan manajemen proyek.",
      "Evaluasi berkala iklim tim, motivasi, dan beban kerja seluruh anggota divisi.",
      "Inisiasi kegiatan bonding dan temu kangen guna mempererat solidaritas organisasi.",
    ],
    skills: [
      "Kaderisasi & Onboarding",
      "Desain Kurikulum Pelatihan Internal",
      "People & Talent Management",
      "Fasilitasi FGD dan Mediasi Tim",
    ],
    tags: ["Kaderisasi", "Internal Training", "Team Building"],
  },
  {
    id: "media-branding",
    name: "Media Branding",
    category: "Divisi Nonteknis",
    type: "non-teknis",
    badge: "Kreatif & Visual",
    tagline: "Pencipta Narasi Visual, Dokumentasi Prestasi, dan Citra Publik",
    desc: "Dokumentasi visual dan publikasi media.",
    fullDesc:
      "Divisi Media Branding menjadi corong visual yang merepresentasikan reputasi dan prestasi Robotika UNS ke khalayak luas. Mengelola identitas visual, produksi konten media sosial, video dokumenter riset, aftermovie perlombaan, hingga desain merchandise resmi organisasi.",
    responsibilities: [
      "Desain grafis untuk feed media sosial, poster kompetisi, dan banner publikasi.",
      "Dokumentasi foto dan video profesional pada setiap kegiatan lab dan perlombaan.",
      "Produksi konten video reels, aftermovie, dan liputan teknologi robotika.",
      "Menjaga konsistensi identitas visual dan pedoman brand guidelines organisasi.",
    ],
    skills: [
      "Adobe Illustrator, Photoshop, & Figma",
      "Video Editing (Adobe Premiere Pro / DaVinci Resolve)",
      "Fotografi & Videografi Acara",
      "Social Media Management & Storytelling",
      "Copywriting Kreatif",
    ],
    tags: ["Desain Grafis", "Videografi", "Social Media", "Branding"],
  },
  {
    id: "humas",
    name: "Humas",
    category: "Divisi Nonteknis",
    type: "non-teknis",
    badge: "Jejaring Eksternal",
    tagline: "Penjembatan Sinergi dengan Industri, Sponsor, Alumni, dan Publik",
    desc: "Komunikasi eksternal dan relasi kemitraan.",
    fullDesc:
      "Divisi Hubungan Masyarakat (Humas) memperluas jejaring dan dampak Robotika UNS di luar kampus. Divisi ini menjalin komunikasi intensif dengan alumni, komunitas teknologi se-Indonesia, perguruan tinggi lain, serta membuka peluang sponsorship dan kerja sama industri.",
    responsibilities: [
      "Penyusunan proposal sponsorship dan penawaran kemitraan ke perusahaan industri.",
      "Membangun hubungan kolaboratif dengan komunitas robotika dan universitas lain.",
      "Pengelolaan pintu komunikasi resmi melalui email, direct message, dan saluran mitra.",
      "Mengorganisir agenda silaturahmi dengan ikatan alumni Robotika UNS.",
    ],
    skills: [
      "Public Relations & Media Communications",
      "Sponsorship Pitching & Negosiasi",
      "Networking & Relationship Building",
      "Komunikasi Bisnis & Presentasi",
    ],
    tags: ["Kemitraan", "Sponsorship", "Relasi Publik", "Kolaborasi"],
  },
];

export const allDivisions: DivisionItem[] = [...teamList, ...techList, ...nonTechList];

export function getDivisionById(id: string): DivisionItem | undefined {
  return allDivisions.find((item) => item.id.toLowerCase() === id.toLowerCase());
}
