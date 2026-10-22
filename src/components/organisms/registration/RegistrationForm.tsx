/*
-----------------------------------------
nama file: [ RegistrationForm.tsx ] 
fungsi [ Komponen container utama formulir pendaftaran 6 langkah: Syarat -> Akun Google -> Identitas -> Divisi -> Berkas CV -> Selesai. Menerapkan aturan immutability: data yang sudah disimpan terkunci permanen dan tidak dapat diubah lagi. ]
-----------------------------------------------
*/

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { RegistrationStepper, RegistrationStepItem, ConfirmationModal } from "@/src/components/molecules";
import { RegistrationRequirementsSection } from "./RegistrationRequirementsSection";
import { RegistrationAuthSection } from "./RegistrationAuthSection";
import { RegistrationPersonalSection } from "./RegistrationPersonalSection";
import { RegistrationDivisionSection, DivisionCategory } from "./RegistrationDivisionSection";
import { RegistrationCvSection } from "./RegistrationCvSection";
import { RegistrationSuccessSection } from "./RegistrationSuccessSection";
import {
  registrationSteps,
  technicalDivisions,
  nonTechnicalDivisions,
} from "@/data/registration";
import {
  submitRegistration,
  savePermanentStep3,
  savePermanentStep4,
  getRegistrationProgress,
  RegistrationFormInput,
  getFacultyFromNim,
  SubmissionReceiptData,
  GoogleAuthUser,
  getAuthenticatedUser,
  supabase,
  formatSupabaseUser,
  SupabaseRegistrationRecord,
} from "@/src/services";
import { CheckCircle2 } from "lucide-react";

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const REGISTRATION_STEPS: RegistrationStepItem[] = registrationSteps;

export const RegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Syarat
  const [agreedToRequirements, setAgreedToRequirements] = useState<boolean>(false);
  const [requirementsError, setRequirementsError] = useState<string>("");

  // Step 2: Akun Google
  const [authUser, setAuthUser] = useState<GoogleAuthUser | null>(null);

  // Step 3: Identitas
  const [fullName, setFullName] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [prodi, setProdi] = useState<string>("");
  const [angkatan, setAngkatan] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");

  // Step 4: Divisi
  const [categoryMode1, setCategoryMode1] = useState<DivisionCategory>("");
  const [primaryDivision, setPrimaryDivision] = useState<string>("");
  const [primaryReason, setPrimaryReason] = useState<string>("");

  const [categoryMode2, setCategoryMode2] = useState<DivisionCategory>("");
  const [secondaryDivision, setSecondaryDivision] = useState<string>("");
  const [secondaryReason, setSecondaryReason] = useState<string>("");

  // Step 5: Berkas CV
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [cvAgreement, setCvAgreement] = useState<boolean>(false);

  // State Form Global & Status Record Database
  const [savedRecord, setSavedRecord] = useState<SupabaseRegistrationRecord | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSavingStep, setIsSavingStep] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<SubmissionReceiptData | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  // State Modal Konfirmasi Simpan Permanen (Step 3, Step 4, Submit Final)
  type ConfirmModalType = "step3" | "step4" | "submit" | null;
  const [confirmModalType, setConfirmModalType] = useState<ConfirmModalType>(null);

  const getDivisionName = useCallback((id: string) => {
    const all = [...technicalDivisions, ...nonTechnicalDivisions];
    const found = all.find((d) => d.id === id);
    return found ? found.name : id;
  }, []);

  // KETENTUAN IMMUTABILITY: Menghitung status penguncian permanen
  const isFullySubmitted = savedRecord?.status === "submitted" || Boolean(submissionSuccess);
  const isIdentityLocked = isFullySubmitted || Boolean(savedRecord?.full_name || savedRecord?.nim);
  const isDivisionLocked = isFullySubmitted || Boolean(savedRecord?.primary_division_id && savedRecord?.secondary_division_id);

  // Jika sudah berstatus submitted, paksa tampilan langsung terkunci di sesi akhir (Langkah 6)
  useEffect(() => {
    if (isFullySubmitted && currentStep !== 6) {
      setCurrentStep(6);
      window.scrollTo({ top: 80, behavior: "smooth" });
    }
  }, [isFullySubmitted, currentStep]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  /**
   * Mengisi form secara otomatis dari record database yang telah tersimpan
   */
  const restoreDraftFromRecord = useCallback((record: SupabaseRegistrationRecord) => {
    setSavedRecord(record);
    setAgreedToRequirements(true);
    if (record.full_name) setFullName(record.full_name);
    if (record.nim) setNim(record.nim);
    if (record.prodi) setProdi(record.prodi);
    if (record.angkatan) setAngkatan(record.angkatan);
    if (record.whatsapp) setWhatsapp(record.whatsapp);

    if (record.primary_division_id) {
      setPrimaryDivision(record.primary_division_id);
      setCategoryMode1(record.primary_division_category || "teknis");
    }
    if (record.primary_reason) setPrimaryReason(record.primary_reason);

    if (record.secondary_division_id) {
      setSecondaryDivision(record.secondary_division_id);
      setCategoryMode2(record.secondary_division_category || "teknis");
    }
    if (record.secondary_reason) setSecondaryReason(record.secondary_reason);

    if (record.status === "submitted") {
      const receiptNim = record.nim || "";
      const detectedFaculty = record.fakultas || getFacultyFromNim(receiptNim);
      const combinedReason = `Pilihan 1 (${record.primary_division_name || record.primary_division_id}): ${record.primary_reason || "-"}\n\nPilihan 2 (${record.secondary_division_name || record.secondary_division_id}): ${record.secondary_reason || "-"}`;

      const receipt: SubmissionReceiptData = {
        registrationId: record.registration_code || "ROB-UNS-2026",
        fullName: record.full_name || "",
        nim: receiptNim,
        fakultas: detectedFaculty,
        faculty: detectedFaculty,
        prodi: record.prodi || "",
        angkatan: record.angkatan || "",
        whatsapp: record.whatsapp || "",
        primaryDivision: record.primary_division_name || record.primary_division_id || "",
        secondaryDivision: record.secondary_division_name || record.secondary_division_id || "",
        reason: combinedReason,
        primaryReason: record.primary_reason || "",
        secondaryReason: record.secondary_reason || "",
        fileName: record.cv_file_name || "cv.pdf",
        fileSizeFormatted: formatFileSize(record.cv_file_size_bytes || 0),
        submittedAt: record.submitted_at
          ? new Date(record.submitted_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Sudah Dikirim",
      };

      setSubmissionSuccess(receipt);
      setCurrentStep(6);
      return;
    }

    // Jika berstatus draft, lompat ke tahap terakhir yang belum diselesaikan
    const nextStep = record.current_step === 4 ? 5 : 4;
    setCurrentStep(nextStep);
    setRestoreMessage("Progres pendaftaran tersimpan berhasil dimuat kembali (Data terkunci).");
    setTimeout(() => setRestoreMessage(null), 6000);
  }, []);

  // Listener sesi Google Supabase saat load awal, setelah OAuth redirect, atau saat logout
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const user = await getAuthenticatedUser();
      if (!isMounted) return;

      setAuthUser(user);
      if (user) {
        if (user.fullName) {
          const defaultName = user.fullName;
          setFullName((prev) => prev || defaultName);
        }

        // Cek apakah user sudah punya data pendaftaran tersimpan di database
        const progress = await getRegistrationProgress();
        if (isMounted && progress.hasRecord && progress.record) {
          restoreDraftFromRecord(progress.record);
        }
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_OUT" || !session?.user) {
        setAuthUser(null);
        setSavedRecord(null);
        setCurrentStep((prev) => (prev > 2 ? 2 : prev));
      } else {
        const formatted = formatSupabaseUser(session.user);
        setAuthUser(formatted);
        if (formatted.fullName) {
          const defaultName = formatted.fullName;
          setFullName((prev) => prev || defaultName);
        }

        const progress = await getRegistrationProgress();
        if (isMounted && progress.hasRecord && progress.record) {
          restoreDraftFromRecord(progress.record);
        }
      }
    });

    const handleWindowSignout = () => {
      if (isMounted) {
        setAuthUser(null);
        setSavedRecord(null);
        setCurrentStep((prev) => (prev > 2 ? 2 : prev));
      }
    };

    window.addEventListener("supabase-auth-signout", handleWindowSignout);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener("supabase-auth-signout", handleWindowSignout);
    };
  }, [restoreDraftFromRecord]);

  // Validasi Step 1: Syarat
  const validateStep1 = (): boolean => {
    if (!agreedToRequirements) {
      setRequirementsError("Anda harus menyetujui seluruh kriteria pendaftaran sebelum melanjutkan");
      return false;
    }
    setRequirementsError("");
    return true;
  };

  // Validasi Step 2: Akun Google
  const validateStep2 = (): boolean => {
    return authUser !== null;
  };

  // Validasi Step 3: Identitas Mahasiswa (Zero Trust Pre-Check di Klien)
  const validateStep3 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const cleanName = fullName.trim();
    if (!cleanName) {
      newErrors.fullName = "Nama lengkap wajib diisi";
    } else if (cleanName.length < 3) {
      newErrors.fullName = "Nama lengkap terlalu pendek (minimal 3 karakter)";
    } else if (/\d/.test(cleanName)) {
      newErrors.fullName = "Nama tidak valid: nama lengkap tidak boleh mengandung angka";
    }

    const cleanNim = nim.trim().toUpperCase();
    if (!cleanNim) {
      newErrors.nim = "NIM wajib diisi";
    } else if (cleanNim.length < 7 || cleanNim.length > 12) {
      newErrors.nim = "Format NIM tidak valid (panjang 7 - 12 karakter)";
    } else {
      const validInitials = ["F", "G", "H", "I", "D", "E", "B", "K", "M", "V", "L", "Z", "C", "P"];
      if (!validInitials.includes(cleanNim.charAt(0))) {
        newErrors.nim = "Format NIM tidak valid: inisial bukan kode fakultas resmi UNS";
      }
    }

    if (!angkatan) {
      newErrors.angkatan = "Tahun angkatan wajib dipilih";
    } else if (angkatan !== "2025" && angkatan !== "2026") {
      newErrors.angkatan = "Pendaftaran hanya dibuka untuk mahasiswa angkatan 2025 dan 2026";
    }

    if (!prodi.trim()) {
      newErrors.prodi = "Program studi wajib diisi";
    }

    const cleanWa = whatsapp.trim().replace(/[-\s]/g, "");
    if (!cleanWa) {
      newErrors.whatsapp = "Nomor WhatsApp aktif wajib diisi";
    } else if (!/^(08|\+628|628)[0-9]{8,12}$/.test(cleanWa)) {
      newErrors.whatsapp = "Masukkan nomor seluler Indonesia yang valid diawali 08 (10-15 digit)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validasi Step 4: Pilihan Divisi
  const validateStep4 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!categoryMode1) {
      newErrors.categoryMode1 = "Kategori bidang untuk pilihan 1 wajib dipilih";
    }
    if (!primaryDivision) {
      newErrors.primaryDivision = "Divisi pilihan 1 wajib dipilih";
    }
    if (!primaryReason.trim()) {
      newErrors.primaryReason = "Alasan memilih pilihan pertama wajib diisi";
    } else if (primaryReason.trim().length < 15) {
      newErrors.primaryReason = "Alasan memilih pilihan pertama minimal 15 karakter";
    }

    if (!categoryMode2) {
      newErrors.categoryMode2 = "Kategori bidang untuk pilihan 2 wajib dipilih";
    }
    if (!secondaryDivision) {
      newErrors.secondaryDivision = "Divisi pilihan 2 wajib dipilih";
    } else if (secondaryDivision === primaryDivision) {
      newErrors.secondaryDivision = "Divisi pilihan 2 harus berbeda dari pilihan 1";
    }
    if (!secondaryReason.trim()) {
      newErrors.secondaryReason = "Alasan memilih pilihan kedua wajib diisi";
    } else if (secondaryReason.trim().length < 15) {
      newErrors.secondaryReason = "Alasan memilih pilihan kedua minimal 15 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validasi Step 5: Berkas CV
  const validateStep5 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!cvFile) {
      newErrors.cvFile = "Berkas CV wajib diunggah (format PDF, maksimal 1.0 MB)";
    } else if (cvFile.size > MAX_FILE_SIZE) {
      newErrors.cvFile = "Ukuran berkas CV melebihi batas 1.0 MB";
    }

    if (!cvAgreement) {
      newErrors.cvAgreement = "Anda perlu menyetujui pernyataan keabsahan dokumen sebelum mengirim pendaftaran";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const maxReachableStep = useMemo<number>(() => {
    if (submissionSuccess) return 6;

    const isStep1Valid = agreedToRequirements;
    if (!isStep1Valid) return 1;

    const isStep2Valid = authUser !== null;
    if (!isStep2Valid) return 2;

    const cleanWa = whatsapp.trim().replace(/[-\s]/g, "");
    const isStep3Valid =
      Boolean(fullName.trim()) &&
      !/\d/.test(fullName.trim()) &&
      Boolean(nim.trim()) &&
      nim.trim().length >= 7 &&
      (angkatan === "2025" || angkatan === "2026") &&
      Boolean(prodi.trim()) &&
      Boolean(cleanWa) &&
      /^[0-9+]{9,15}$/.test(cleanWa);
    if (!isStep3Valid) return 3;

    const isStep4Valid =
      Boolean(categoryMode1) &&
      Boolean(primaryDivision) &&
      primaryReason.trim().length >= 15 &&
      Boolean(categoryMode2) &&
      Boolean(secondaryDivision) &&
      secondaryDivision !== primaryDivision &&
      secondaryReason.trim().length >= 15;
    if (!isStep4Valid) return 4;

    const isStep5Valid =
      cvFile !== null &&
      cvFile.size <= MAX_FILE_SIZE &&
      Boolean(cvAgreement);
    if (!isStep5Valid) return 5;

    return 6;
  }, [
    submissionSuccess,
    agreedToRequirements,
    authUser,
    fullName,
    nim,
    angkatan,
    prodi,
    whatsapp,
    categoryMode1,
    primaryDivision,
    primaryReason,
    categoryMode2,
    secondaryDivision,
    secondaryReason,
    cvFile,
    cvAgreement,
  ]);

  const handleCategoryMode1Change = (newCat: DivisionCategory) => {
    if (isDivisionLocked || isFullySubmitted) return;
    setCategoryMode1(newCat);
    setPrimaryDivision("");
    if (errors.categoryMode1) {
      setErrors((prev) => ({ ...prev, categoryMode1: "" }));
    }
    if (errors.primaryDivision) {
      setErrors((prev) => ({ ...prev, primaryDivision: "" }));
    }
  };

  const handleCategoryMode2Change = (newCat: DivisionCategory) => {
    if (isDivisionLocked || isFullySubmitted) return;
    setCategoryMode2(newCat);
    setSecondaryDivision("");
    if (errors.categoryMode2) {
      setErrors((prev) => ({ ...prev, categoryMode2: "" }));
    }
    if (errors.secondaryDivision) {
      setErrors((prev) => ({ ...prev, secondaryDivision: "" }));
    }
  };

  const handlePrimaryDivisionChange = (newPrimaryId: string) => {
    if (isDivisionLocked || isFullySubmitted) return;
    setPrimaryDivision(newPrimaryId);
    if (errors.primaryDivision) {
      setErrors((prev) => ({ ...prev, primaryDivision: "" }));
    }
    if (secondaryDivision === newPrimaryId) {
      setSecondaryDivision("");
    }
  };

  const handleSecondaryDivisionChange = (newSecondaryId: string) => {
    if (isDivisionLocked || isFullySubmitted) return;
    setSecondaryDivision(newSecondaryId);
    if (errors.secondaryDivision) {
      setErrors((prev) => ({ ...prev, secondaryDivision: "" }));
    }
  };

  // Navigasi Antar Langkah dengan Simpan Permanen ke Backend Supabase Edge Function
  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      scrollToTop();
    }
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      if (!fullName && authUser?.fullName) {
        setFullName(authUser.fullName);
      }
      setCurrentStep(3);
      scrollToTop();
    }
  };

  /**
   * Pemicu tombol Lanjut Step 3: validasi terlebih dahulu, lalu buka pop-up konfirmasi simpan permanen
   */
  const handleNextFromStep3 = () => {
    // Jika data identitas sudah tersimpan permanen atau sudah submit final, langsung lanjut ke Step 4
    if (isIdentityLocked || isFullySubmitted) {
      setCurrentStep(4);
      scrollToTop();
      return;
    }

    if (!validateStep3()) {
      return;
    }

    setConfirmModalType("step3");
  };

  /**
   * Eksekusi Simpan Permanen Step 3 ke Edge Function setelah user mengonfirmasi pop-up
   */
  const executeSaveStep3 = async () => {
    setIsSavingStep(true);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.general;
      return copy;
    });

    try {
      const result = await savePermanentStep3({
        fullName,
        nim,
        angkatan,
        prodi,
        whatsapp,
      });

      if (!result.success) {
        setConfirmModalType(null);
        if (result.error && (result.error.includes("terkirim") || result.error.includes("dikirim permanen") || result.error.includes("submitted"))) {
          setSavedRecord((prev) => ({ ...(prev || {}), status: "submitted" }));
          setCurrentStep(6);
          scrollToTop();
          return;
        }

        if (result.field) {
          setErrors((prev) => ({ ...prev, [result.field!]: result.error || "Validasi gagal." }));
        } else {
          setErrors((prev) => ({ ...prev, general: result.error || "Gagal menyimpan identitas." }));
        }
        return;
      }

      // Berhasil disimpan permanen di database: perbarui savedRecord untuk mengunci field
      if (result.data) {
        setSavedRecord(result.data);
      }

      setConfirmModalType(null);
      setErrors({});
      setCurrentStep(4);
      scrollToTop();
    } finally {
      setIsSavingStep(false);
    }
  };

  /**
   * Pemicu tombol Lanjut Step 4: validasi terlebih dahulu, lalu buka pop-up konfirmasi simpan permanen
   */
  const handleNextFromStep4 = () => {
    // Jika pilihan divisi sudah tersimpan permanen atau sudah submit final, langsung lanjut ke Step 5
    if (isDivisionLocked || isFullySubmitted) {
      setCurrentStep(5);
      scrollToTop();
      return;
    }

    if (!validateStep4()) {
      return;
    }

    setConfirmModalType("step4");
  };

  /**
   * Eksekusi Simpan Permanen Step 4 ke Edge Function setelah user mengonfirmasi pop-up
   */
  const executeSaveStep4 = async () => {
    setIsSavingStep(true);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.general;
      return copy;
    });

    try {
      const result = await savePermanentStep4({
        categoryMode1: categoryMode1 as "teknis" | "non-teknis",
        primaryDivisionId: primaryDivision,
        primaryReason,
        categoryMode2: categoryMode2 as "teknis" | "non-teknis",
        secondaryDivisionId: secondaryDivision,
        secondaryReason,
      });

      if (!result.success) {
        setConfirmModalType(null);
        if (result.error && (result.error.includes("terkirim") || result.error.includes("dikirim permanen") || result.error.includes("submitted"))) {
          setSavedRecord((prev) => ({ ...(prev || {}), status: "submitted" }));
          setCurrentStep(6);
          scrollToTop();
          return;
        }

        if (result.field) {
          setErrors((prev) => ({ ...prev, [result.field!]: result.error || "Validasi gagal." }));
        } else {
          setErrors((prev) => ({ ...prev, general: result.error || "Gagal menyimpan pilihan divisi." }));
        }
        return;
      }

      if (result.data) {
        setSavedRecord(result.data);
      }

      setConfirmModalType(null);
      setErrors({});
      setCurrentStep(5);
      scrollToTop();
    } finally {
      setIsSavingStep(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (isFullySubmitted) return;
    setFileError(null);

    const allowedExtensions = [".pdf"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const isPdfType = file.type === "application/pdf" || fileExtension === ".pdf";

    if (!isPdfType || !allowedExtensions.includes(fileExtension)) {
      setFileError("Format berkas tidak didukung. Berkas CV wajib dalam format PDF (.pdf).");
      setCvFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileError(
        `Ukuran berkas melebihi batas 1.0 MB (terdeteksi: ${sizeMb} MB). Mohon kompres berkas Anda sebelum mengunggah.`
      );
      setCvFile(null);
      return;
    }

    setCvFile(file);
    if (errors.cvFile) {
      setErrors((prev) => ({ ...prev, cvFile: "" }));
    }
  };

  const handleFileRemove = () => {
    if (isFullySubmitted) return;
    setCvFile(null);
    setFileError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Jika sudah pernah disubmit permanen, jangan submit ulang
    if (isFullySubmitted) {
      setCurrentStep(6);
      scrollToTop();
      return;
    }

    if (!validateStep5()) {
      return;
    }

    setConfirmModalType("submit");
  };

  /**
   * Eksekusi Pengiriman Pendaftaran Final setelah konfirmasi pop-up
   */
  const executeFinalSubmit = async () => {
    setIsSubmitting(true);
    setFileError(null);

    try {
      const input: RegistrationFormInput = {
        fullName,
        nim,
        prodi,
        angkatan,
        whatsapp,
        categoryMode1: categoryMode1 as "teknis" | "non-teknis",
        primaryDivisionId: primaryDivision,
        primaryReason,
        categoryMode2: categoryMode2 as "teknis" | "non-teknis",
        secondaryDivisionId: secondaryDivision,
        secondaryReason,
        cvFile,
        agreedToRequirements,
        agreedToCvTruth: cvAgreement,
      };

      const result = await submitRegistration(input);

      if (!result.success) {
        setConfirmModalType(null);
        if (result.error && (result.error.includes("terkirim") || result.error.includes("dikirim permanen") || result.error.includes("submitted"))) {
          setSavedRecord((prev) => ({ ...(prev || {}), status: "submitted" }));
          setCurrentStep(6);
          scrollToTop();
          return;
        }
        setFileError(result.error || result.message || "Gagal mengirim formulir pendaftaran.");
        return;
      }

      if (result.data) {
        setSavedRecord(result.data as SupabaseRegistrationRecord);
      }

      const receiptNim = nim.trim().toUpperCase();
      const detectedFaculty = getFacultyFromNim(receiptNim);
      const combinedReason = `Pilihan 1 (${primaryDivision}): ${primaryReason.trim()}\n\nPilihan 2 (${secondaryDivision}): ${secondaryReason.trim()}`;

      const receipt: SubmissionReceiptData = {
        registrationId: result.registrationCode || `ROB-UNS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: fullName.trim(),
        nim: receiptNim,
        fakultas: detectedFaculty,
        faculty: detectedFaculty,
        prodi: prodi.trim(),
        angkatan: angkatan,
        whatsapp: whatsapp.trim(),
        primaryDivision: primaryDivision,
        secondaryDivision: secondaryDivision,
        reason: combinedReason,
        primaryReason: primaryReason.trim(),
        secondaryReason: secondaryReason.trim(),
        fileName: cvFile ? cvFile.name : "cv.pdf",
        fileSizeFormatted: cvFile ? formatFileSize(cvFile.size) : "0 KB",
        submittedAt: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setConfirmModalType(null);
      setSubmissionSuccess(receipt);
      setCurrentStep(6);
      scrollToTop();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isFullySubmitted) {
      setCurrentStep(6);
      scrollToTop();
      return;
    }
    setCurrentStep(1);
    setAgreedToRequirements(false);
    setRequirementsError("");
    setFullName("");
    setNim("");
    setProdi("");
    setAngkatan("");
    setWhatsapp("");
    setCategoryMode1("");
    setPrimaryDivision("");
    setPrimaryReason("");
    setCategoryMode2("");
    setSecondaryDivision("");
    setSecondaryReason("");
    setCvFile(null);
    setFileError(null);
    setCvAgreement(false);
    setErrors({});
    setSubmissionSuccess(null);
    setRestoreMessage(null);
    scrollToTop();
  };

  const handleStepClick = (stepId: number) => {
    // Jika pendaftaran sudah tersubmit permanen, jangan izinkan navigasi ke langkah sebelumnya
    if (isFullySubmitted) return;
    if (stepId === currentStep) return;

    if (stepId < currentStep) {
      setCurrentStep(stepId);
      scrollToTop();
      return;
    }

    if (currentStep <= 1 && stepId > 1) {
      if (!validateStep1()) {
        setCurrentStep(1);
        scrollToTop();
        return;
      }
    }

    if (currentStep <= 2 && stepId > 2) {
      if (!validateStep2()) {
        setCurrentStep(2);
        scrollToTop();
        return;
      }
    }

    if (currentStep <= 3 && stepId > 3) {
      if (!validateStep3()) {
        setCurrentStep(3);
        scrollToTop();
        return;
      }
    }

    if (currentStep <= 4 && stepId > 4) {
      if (!validateStep4()) {
        setCurrentStep(4);
        scrollToTop();
        return;
      }
    }

    if (currentStep <= 5 && stepId > 5) {
      if (!validateStep5()) {
        setCurrentStep(5);
        scrollToTop();
        return;
      }
    }

    if (stepId <= maxReachableStep) {
      setCurrentStep(stepId);
      scrollToTop();
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-6 md:space-y-8 print:space-y-0">
      {/* Toast Alert saat Progres Berhasil Dimuat Kembali */}
      {restoreMessage && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-3 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="font-medium">{restoreMessage}</p>
        </div>
      )}

      <RegistrationStepper
        currentStep={currentStep}
        steps={REGISTRATION_STEPS}
        maxReachableStep={maxReachableStep}
        onStepClick={handleStepClick}
        isLocked={isFullySubmitted}
        className="print:hidden"
      />


      {/* Langkah 1: Syarat Masuk */}
      {currentStep === 1 && (
        <RegistrationRequirementsSection
          agreed={agreedToRequirements}
          error={requirementsError}
          isLocked={isFullySubmitted}
          onAgreeChange={(val) => {
            if (isFullySubmitted) return;
            setAgreedToRequirements(val);
            if (val) setRequirementsError("");
          }}
          onNext={handleNextFromStep1}
        />
      )}

      {/* Langkah 2: Autentikasi Akun Google */}
      {currentStep === 2 && (
        <RegistrationAuthSection
          user={authUser}
          isLocked={isFullySubmitted}
          onUserChange={(newUser) => {
            if (isFullySubmitted) return;
            setAuthUser(newUser);
            if (newUser?.fullName && !fullName) {
              setFullName(newUser.fullName);
            }
          }}
          onPrev={() => {
            setCurrentStep(1);
            scrollToTop();
          }}
          onNext={handleNextFromStep2}
        />
      )}

      {/* Langkah 3: Identitas Mahasiswa */}
      {currentStep === 3 && (
        <RegistrationPersonalSection
          fullName={fullName}
          nim={nim}
          prodi={prodi}
          angkatan={angkatan}
          whatsapp={whatsapp}
          errors={errors}
          isSaving={isSavingStep}
          isLocked={isIdentityLocked || isFullySubmitted}
          onFullNameChange={(val) => {
            if (isIdentityLocked || isFullySubmitted) return;
            setFullName(val);
            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
          }}
          onNimChange={(val) => {
            if (isIdentityLocked || isFullySubmitted) return;
            setNim(val);
            if (errors.nim) setErrors((prev) => ({ ...prev, nim: "" }));
          }}
          onProdiChange={(val) => {
            if (isIdentityLocked || isFullySubmitted) return;
            setProdi(val);
            if (errors.prodi) setErrors((prev) => ({ ...prev, prodi: "" }));
          }}
          onAngkatanChange={(val) => {
            if (isIdentityLocked || isFullySubmitted) return;
            setAngkatan(val);
            if (errors.angkatan) setErrors((prev) => ({ ...prev, angkatan: "" }));
          }}
          onWhatsappChange={(val) => {
            if (isIdentityLocked || isFullySubmitted) return;
            setWhatsapp(val);
            if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: "" }));
          }}
          onPrev={() => {
            setCurrentStep(2);
            scrollToTop();
          }}
          onNext={handleNextFromStep3}
        />
      )}

      {/* Langkah 4: Pilihan Divisi */}
      {currentStep === 4 && (
        <RegistrationDivisionSection
          categoryMode1={categoryMode1}
          primaryDivision={primaryDivision}
          primaryReason={primaryReason}
          categoryMode2={categoryMode2}
          secondaryDivision={secondaryDivision}
          secondaryReason={secondaryReason}
          errors={errors}
          isSaving={isSavingStep}
          isLocked={isDivisionLocked || isFullySubmitted}
          onCategoryMode1Change={handleCategoryMode1Change}
          onPrimaryDivisionChange={handlePrimaryDivisionChange}
          onPrimaryReasonChange={(val) => {
            if (isDivisionLocked || isFullySubmitted) return;
            setPrimaryReason(val);
            if (errors.primaryReason) setErrors((prev) => ({ ...prev, primaryReason: "" }));
          }}
          onCategoryMode2Change={handleCategoryMode2Change}
          onSecondaryDivisionChange={handleSecondaryDivisionChange}
          onSecondaryReasonChange={(val) => {
            if (isDivisionLocked || isFullySubmitted) return;
            setSecondaryReason(val);
            if (errors.secondaryReason) setErrors((prev) => ({ ...prev, secondaryReason: "" }));
          }}
          onPrev={() => {
            setCurrentStep(3);
            scrollToTop();
          }}
          onNext={handleNextFromStep4}
        />
      )}

      {/* Langkah 5: Unggah Berkas CV */}
      {currentStep === 5 && (
        <RegistrationCvSection
          file={cvFile}
          error={fileError || errors.cvFile}
          agreement={cvAgreement}
          agreementError={errors.cvAgreement}
          isSubmitting={isSubmitting}
          isLocked={isFullySubmitted}
          maxSizeBytes={MAX_FILE_SIZE}
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          onAgreementChange={(val) => {
            if (isFullySubmitted) return;
            setCvAgreement(val);
            if (errors.cvAgreement) setErrors((prev) => ({ ...prev, cvAgreement: "" }));
          }}
          onPrev={() => {
            setCurrentStep(4);
            scrollToTop();
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* Langkah 6: Tanda Terima & Grup WA */}
      {currentStep === 6 && submissionSuccess && (
        <RegistrationSuccessSection
          data={submissionSuccess}
          onReset={handleReset}
        />
      )}

      {/* Pop-up Modal Simpan Permanen Step 3: Identitas */}
      <ConfirmationModal
        isOpen={confirmModalType === "step3"}
        title="Simpan Permanen Data Identitas"
        description="Data identitas yang telah disimpan tidak dapat diubah kembali."
        confirmText="Ya, Simpan Permanen"
        cancelText="Periksa Kembali"
        isLoading={isSavingStep}
        onConfirm={executeSaveStep3}
        onCancel={() => setConfirmModalType(null)}
        details={[
          { label: "Nama Lengkap", value: fullName },
          { label: "NIM", value: nim },
          { label: "Program Studi", value: prodi },
          { label: "Tahun Angkatan", value: angkatan },
          { label: "Nomor WhatsApp", value: whatsapp },
        ]}
      />

      {/* Pop-up Modal Simpan Permanen Step 4: Pilihan Divisi */}
      <ConfirmationModal
        isOpen={confirmModalType === "step4"}
        title="Simpan Permanen Pilihan Divisi"
        description="Pilihan divisi yang telah disimpan tidak dapat diubah kembali."
        confirmText="Ya, Simpan Permanen"
        cancelText="Periksa Kembali"
        isLoading={isSavingStep}
        onConfirm={executeSaveStep4}
        onCancel={() => setConfirmModalType(null)}
        details={[
          { label: "Kategori Pilihan 1", value: categoryMode1 === "teknis" ? "Teknis" : "Non-Teknis" },
          { label: "Divisi Pilihan 1", value: getDivisionName(primaryDivision) },
          { label: "Kategori Pilihan 2", value: categoryMode2 === "teknis" ? "Teknis" : "Non-Teknis" },
          { label: "Divisi Pilihan 2", value: getDivisionName(secondaryDivision) },
        ]}
      />

      {/* Pop-up Modal Kirim Permanen Step 5: Berkas CV & Finalisasi */}
      <ConfirmationModal
        isOpen={confirmModalType === "submit"}
        title="Kirim Pendaftaran Calon Anggota"
        description="Pendaftaran yang telah dikirim bersifat final dan tidak dapat diubah kembali."
        confirmText="Ya, Kirim Formulir"
        cancelText="Periksa Kembali"
        isLoading={isSubmitting}
        onConfirm={executeFinalSubmit}
        onCancel={() => setConfirmModalType(null)}
        details={[
          { label: "Nama Pendaftar", value: fullName },
          { label: "NIM", value: nim },
          { label: "Divisi Pilihan 1", value: getDivisionName(primaryDivision) },
          { label: "Divisi Pilihan 2", value: getDivisionName(secondaryDivision) },
          { label: "Berkas CV", value: cvFile?.name || "-" },
          { label: "Ukuran Berkas", value: formatFileSize(cvFile?.size || 0) },
        ]}
      />
    </div>
  );
};
