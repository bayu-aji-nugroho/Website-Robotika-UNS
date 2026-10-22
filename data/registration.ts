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
    name: "Bendahara",
    category: "non-teknis",
  },
  {
    id: "pengembangan-organisasi",
    name: "Pengembangan Organisasi",
    category: "non-teknis",
  },
  {
    id: "media-branding",
    name: "Media Branding",
    category: "non-teknis",
  },
  {
    id: "humas",
    name: "Humas (Hubungan Masyarakat)",
    category: "non-teknis",
  },
];

export const allRegistrationDivisions: DivisionOption[] = [
  ...technicalDivisions,
  ...nonTechnicalDivisions,
];

export interface RegistrationRequirementItem {
  title: string;
  desc: string;
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
    description: string;
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
    title: "Mahasiswa Aktif Sarjana dan Vokasi",
    desc: "Terdaftar sebagai mahasiswa aktif UNS jenjang Sarjana maupun Vokasi angkatan 2025 dan 2026.",
  },
  {
    title: "Terbuka untuk Semua Program Studi",
    desc: "Boleh mendaftar dari seluruh program studi di UNS tanpa terkecuali.",
  },
  {
    title: "Batasan Keikutsertaan Organisasi",
    desc: "Tidak mendaftar 2 UKM atau organisasi lain (maksimal hanya mengikuti 1 organisasi lain).",
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
    title: "Unggah Berkas CV",
    shortTitle: "Berkas CV",
  },
  {
    id: 6,
    title: "Grup WA dan Tanda Terima",
    shortTitle: "Selesai",
  },
];

export const registrationRequirementsData: RegistrationRequirementsContent = {
  header: {
    stepBadge: "1",
    stepText: "Langkah 1 dari 6",
    title: "Syarat Masuk dan Ketentuan Pendaftaran",
    description:
      "Pastikan Anda memenuhi ketentuan berikut sebelum melanjutkan ke autentikasi akun Google.",
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
