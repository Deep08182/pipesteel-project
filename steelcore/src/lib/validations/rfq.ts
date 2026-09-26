// RFQ and File Upload Validation Helpers

export const ALLOWED_FILE_EXTENSIONS = [
  "pdf",
  "dxf",
  "dwg",
  "step",
  "stp",
  "iges",
  "igs",
  "xlsx",
  "xls",
  "csv",
  "doc",
  "docx",
  "png",
  "jpg",
  "jpeg",
];

export const FORBIDDEN_EXTENSIONS = [
  "exe",
  "bat",
  "cmd",
  "sh",
  "bin",
  "msi",
  "js",
  "vbs",
  "scr",
  "pif",
  "com",
  "dll",
  "apk",
];

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
}

export function validateUploadFile(file: File): FileValidationResult {
  if (!file || !file.name) {
    return { valid: false, error: "No file provided" };
  }

  // 1. Check size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum allowed limit of 25MB.`,
    };
  }

  // 2. Check extension
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  if (FORBIDDEN_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Executable and script files (.${extension}) are strictly prohibited for industrial security.`,
    };
  }

  if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported file format (.${extension}). Please upload engineering drawings (PDF, DWG, DXF, STEP) or spreadsheets (XLSX, CSV).`,
    };
  }

  // 3. Sanitize file name
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  return {
    valid: true,
    sanitizedName,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
