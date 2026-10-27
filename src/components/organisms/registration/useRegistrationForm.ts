/*
-----------------------------------------
nama file: [ useRegistrationForm.ts ] 
fungsi [ Custom hook untuk mengelola seluruh state, siklus otentikasi, validasi, dan integrasi backend Supabase formulir pendaftaran calon anggota ]
-----------------------------------------------
*/

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
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
  resolveFacultyName,
  generateRegistrationCode,
  SubmissionReceiptData,
  GoogleAuthUser,
  getAuthenticatedUser,
  supabase,
  formatSupabaseUser,
  SupabaseRegistrationRecord,
  formatFileSize,
} from "@/src/services";
import { DivisionCategory } from "./RegistrationDivisionSection";
import { ConfirmModalType } from "./RegistrationConfirmModals";
import {
  MAX_FILE_SIZE,
  validateStep1 as validateStep1Util,
  validateStep2 as validateStep2Util,
  validateStep3 as validateStep3Util,
  validateStep4 as validateStep4Util,
  validateStep5 as validateStep5Util,
  calculateMaxReachableStep,
} from "./registrationValidation";

export function useRegistrationForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Syarat
  const [agreedToRequirements, setAgreedToRequirements] = useState<boolean>(false);
  const [requirementsError, setRequirementsError] = useState<string>("");

  // Step 2: Akun Google
  const [authUser, setAuthUser] = useState<GoogleAuthUser | null>(null);

  // Step 3: Identitas
  const [fullName, setFullName] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [fakultas, setFakultas] = useState<string>("");
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
  const [confirmModalType, setConfirmModalType] = useState<ConfirmModalType>(null);

  const getDivisionName = useCallback((id: string) => {
    const all = [...technicalDivisions, ...nonTechnicalDivisions];
    const found = all.find((d) => d.id === id);
    return found ? found.name : id;
  }, []);

  // KETENTUAN IMMUTABILITY: Menghitung status penguncian permanen
  const isFullySubmitted = savedRecord?.status === "submitted" || Boolean(submissionSuccess);
  const isIdentityLocked = isFullySubmitted || Boolean(savedRecord?.full_name || savedRecord?.nim);
  const isDivisionLocked =
    isFullySubmitted || Boolean(savedRecord?.primary_division_id && savedRecord?.secondary_division_id);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 80, behavior: "smooth" });
  }, []);

  // Jika sudah berstatus submitted, paksa tampilan langsung terkunci di sesi akhir (Langkah 6)
  useEffect(() => {
    if (isFullySubmitted && currentStep !== 6) {
      const timer = setTimeout(() => {
        setCurrentStep(6);
        scrollToTop();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isFullySubmitted, currentStep, scrollToTop]);

  /**
   * Mengisi form secara otomatis dari record database yang telah tersimpan
   */
  const restoreDraftFromRecord = useCallback((record: SupabaseRegistrationRecord) => {
    setSavedRecord(record);
    setAgreedToRequirements(true);
    if (record.full_name) setFullName(record.full_name);
    if (record.nim) setNim(record.nim);
    if (record.fakultas || record.prodi) {
      setFakultas(resolveFacultyName(record.fakultas, record.prodi));
    }
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
      const detectedFaculty =
        resolveFacultyName(record.fakultas, record.prodi) || getFacultyFromNim(receiptNim);
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
    const res = validateStep1Util(agreedToRequirements);
    setRequirementsError(res.error);
    return res.isValid;
  };

  // Validasi Step 2: Akun Google
  const validateStep2 = (): boolean => {
    return validateStep2Util(authUser);
  };

  // Validasi Step 3: Identitas Mahasiswa (Zero Trust Pre-Check di Klien)
  const validateStep3 = (): boolean => {
    const res = validateStep3Util({
      fullName,
      nim,
      fakultas,
      prodi,
      angkatan,
      whatsapp,
    });
    setErrors(res.errors);
    return res.isValid;
  };

  // Validasi Step 4: Pilihan Divisi
  const validateStep4 = (): boolean => {
    const res = validateStep4Util({
      categoryMode1,
      primaryDivision,
      primaryReason,
      categoryMode2,
      secondaryDivision,
      secondaryReason,
    });
    setErrors(res.errors);
    return res.isValid;
  };

  // Validasi Step 5: Berkas CV
  const validateStep5 = (): boolean => {
    const res = validateStep5Util({
      cvFile,
      cvAgreement,
      maxSizeBytes: MAX_FILE_SIZE,
    });
    setErrors(res.errors);
    return res.isValid;
  };

  const maxReachableStep = useMemo<number>(() => {
    return calculateMaxReachableStep({
      hasSubmissionSuccess: Boolean(submissionSuccess),
      agreedToRequirements,
      authUser,
      fullName,
      nim,
      angkatan,
      fakultas,
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
    });
  }, [
    submissionSuccess,
    agreedToRequirements,
    authUser,
    fullName,
    nim,
    angkatan,
    fakultas,
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
        fakultas,
        angkatan,
        prodi,
        whatsapp,
      });

      if (!result.success) {
        setConfirmModalType(null);
        if (
          result.error &&
          (result.error.includes("terkirim") ||
            result.error.includes("dikirim permanen") ||
            result.error.includes("submitted"))
        ) {
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
        if (
          result.error &&
          (result.error.includes("terkirim") ||
            result.error.includes("dikirim permanen") ||
            result.error.includes("submitted"))
        ) {
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
        fakultas,
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
        if (
          result.error &&
          (result.error.includes("terkirim") ||
            result.error.includes("dikirim permanen") ||
            result.error.includes("submitted"))
        ) {
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
      const detectedFaculty = fakultas.trim() || getFacultyFromNim(receiptNim);
      const combinedReason = `Pilihan 1 (${primaryDivision}): ${primaryReason.trim()}\n\nPilihan 2 (${secondaryDivision}): ${secondaryReason.trim()}`;

      const receipt: SubmissionReceiptData = {
        registrationId: result.registrationCode || generateRegistrationCode(),
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
    setFakultas("");
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

  return {
    // Navigasi & Langkah
    currentStep,
    setCurrentStep,
    maxReachableStep,
    handleStepClick,
    scrollToTop,
    restoreMessage,

    // Status Penguncian Immutability
    isFullySubmitted,
    isIdentityLocked,
    isDivisionLocked,

    // Step 1: Syarat
    agreedToRequirements,
    setAgreedToRequirements,
    requirementsError,
    setRequirementsError,
    handleNextFromStep1,

    // Step 2: Akun Google
    authUser,
    setAuthUser,
    handleNextFromStep2,

    // Step 3: Identitas
    fullName,
    setFullName,
    nim,
    setNim,
    fakultas,
    setFakultas,
    prodi,
    setProdi,
    angkatan,
    setAngkatan,
    whatsapp,
    setWhatsapp,
    handleNextFromStep3,
    executeSaveStep3,

    // Step 4: Divisi
    categoryMode1,
    primaryDivision,
    primaryReason,
    setPrimaryReason,
    categoryMode2,
    secondaryDivision,
    secondaryReason,
    setSecondaryReason,
    handleCategoryMode1Change,
    handleCategoryMode2Change,
    handlePrimaryDivisionChange,
    handleSecondaryDivisionChange,
    handleNextFromStep4,
    executeSaveStep4,

    // Step 5: Berkas CV
    cvFile,
    fileError,
    cvAgreement,
    setCvAgreement,
    handleFileSelect,
    handleFileRemove,
    handleSubmit,
    executeFinalSubmit,

    // Step 6: Selesai / Tanda Terima
    submissionSuccess,
    handleReset,

    // Modal & Global
    errors,
    setErrors,
    isSavingStep,
    isSubmitting,
    confirmModalType,
    setConfirmModalType,
    getDivisionName,
  };
}
