"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Upload, GitMerge, Trash2, RefreshCw, FileSpreadsheet, Plus, X, FileText, CheckSquare, Square } from "lucide-react";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { CsvViewer } from "@/components/(admin)/assessment/csv-viewer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  getFilesForAssessment,
  saveFilesForAssessment,
  mergeFiles,
  parseCsvText,
  ASSESSMENT_SCHEMAS,
  type CsvFile
} from "@/lib/csv-storage";
import { getAssessment } from "@/lib/mock-data";
import { toast } from "sonner";

export default function AssessmentCsvPage() {
  const params = useParams();
  const id = params.id as string;
  const assessment = getAssessment(id);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [files, setFiles] = useState<CsvFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);
  
  // Merge Modal States
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [mergeFileName, setMergeFileName] = useState("");
  const [deduplicate, setDeduplicate] = useState(true);

  // Load files on mount
  useEffect(() => {
    const loaded = getFilesForAssessment(id);
    setFiles(loaded);
    if (loaded.length > 0) {
      setSelectedFileId(loaded[0].id);
    }
  }, [id]);

  // Find active file
  const activeFile = useMemo(() => {
    return files.find((f) => f.id === selectedFileId) || null;
  }, [files, selectedFileId]);

  if (!assessment) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <div className="bg-card border border-border rounded-2xl mx-auto max-w-md py-16 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">Assessment Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            The assessment with ID <code className="bg-muted px-1.5 py-0.5 rounded font-mono">{id}</code> may have been deleted or moved.
          </p>
          <Button asChild className="mt-2 font-bold cursor-pointer">
            <Link href="/assement">Back to assessments</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Update rows for a specific file
  const handleUpdateRows = (fileId: string, updatedRows: Record<string, string>[]) => {
    const updatedFiles = files.map((f) => {
      if (f.id === fileId) {
        return {
          ...f,
          rowCount: updatedRows.length,
          rows: updatedRows,
        };
      }
      return f;
    });
    setFiles(updatedFiles);
    saveFilesForAssessment(id, updatedFiles);
  };

  // Toggle selection for merge
  const handleToggleMergeSelect = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting the active file when checking merge box
    setSelectedForMerge((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  // Trigger file upload
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Parse and save uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const { headers, rows } = parseCsvText(text);

        if (headers.length === 0) {
          toast.error("Invalid CSV structure or empty file.");
          return;
        }

        const schema = ASSESSMENT_SCHEMAS[id];
        const hasMatchingHeaders = schema && schema.headers.every(h => headers.includes(h));
        if (schema && !hasMatchingHeaders) {
          toast.warning("Uploaded headers do not fully align with assessment standards, but we have imported the raw file.");
        }

        const newFile: CsvFile = {
          id: `uploaded_${Date.now()}`,
          name: file.name.endsWith(".csv") ? file.name : `${file.name}.csv`,
          rowCount: rows.length,
          headers,
          rows,
          createdAt: new Date().toISOString(),
        };

        const updatedFiles = [...files, newFile];
        setFiles(updatedFiles);
        saveFilesForAssessment(id, updatedFiles);
        setSelectedFileId(newFile.id);
        toast.success(`Uploaded "${file.name}" with ${rows.length} rows`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse the uploaded CSV file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset file input
  };

  // Delete a CSV file version
  const handleDeleteFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedFiles = files.filter((f) => f.id !== fileId);
    setFiles(updatedFiles);
    saveFilesForAssessment(id, updatedFiles);

    // If active file is deleted, select another one
    if (selectedFileId === fileId) {
      setSelectedFileId(updatedFiles[0]?.id || null);
    }
    // Remove from merge selection
    setSelectedForMerge((prev) => prev.filter((id) => id !== fileId));
    toast.success("File version deleted");
  };

  // Reset to default seeded versions
  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all CSV versions? This will delete any custom edits, merges, or uploads.")) {
      const seeded = getFilesForAssessment(id); // Generates defaults if stored is wiped
      // In order to force seed defaults, we delete the item and reload
      localStorage.removeItem(`decm_assessment_csv_${id}`);
      const refreshed = getFilesForAssessment(id);
      setFiles(refreshed);
      setSelectedFileId(refreshed[0]?.id || null);
      setSelectedForMerge([]);
      toast.success("Reset to default versions");
    }
  };

  // Open merge modal
  const openMergeModal = () => {
    if (selectedForMerge.length < 2) {
      toast.error("Please select at least 2 versions to merge");
      return;
    }
    
    // Determine default name suggestions
    const cleanAssessmentName = assessment.name.replace(/^\d+\.\s*/, "");
    setMergeFileName(`${cleanAssessmentName} - Merged Data.csv`);
    setIsMergeModalOpen(true);
  };

  // Execute Merge
  const executeMerge = () => {
    if (!mergeFileName.trim()) {
      toast.error("Please provide a name for the merged file");
      return;
    }

    try {
      const merged = mergeFiles(id, selectedForMerge, mergeFileName, deduplicate);
      
      // Reload from storage
      const refreshed = getFilesForAssessment(id);
      setFiles(refreshed);
      setSelectedFileId(merged.id);
      setSelectedForMerge([]);
      setIsMergeModalOpen(false);
      
      toast.success(`Successfully merged ${selectedForMerge.length} versions into "${merged.name}"`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to merge files");
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Hidden Upload Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv"
        className="hidden"
      />

      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        
        {/* Back Link */}
        <Link
          href={`/assement/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to details page
        </Link>

        {/* Page Header */}
        <PageHeader
          title="CSV Version Management"
          description={
            <div className="flex flex-col gap-0.5">
              <span>View, edit, upload and merge different years or version copies for:</span>
              <span className="font-extrabold text-foreground mt-0.5">{assessment.name}</span>
            </div>
          }
          actions={
            <Button asChild variant="outline" className="cursor-pointer font-bold h-9">
              <Link href={`/assement/${id}`}>Details View</Link>
            </Button>
          }
        />

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar: Version List */}
          <Card className="lg:col-span-4 p-5 border border-border bg-muted/10 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                Data Versions
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetToDefaults}
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Reset to original datasets"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Version List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {files.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No CSV versions found. Reset or upload a file.
                </div>
              ) : (
                files.map((file) => {
                  const isSelected = file.id === selectedFileId;
                  const isChecked = selectedForMerge.includes(file.id);

                  return (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFileId(file.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-primary/5 border-primary/30"
                          : "border-border bg-card hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Checkbox for Merge */}
                        <div
                          onClick={(e) => handleToggleMergeSelect(file.id, e)}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-input bg-card transition-colors hover:border-primary"
                        >
                          {isChecked ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground/30" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-foreground group-hover:text-primary transition-colors">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {file.rowCount} rows · {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteFile(file.id, e)}
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 rounded-md shrink-0 transition-opacity"
                        title="Delete Version"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-2 pt-3 border-t border-border">
              <Button
                onClick={openMergeModal}
                disabled={selectedForMerge.length < 2}
                className="w-full h-9 font-bold gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                <GitMerge className="h-4 w-4" />
                Merge Selected ({selectedForMerge.length})
              </Button>
              <Button
                onClick={triggerFileUpload}
                variant="outline"
                className="w-full h-9 font-bold gap-2 cursor-pointer border-border hover:bg-muted"
              >
                <Upload className="h-4 w-4" />
                Upload CSV File
              </Button>
            </div>
          </Card>

          {/* Right Area: Grid Viewer */}
          <div className="lg:col-span-8 space-y-4">
            {activeFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {activeFile.name}
                    </h2>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Version ID: {activeFile.id} · Created on {new Date(activeFile.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <CsvViewer
                  file={activeFile}
                  onUpdateRows={(newRows) => handleUpdateRows(activeFile.id, newRows)}
                />
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-border bg-card/50">
                <FileSpreadsheet className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <h3 className="text-sm font-bold text-foreground">No File Selected</h3>
                <p className="text-xs text-muted-foreground max-w-xs mt-1">
                  Select a version from the left panel, upload a CSV file from your device, or merge multiple versions to start editing.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Merge Modal Overlay */}
      {isMergeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <GitMerge className="h-4 w-4 text-blue-600" />
                Merge Data Versions
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMergeModalOpen(false)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-xs text-muted-foreground leading-relaxed bg-blue-500/5 border border-blue-500/10 p-3 rounded-lg">
                You are combining <span className="font-bold text-foreground">{selectedForMerge.length} file versions</span> together. Rows will be appended sequentially.
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Merged File Name
                </label>
                <Input
                  value={mergeFileName}
                  onChange={(e) => setMergeFileName(e.target.value)}
                  placeholder="e.g. Evacuation Center - Merged Data.csv"
                  className="w-full bg-background h-9 text-xs"
                />
              </div>

              {/* Options */}
              <div className="flex items-center gap-2 pt-1">
                <div
                  onClick={() => setDeduplicate(!deduplicate)}
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input bg-card cursor-pointer"
                >
                  {deduplicate ? (
                    <CheckSquare className="h-3 w-3 text-primary" />
                  ) : (
                    <Square className="h-3 w-3 text-muted-foreground/30" />
                  )}
                </div>
                <label
                  onClick={() => setDeduplicate(!deduplicate)}
                  className="text-xs font-semibold text-muted-foreground cursor-pointer select-none"
                >
                  Deduplicate exact matching rows
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setIsMergeModalOpen(false)}
                className="h-9 font-bold cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={executeMerge}
                className="h-9 font-bold cursor-pointer text-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                Merge Files
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
