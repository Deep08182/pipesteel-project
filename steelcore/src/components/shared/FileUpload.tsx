"use client";

import React, { useState, useRef } from "react";
import { Attachment } from "@/types";
import { validateUploadFile, formatFileSize, ALLOWED_FILE_EXTENSIONS } from "@/lib/validations/rfq";
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, X, FileSpreadsheet, FileCode } from "lucide-react";

interface FileUploadProps {
  onFilesSelected: (attachments: Attachment[]) => void;
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, maxFiles = 5 }) => {
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Attachment[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const newAttachments: Attachment[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (uploadedFiles.length + newAttachments.length >= maxFiles) {
        setErrorMessage(`Maximum upload limit is ${maxFiles} files per RFQ.`);
        break;
      }

      const validation = validateUploadFile(file);
      if (!validation.valid) {
        setErrorMessage(validation.error || "Invalid file format.");
        return;
      }

      const newAtt: Attachment = {
        id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        file_name: validation.sanitizedName || file.name,
        file_url: `/uploads/drawings/${validation.sanitizedName || file.name}`,
        file_type: file.type || "application/octet-stream",
        file_size: file.size,
        created_at: new Date().toISOString(),
      };

      newAttachments.push(newAtt);
    }

    const updated = [...uploadedFiles, ...newAttachments];
    setUploadedFiles(updated);
    onFilesSelected(updated);
  };

  const removeFile = (id: string) => {
    const filtered = uploadedFiles.filter((f) => f.id !== id);
    setUploadedFiles(filtered);
    onFilesSelected(filtered);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "xlsx" || ext === "xls" || ext === "csv") {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    }
    if (ext === "dwg" || ext === "dxf" || ext === "step" || ext === "stp") {
      return <FileCode className="w-5 h-5 text-orange-400" />;
    }
    return <FileText className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-orange-500 bg-orange-950/20"
            : "border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-900/80"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept={ALLOWED_FILE_EXTENSIONS.map((e) => `.${e}`).join(",")}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-orange-400 border border-slate-700">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Click to browse or drop CAD drawings & BoQ files here
            </p>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Supported: PDF, DWG, DXF, STEP, STP, XLSX, CSV (Max 25MB each)
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs p-3 rounded bg-red-950/50 border border-red-800 text-red-300 font-mono">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase text-slate-400 font-semibold">
            Attached Documents ({uploadedFiles.length})
          </p>
          <div className="space-y-1.5">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2.5 rounded bg-slate-800 border border-slate-700 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  {getFileIcon(file.file_name)}
                  <div className="truncate">
                    <p className="font-semibold text-white truncate">{file.file_name}</p>
                    <p className="text-slate-400 font-mono text-[11px]">{formatFileSize(file.file_size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Validated
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="text-slate-400 hover:text-red-400 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
