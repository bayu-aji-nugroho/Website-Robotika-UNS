/*
-----------------------------------------
nama file: [ RegistrationForm.tsx ] 
fungsi [ Komponen container utama formulir pendaftaran 5 langkah, mengelola state alur pendaftaran, validasi bertahap, penyimpanan data registrasi, dan render section dinamis ]
-----------------------------------------------
*/

"use client";

import React, { useState, useMemo } from "react";
import { RegistrationStepper, RegistrationStepItem } from "@/src/components/molecules";
import { RegistrationRequirementsSection } from "./RegistrationRequirementsSection";
import { RegistrationPersonalSection } from "./RegistrationPersonalSection";
import { RegistrationDivisionSection, DivisionCategory } from "./RegistrationDivisionSection";
import { RegistrationCvSection } from "./RegistrationCvSection";
import { RegistrationSuccessSection } from "./RegistrationSuccessSection";
import { registrationSteps } from "@/data/registration";
import { submitRegistration, RegistrationFormInput, getFacultyFromNim, SubmissionReceiptData } from "@/src/services";

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const REGISTRATION_STEPS: RegistrationStepItem[] = registrationSteps;

export const RegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [agreedToRequirements, setAgreedToRequirements] = useState<boolean>(false);
  const [requirementsError, setRequirementsError] = useState<string>("");

  const [fullName, setFullName] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [prodi, setProdi] = useState<string>("");
  const [angkatan, setAngkatan] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");

  const [categoryMode1, setCategoryMode1] = useState<DivisionCategory>("");
  const [primaryDivision, setPrimaryDivision] = useState<string>("");
  const [primaryReason, setPrimaryReason] = useState<string>("");

  const [categoryMode2, setCategoryMode2] = useState<DivisionCategory>("");
  const [secondaryDivision, setSecondaryDivision] = useState<string>("");
  const [secondaryReason, setSecondaryReason] = useState<string>("");

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [cvAgreement, setCvAgreement] = useState<boolean>(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<SubmissionReceiptData | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  const validateStep1 = (): boolean => {
    if (!agreedToRequirements) {
      setRequirementsError("Anda harus menyetujui seluruh kriteria pendaftaran sebelum melanjutkan");
      return false;
    }
    setRequirementsError("");
    return true;
  };

  const validateStep2 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = "Nama lengkap wajib diisi";
    if (!nim.trim()) {
      newErrors.nim = "NIM wajib diisi";
    } else if (nim.trim().length < 6) {
      newErrors.nim = "Format NIM tidak valid (minimal 6 karakter)";
    }
    if (!angkatan) {
      newErrors.angkatan = "Tahun angkatan wajib dipilih";
    }
    if (!prodi.trim()) newErrors.prodi = "Program studi wajib diisi";
    if (!whatsapp.trim()) {
      newErrors.whatsapp = "Nomor WhatsApp aktif wajib diisi";
    } else if (!/^[0-9+]{9,15}$/.test(whatsapp.trim().replace(/[-\s]/g, ""))) {
      newErrors.whatsapp = "Masukkan nomor telepon yang valid (minimal 10 digit)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!categoryMode1) {
      newErrors.categoryMode1 = "Kategori bidang untuk pilihan 1 wajib dipilih";
    }
    if (!primaryDivision) {
      newErrors.primaryDivision = "Divisi pilihan 1 wajib dipilih";
    }
    if (!primaryReason.trim()) {
      newErrors.primaryReason = "Alasan memilih pilihan pertama wajib diisi";
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
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
    if (submissionSuccess) return 5;

    const isStep1Valid = agreedToRequirements;
    if (!isStep1Valid) return 1;

    const cleanWa = whatsapp.trim().replace(/[-\s]/g, "");
    const isStep2Valid =
      Boolean(fullName.trim()) &&
      Boolean(nim.trim()) &&
      nim.trim().length >= 6 &&
      Boolean(angkatan) &&
      Boolean(prodi.trim()) &&
      Boolean(cleanWa) &&
      /^[0-9+]{9,15}$/.test(cleanWa);
    if (!isStep2Valid) return 2;

    const isStep3Valid =
      Boolean(categoryMode1) &&
      Boolean(primaryDivision) &&
      Boolean(primaryReason.trim()) &&
      Boolean(categoryMode2) &&
      Boolean(secondaryDivision) &&
      secondaryDivision !== primaryDivision &&
      Boolean(secondaryReason.trim());
    if (!isStep3Valid) return 3;

    const isStep4Valid =
      cvFile !== null &&
      cvFile.size <= MAX_FILE_SIZE &&
      Boolean(cvAgreement);
    if (!isStep4Valid) return 4;

    return 5;
  }, [
    submissionSuccess,
    agreedToRequirements,
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
    setPrimaryDivision(newPrimaryId);
    if (errors.primaryDivision) {
      setErrors((prev) => ({ ...prev, primaryDivision: "" }));
    }
    if (secondaryDivision === newPrimaryId) {
      setSecondaryDivision("");
    }
  };

  const handleSecondaryDivisionChange = (newSecondaryId: string) => {
    setSecondaryDivision(newSecondaryId);
    if (errors.secondaryDivision) {
      setErrors((prev) => ({ ...prev, secondaryDivision: "" }));
    }
  };

  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      scrollToTop();
    }
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      scrollToTop();
    }
  };

  const handleNextFromStep3 = () => {
    if (validateStep3()) {
      setCurrentStep(4);
      scrollToTop();
    }
  };

  const handleFileSelect = (file: File) => {
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
    setCvFile(null);
    setFileError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep4()) {
      return;
    }

    setIsSubmitting(true);

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
      const payload = result.data;

      const combinedReason = `Pilihan 1 (${payload?.divisions.primary.name || primaryDivision}): ${primaryReason.trim()}\n\nPilihan 2 (${payload?.divisions.secondary.name || secondaryDivision}): ${secondaryReason.trim()}`;

      const receiptNim = payload?.applicant.nim || nim.trim().toUpperCase();
      const detectedFaculty = getFacultyFromNim(receiptNim);

      const receipt: SubmissionReceiptData = {
        registrationId: result.registrationCode || `ROB-UNS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: payload?.applicant.fullName || fullName.trim(),
        nim: receiptNim,
        fakultas: detectedFaculty,
        faculty: detectedFaculty,
        prodi: payload?.applicant.prodi || prodi.trim(),
        angkatan: payload?.applicant.angkatan || angkatan,
        whatsapp: payload?.applicant.whatsapp || whatsapp.trim(),
        primaryDivision: payload?.divisions.primary.name || primaryDivision,
        secondaryDivision: payload?.divisions.secondary.name || secondaryDivision,
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

      setSubmissionSuccess(receipt);
      setCurrentStep(5);
      scrollToTop();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
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
    scrollToTop();
  };

  const handleStepClick = (stepId: number) => {
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

    if (stepId <= maxReachableStep) {
      setCurrentStep(stepId);
      scrollToTop();
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-6 md:space-y-8 print:space-y-0">
      <RegistrationStepper
        currentStep={currentStep}
        steps={REGISTRATION_STEPS}
        maxReachableStep={maxReachableStep}
        onStepClick={handleStepClick}
        className="print:hidden"
      />

      {currentStep === 1 && (
        <RegistrationRequirementsSection
          agreed={agreedToRequirements}
          error={requirementsError}
          onAgreeChange={(val) => {
            setAgreedToRequirements(val);
            if (val) setRequirementsError("");
          }}
          onNext={handleNextFromStep1}
        />
      )}

      {currentStep === 2 && (
        <RegistrationPersonalSection
          fullName={fullName}
          nim={nim}
          prodi={prodi}
          angkatan={angkatan}
          whatsapp={whatsapp}
          errors={errors}
          onFullNameChange={(val) => {
            setFullName(val);
            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
          }}
          onNimChange={(val) => {
            setNim(val);
            if (errors.nim) setErrors((prev) => ({ ...prev, nim: "" }));
          }}
          onProdiChange={(val) => {
            setProdi(val);
            if (errors.prodi) setErrors((prev) => ({ ...prev, prodi: "" }));
          }}
          onAngkatanChange={(val) => {
            setAngkatan(val);
            if (errors.angkatan) setErrors((prev) => ({ ...prev, angkatan: "" }));
          }}
          onWhatsappChange={(val) => {
            setWhatsapp(val);
            if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: "" }));
          }}
          onPrev={() => {
            setCurrentStep(1);
            scrollToTop();
          }}
          onNext={handleNextFromStep2}
        />
      )}

      {currentStep === 3 && (
        <RegistrationDivisionSection
          categoryMode1={categoryMode1}
          primaryDivision={primaryDivision}
          primaryReason={primaryReason}
          categoryMode2={categoryMode2}
          secondaryDivision={secondaryDivision}
          secondaryReason={secondaryReason}
          errors={errors}
          onCategoryMode1Change={handleCategoryMode1Change}
          onPrimaryDivisionChange={handlePrimaryDivisionChange}
          onPrimaryReasonChange={(val) => {
            setPrimaryReason(val);
            if (errors.primaryReason) setErrors((prev) => ({ ...prev, primaryReason: "" }));
          }}
          onCategoryMode2Change={handleCategoryMode2Change}
          onSecondaryDivisionChange={handleSecondaryDivisionChange}
          onSecondaryReasonChange={(val) => {
            setSecondaryReason(val);
            if (errors.secondaryReason) setErrors((prev) => ({ ...prev, secondaryReason: "" }));
          }}
          onPrev={() => {
            setCurrentStep(2);
            scrollToTop();
          }}
          onNext={handleNextFromStep3}
        />
      )}

      {currentStep === 4 && (
        <RegistrationCvSection
          file={cvFile}
          error={fileError || errors.cvFile}
          agreement={cvAgreement}
          agreementError={errors.cvAgreement}
          isSubmitting={isSubmitting}
          maxSizeBytes={MAX_FILE_SIZE}
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          onAgreementChange={(val) => {
            setCvAgreement(val);
            if (errors.cvAgreement) setErrors((prev) => ({ ...prev, cvAgreement: "" }));
          }}
          onPrev={() => {
            setCurrentStep(3);
            scrollToTop();
          }}
          onSubmit={handleSubmit}
        />
      )}

      {currentStep === 5 && submissionSuccess && (
        <RegistrationSuccessSection
          data={submissionSuccess}
          onReset={handleReset}
        />
      )}
    </div>
  );
};
