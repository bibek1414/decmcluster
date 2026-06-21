"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Download, Plus, Trash2, Pencil, Check, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { type CsvFile, stringifyCsv } from "@/lib/csv-storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface CsvViewerProps {
  file: CsvFile;
  onUpdateRows: (rows: Record<string, string>[]) => void;
}

export function CsvViewer({ file, onUpdateRows }: CsvViewerProps) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; header: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  
  const itemsPerPage = 12;

  // Track save status: when file changes, show saved.
  useEffect(() => {
    setIsSaved(true);
  }, [file]);

  // Filter rows by searching all fields
  const filteredRows = useMemo(() => {
    if (!query.trim()) return file.rows;
    const q = query.toLowerCase().trim();
    return file.rows.filter((row) => {
      return Object.values(row).some((val) => 
        String(val).toLowerCase().includes(q)
      );
    });
  }, [file.rows, query]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRows, currentPage]);

  // Cell Editing Handlers
  const handleStartEdit = (rowIndex: number, header: string, currentVal: string) => {
    setEditingCell({ rowIndex, header });
    setEditValue(currentVal);
  };

  const handleSaveCell = () => {
    if (!editingCell) return;
    const { rowIndex, header } = editingCell;
    
    // Check if value actually changed
    if (file.rows[rowIndex][header] === editValue) {
      setEditingCell(null);
      return;
    }

    setIsSaved(false);
    const updatedRows = [...file.rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [header]: editValue,
    };
    
    onUpdateRows(updatedRows);
    setEditingCell(null);
    toast.success("Cell updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  // Add Row Handler
  const handleAddRow = () => {
    setIsSaved(false);
    const newRow: Record<string, string> = {};
    
    file.headers.forEach((h) => {
      const lowerH = h.toLowerCase();
      if (lowerH.includes("id") || lowerH.includes("code")) {
        // Pre-fill a unique ID
        const prefix = lowerH.includes("center") ? "EC" : lowerH.includes("community") ? "COMM" : "ID";
        newRow[h] = `${prefix}-${Date.now().toString().slice(-4)}`;
      } else {
        newRow[h] = "";
      }
    });

    const updatedRows = [...file.rows, newRow];
    onUpdateRows(updatedRows);
    toast.success("New row added. Double click cells to edit.");

    // Move to the last page to show the new row
    const nextTotalPages = Math.ceil(updatedRows.length / itemsPerPage);
    setCurrentPage(nextTotalPages);
  };

  // Delete Row Handler
  const handleDeleteRow = (rowIndex: number) => {
    setIsSaved(false);
    const updatedRows = file.rows.filter((_, idx) => idx !== rowIndex);
    onUpdateRows(updatedRows);
    toast.success("Row deleted");
    
    // Adjust current page if the page became empty
    const nextTotalPages = Math.max(1, Math.ceil(updatedRows.length / itemsPerPage));
    if (currentPage > nextTotalPages) {
      setCurrentPage(nextTotalPages);
    }
  };

  // Export/Download File
  const handleExport = () => {
    try {
      const csvContent = stringifyCsv(file.headers, file.rows);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", file.name);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${file.name} successfully`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to export file");
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Save Status & Description */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border">
          <AlertCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          <span>Double-click any cell to edit the value. Press Enter to apply.</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isSaved ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Check className="h-3 w-3" /> Saved locally
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
              ● Unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-0 flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cells..."
            className="h-9 pl-9 w-full bg-background"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleAddRow} size="sm" variant="outline" className="h-9 font-bold gap-1.5 cursor-pointer">
            <Plus className="h-4 w-4" /> Add Row
          </Button>
          <Button onClick={handleExport} size="sm" className="h-9 font-bold gap-1.5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="h-4 w-4" /> Export CSV ({file.rows.length})
          </Button>
        </div>
      </div>

      {/* Spreadsheet Container */}
      <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
                {file.headers.map((h) => (
                  <TableHead key={h} className="font-bold text-foreground text-xs uppercase tracking-wider py-3.5 px-4 min-w-[140px]">
                    {h}
                  </TableHead>
                ))}
                <TableHead className="w-20 text-right font-bold text-foreground text-xs uppercase tracking-wider py-3.5 px-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={file.headers.length + 1} className="h-48 text-center text-muted-foreground text-xs">
                    No rows match the search query.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => {
                  const globalIdx = file.rows.indexOf(row);
                  return (
                    <TableRow key={globalIdx} className="hover:bg-muted/10 border-b border-border transition-colors">
                      {file.headers.map((h) => {
                        const isEditing = editingCell?.rowIndex === globalIdx && editingCell?.header === h;
                        const cellValue = row[h] ?? "";

                        return (
                          <TableCell
                            key={h}
                            className="text-xs py-2 px-4 h-12 cursor-pointer hover:bg-muted/30 transition-all relative group"
                            onDoubleClick={() => handleStartEdit(globalIdx, h, cellValue)}
                          >
                            {isEditing ? (
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveCell}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveCell();
                                  if (e.key === "Escape") handleCancelEdit();
                                }}
                                className="h-8 py-0.5 px-2 w-full bg-background border-primary focus-visible:ring-1 focus-visible:ring-primary text-xs rounded shadow-inner"
                                autoFocus
                              />
                            ) : (
                              <div className="flex items-center justify-between gap-1">
                                <span className="block truncate font-medium text-foreground max-w-[220px]" title={cellValue}>
                                  {cellValue !== "" ? (
                                    cellValue
                                  ) : (
                                    <span className="text-muted-foreground/30 italic">empty</span>
                                  )}
                                </span>
                                <Pencil className="h-3 w-3 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors shrink-0" />
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right py-2 px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRow(globalIdx)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                          title="Delete Row"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20 text-xs">
          <div className="text-muted-foreground font-medium">
            Showing <span className="font-bold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-bold text-foreground">
              {Math.min(currentPage * itemsPerPage, filteredRows.length)}
            </span>{" "}
            of <span className="font-bold text-foreground">{filteredRows.length}</span> records
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-muted-foreground px-1">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
