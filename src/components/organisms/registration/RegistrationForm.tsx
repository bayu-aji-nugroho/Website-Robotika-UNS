/*
-----------------------------------------
nama file: [ RegistrationForm.tsx ] 
fungsi [ Komponen container utama formulir pendaftaran 6 langkah: Syarat -> Akun Google -> Identitas -> Divisi -> Berkas CV -> Selesai. Menerapkan aturan immutability: data yang sudah disimpan terkunci permanen dan tidak dapat diubah lagi. ]
-----------------------------------------------
*/

"use client";

import React from "react";
import {
  RegistrationStepper,
  RegistrationStepItem,
  AdminWhatsAppButton,
} from "@/src/components/molecules";
import { RegistrationRequirementsSection } from "./RegistrationRequirementsSection";
import { RegistrationAuthSection } from "./RegistrationAuthSection";
import { RegistrationPersonalSection } from "./RegistrationPersonalSection";
import { RegistrationDivisionSection } from "./RegistrationDivisionSection";
import { RegistrationCvSection } from "./RegistrationCvSection";
import { RegistrationSuccessSection } from "./RegistrationSuccessSection";
import { RegistrationConfirmModals } from "./RegistrationConfirmModals";
import { useRegistrationForm } from "./useRegistrationForm";
import { MAX_FILE_SIZE } from "./registrationValidation";
import { registrationSteps } from "@/data/registration";
import { CheckCircle2 } from "lucide-react";

const REGISTRATION_STEPS: RegistrationStepItem[] = registrationSteps;

export const RegistrationForm: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    maxReachableStep,
    handleStepClick,
    scrollToTop,
    restoreMessage,
    isFullySubmitted,
    isIdentityLocked,
    isDivisionLocked,
    agreedToRequirements,
    setAgreedToRequirements,
    requirementsError,
    setRequirementsError,
    handleNextFromStep1,
    authUser,
    setAuthUser,
    handleNextFromStep2,
    fullName,
    setFullName,
    nim,
    setNim,
    prodi,
    setProdi,
    angkatan,
    setAngkatan,
    whatsapp,
    setWhatsapp,
    handleNextFromStep3,
    executeSaveStep3,
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
    cvFile,
    fileError,
    cvAgreement,
    setCvAgreement,
    handleFileSelect,
    handleFileRemove,
    handleSubmit,
    executeFinalSubmit,
    submissionSuccess,
    handleReset,
    errors,
    setErrors,
    isSavingStep,
    isSubmitting,
    confirmModalType,
    setConfirmModalType,
    getDivisionName,
  } = useRegistrationForm();

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

      {/* Kartu Bantuan WhatsApp Panitia Khusus Langkah 1-5 (Sebelum Finalisasi) */}
      {currentStep < 6 && <AdminWhatsAppButton variant="card" />}

      {/* Modal Dialog Konfirmasi Simpan Permanen & Finalisasi */}
      <RegistrationConfirmModals
        confirmModalType={confirmModalType}
        isSavingStep={isSavingStep}
        isSubmitting={isSubmitting}
        onClose={() => setConfirmModalType(null)}
        onConfirmStep3={executeSaveStep3}
        onConfirmStep4={executeSaveStep4}
        onConfirmSubmit={executeFinalSubmit}
        fullName={fullName}
        nim={nim}
        prodi={prodi}
        angkatan={angkatan}
        whatsapp={whatsapp}
        categoryMode1={categoryMode1}
        primaryDivision={primaryDivision}
        categoryMode2={categoryMode2}
        secondaryDivision={secondaryDivision}
        cvFile={cvFile}
        getDivisionName={getDivisionName}
      />
    </div>
  );
};
