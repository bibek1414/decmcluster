"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, FileSpreadsheet, FileImage, File, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  helperText?: string;
}

export function FileUpload({
  selectedFile,
  onFileSelect,
  accept,
  helperText = "Drag & drop file here or click to browse",
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering file selection
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return FileText;
    if (["xlsx", "xls", "csv"].includes(ext || "")) return FileSpreadsheet;
    if (["png", "jpg", "jpeg", "svg", "webp"].includes(ext || "")) return FileImage;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const FileIcon = selectedFile ? getFileIcon(selectedFile.name) : File;

  return (
    <div className="w-full space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept={accept}
      />

      {selectedFile ? (
        <div className="flex items-center gap-3 p-3.5 bg-muted/30 rounded-xl border border-border/80 w-full animate-fadeIn transition-all">
          <div className="p-2.5 bg-background border border-border rounded-lg text-primary -sm">
            <FileIcon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-bold text-foreground truncate">{selectedFile.name}</p>
            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={cn(
            "relative border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all duration-300 bg-muted/10 hover:bg-muted/30 hover:border-muted-foreground/40",
            isDragActive && "border-primary bg-primary/5 scale-[1.01]",
          )}
        >
          <div
            className={cn(
              "p-3 rounded-full bg-background border border-border text-muted-foreground -sm transition-all duration-300",
              isDragActive && "scale-110 text-primary border-primary/30",
            )}
          >
            <UploadCloud className="h-6 w-6 animate-pulse" style={{ animationDuration: "3s" }} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground">{helperText}</p>
            {accept && (
              <p className="text-[10px] text-muted-foreground font-semibold">
                Supports: {accept.split(",").join(", ")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
