/*
-----------------------------------------
nama file: [ FileUploadDropzone.tsx ] 
fungsi [ Komponen area unggah berkas (dropzone) yang mendukung fitur drag and drop dan pemilihan berkas PDF manual dengan batasan ukuran berkas, preview nama dan ukuran, opsi penggantian, serta tombol hapus. ]
-----------------------------------------------
*/

import React, { useRef } from "react";
import { FileText, X } from "lucide-react";
import { ErrorMessage } from "../atoms";

export interface FileUploadDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  error?: string | null;
  maxSizeBytes?: number;
  className?: string;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  file,
  onFileSelect,
  onFileRemove,
  error,
  maxSizeBytes = 1024 * 1024,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileSelect(selected);
    }
  };

  const maxSizeFormatted = `${(maxSizeBytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className={`space-y-2.5 ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="hidden"
        id="cv-file-upload"
      />

      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.files?.[0];
            if (dropped) onFileSelect(dropped);
          }}
          className={`p-3.5 sm:p-5 rounded-lg sm:rounded-xl border border-dashed text-center cursor-pointer transition-colors ${
            error
              ? "border-[#B22234] bg-red-50/30 dark:bg-red-950/30"
              : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60 hover:border-zinc-400 dark:hover:border-zinc-600"
          }`}
        >
          <div className="space-y-1.5 sm:space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Tekan untuk memilih atau seret berkas CV (PDF) ke sini
            </p>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400">
              Format didukung: <strong>PDF (.pdf)</strong> • Batas ukuran <strong>{maxSizeFormatted}</strong>
            </p>
            <div className="pt-0.5 sm:pt-1">
              <span
                className="inline-flex items-center justify-center min-h-[36px] sm:min-h-[40px] px-4 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-2xs"
              >
                Pilih Berkas PDF
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 sm:p-4 rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50/40 dark:bg-green-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
            <FileText className="w-5 h-5 text-[#16a34a] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{file.name}</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                {formatSize(file.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 min-h-[36px] text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={onFileRemove}
              className="w-9 h-9 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-[#B22234] dark:hover:text-red-400 rounded-md cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/40"
              aria-label="Hapus file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

      )}

      {error && <ErrorMessage message={error} />}
    </div>
  );
};
