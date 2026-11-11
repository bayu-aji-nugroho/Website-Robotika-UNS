export interface DivisionOption {
  id: string;
  name: string;
  category: "teknis" | "non-teknis";
}

export const technicalDivisions: DivisionOption[] = [
  {
    id: "werkudara-pemrograman",
    name: "Werkudara - Pemrograman",
    category: "teknis",
  },
  {
    id: "werkudara-elektronika",
    name: "Werkudara - Elektronika",
    category: "teknis",
  },
  {
    id: "werkudara-mekanika",
    name: "Werkudara - Mekanika",
    category: "teknis",
  },
  {
    id: "cakrawala-pemrograman",
    name: "Cakrawala - Pemrograman",
    category: "teknis",
  },
  {
    id: "cakrawala-elektronika",
    name: "Cakrawala - Elektronika",
    category: "teknis",
  },
  {
    id: "cakrawala-mekanika",
    name: "Cakrawala - Mekanika",
    category: "teknis",
  },
];

export const nonTechnicalDivisions: DivisionOption[] = [
  {
    id: "administrasi",
    name: "Administrasi",
    category: "non-teknis",
  },
  {
    id: "bendahara",
    name: "Keuangan",
    category: "non-teknis",
  },
  {
    id: "pengembangan-organisasi",
    name: "Pengembangan Organisasi",
    category: "non-teknis",
  },
  {
    id: "media-branding",
    name: "Media Visual",
    category: "non-teknis",
  },
  {
    id: "humas",
    name: "Hubeks (Hubungan Eksternal)",
    category: "non-teknis",
  },
];

export const allRegistrationDivisions: DivisionOption[] = [
  ...technicalDivisions,
  ...nonTechnicalDivisions,
];

export interface RegistrationRequirementItem {
  title: string;
  desc?: string;
}

export interface SelectionStageItem {
  step: string;
  title: string;
}

export interface RegistrationStepItem {
  id: number;
  title: string;
  shortTitle: string;
}

export interface RegistrationRequirementsContent {
  header: {
    stepBadge: string;
    stepText: string;
    title: string;
    description?: string;
  };
  stagesSection: {
    title: string;
  };
  agreement: {
    id: string;
    label: string;
  };
  navigation: {
    back: {
      href: string;
      label: string;
      subLabel: string;
    };
    next: {
      label: string;
      subLabel: string;
    };
  };
}

export const registrationRequirements: RegistrationRequirementItem[] = [
  {
    title: "Bertaqwa kepada Tuhan Yang Maha Esa.",
  },
  {
    title: "Mahasiswa/i aktif UNS angkatan 2025/2026.",
  },
  {
    title: "Berkomitmen, bertanggung jawab, berintegritas dan berkomunikasi dengan baik kepada anggota lainnya.",
  },
  {
    title: "Memiliki semangat dan kemauan belajar yang tinggi.",
  },
  {
    title: "Mau bekerja sama dalam tim, tanpa ego sektoral.",
  },
  {
    title: "Bersedia mengikuti pelatihan, piket riset, dan agenda kepengurusan.",
  },
];

export const selectionStages: SelectionStageItem[] = [
  { step: "1", title: "Pendaftaran" },
  { step: "2", title: "Verifikasi Berkas" },
  { step: "3", title: "Wawancara" },
  { step: "4", title: "Pengumuman" },
];

export const registrationSteps: RegistrationStepItem[] = [
  {
    id: 1,
    title: "Syarat Masuk",
    shortTitle: "Syarat",
  },
  {
    id: 2,
    title: "Autentikasi Akun Google",
    shortTitle: "Akun Google",
  },
  {
    id: 3,
    title: "Identitas Mahasiswa",
    shortTitle: "Identitas",
  },
  {
    id: 4,
    title: "Pilihan Divisi",
    shortTitle: "Divisi",
  },
  {
    id: 5,
    title: "Upload Berkas",
    shortTitle: "Upload Berkas",
  },
  {
    id: 6,
    title: "Selesai",
    shortTitle: "Selesai",
  },
];

export const registrationRequirementsData: RegistrationRequirementsContent = {
  header: {
    stepBadge: "1",
    stepText: "Langkah 1 dari 6",
    title: "Syarat Masuk dan Ketentuan Pendaftaran",
  },
  stagesSection: {
    title: "Tahapan Seleksi",
  },
  agreement: {
    id: "reg-requirements-agreement",
    label:
      "Saya memenuhi seluruh syarat di atas dan bersedia mengikuti seluruh tahapan seleksi calon anggota Robotika UNS.",
  },
  navigation: {
    back: {
      href: "/",
      label: "Kembali",
      subLabel: " ke Beranda",
    },
    next: {
      label: "Lanjut",
      subLabel: " ke Akun Google",
    },
  },
};

export interface AdminWaConfig {
  number: string;
  displayNumber: string;
  defaultMessage: string;
  getUrl: (customMessage?: string) => string;
}

/** Link undangan grup WhatsApp calon anggota (dipakai di halaman sukses & Dashboard Akun) */
export const CANDIDATE_WA_GROUP_URL =
  process.env.NEXT_PUBLIC_CANDIDATE_WA_GROUP_URL || "https://chat.whatsapp.com/IrhwomqdfALFGEz15JdmAq";

export const ADMIN_WA_CONFIG: AdminWaConfig = {
  // Format nomor WhatsApp internasional resmi (diawali 62 tanpa tanda + atau spasi)
  number: process.env.NEXT_PUBLIC_ADMIN_WA_NUMBER || "628818525045",
  displayNumber: process.env.NEXT_PUBLIC_ADMIN_WA_DISPLAY || "+62 881-8525-045",
  defaultMessage:
    "Halo kak Nia, aku mau tanya",
  getUrl(customMessage?: string) {
    const rawNum = (this.number || "628818525045").replace(/[^0-9]/g, "");
    const msg = customMessage !== undefined ? customMessage : this.defaultMessage;
    return msg ? `https://wa.me/${rawNum}?text=${encodeURIComponent(msg)}` : `https://wa.me/${rawNum}`;
  },
};
