"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Pencil,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Loader2,
  Plus,
  X,
  Trash2,
  Upload,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { dynamicDataService } from "@/services/dynamic-data";
import {
  useDynamicData,
  useCreateDynamicRecord,
  useUpdateDynamicRecord,
  useDeleteDynamicRecord,
  useImportDynamicRecord,
} from "@/hooks/use-dynamic-data";
import {
  EVACUATION_CENTRE_COLUMNS,
  EvacuationCentreFormFields,
} from "./fields/evacuation-centre-form-fields";
import {
  DISPLACEMENT_COLUMNS,
  DisplacementFormFields,
} from "./fields/displacement-form-fields";

interface DynamicDataTableProps {
  slug: string;
  token: string | null;
  canEdit: boolean;
}

export function DynamicDataTable({
  slug,
  token,
  canEdit,
}: DynamicDataTableProps) {
  const isEvac = slug === "evacuation-centre-assessment-form";
  const columns = isEvac ? EVACUATION_CENTRE_COLUMNS : DISPLACEMENT_COLUMNS;
  const queryClient = useQueryClient();

  // Pagination & Search States
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filters State
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState("");
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("");
  const [selectedOpFilter, setSelectedOpFilter] = useState("");

  // Debounce search input to avoid spamming server
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 450);
    return () => clearTimeout(handler);
  }, [search]);

  // TanStack Query for Dynamic Paginated Fetching
  const { data, isLoading, isError } = useDynamicData(
    slug,
    page,
    debouncedSearch,
    selectedProvinceFilter,
    selectedDistrictFilter,
    selectedOpFilter,
    token,
    50,
  );

  const createRecord = useCreateDynamicRecord(slug, token);
  const updateRecord = useUpdateDynamicRecord(slug, token);
  const deleteRecord = useDeleteDynamicRecord(slug, token);
  const importRecord = useImportDynamicRecord(slug, token);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importRecord.mutateAsync(file);
      toast.success("Data imported successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to import data");
    } finally {
      setIsImporting(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Compute filter options dynamically from the current page's results
  // This prevents an extra duplicate API call on mount.
  const filterOptions = useMemo(() => {
    if (!data?.results) return { provinces: [], districts: [], operations: [] };

    const provKey = isEvac ? "province" : "admin1_name";
    const distKey = isEvac ? "area_council" : "admin2_name";
    const opKey = isEvac ? "compound_function" : "operation";

    return {
      provinces: Array.from(
        new Set(data.results.map((r: any) => r[provKey]).filter(Boolean)),
      ).sort() as string[],
      districts: Array.from(
        new Set(data.results.map((r: any) => r[distKey]).filter(Boolean)),
      ).sort() as string[],
      operations: Array.from(
        new Set(data.results.map((r: any) => r[opKey]).filter(Boolean)),
      ).sort() as string[],
    };
  }, [data, isEvac]);

  useEffect(() => {
    setPage(1);
    setSelectedProvinceFilter("");
    setSelectedDistrictFilter("");
    setSelectedOpFilter("");
    setSelectedRowIds([]);
    setSelectedExportColumns([]);
  }, [slug, token]);

  // Export Columns & Selected Rows
  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    [],
  );
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  // Cell Inline Editing (Single-Click)
  const [editingCell, setEditingCell] = useState<{
    rowId: number;
    key: string;
  } | null>(null);
  const [inlineEditValue, setInlineEditValue] = useState<any>("");

  // Modal creation & full record edit
  const [isCreating, setIsCreating] = useState(false);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [modalFormData, setModalFormData] = useState<any>({});
  const [activeModalTab, setActiveModalTab] = useState("general");
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Export Dropdown State
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target as Node)
      ) {
        setIsExportDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = data?.results || [];
  const count = data?.count || 0;
  const hasNext = !!data?.next;
  const hasPrev = !!data?.previous;
  const totalPages = Math.ceil(count / 50) || 1;

  // Inline edit start
  const handleInlineEditStart = (row: any, key: string, readonly?: boolean) => {
    if (!canEdit || readonly) return;
    setEditingCell({ rowId: row.id, key });
    setInlineEditValue(row[colKeyFor(key)] ?? row[key] ?? "");
  };

  const colKeyFor = (k: string) => k;

  const handleInlineEditSave = async () => {
    if (!editingCell) return;
    const { rowId, key } = editingCell;
    const column = columns.find((c) => c.key === key);

    let parsedVal = inlineEditValue;
    if (column?.type === "number") {
      parsedVal = inlineEditValue === "" ? null : Number(inlineEditValue);
    } else if (column?.type === "boolean") {
      if (inlineEditValue === "true") parsedVal = true;
      else if (inlineEditValue === "false") parsedVal = false;
      else parsedVal = null;
    } else {
      parsedVal = inlineEditValue === "" ? null : String(inlineEditValue);
    }

    setEditingCell(null);

    try {
      await updateRecord.mutateAsync({
        id: rowId,
        fields: { [key]: parsedVal },
      });
      queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
      toast.success("Field updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update record");
    }
  };

  // Full editor submit
  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingModal(true);
    try {
      if (isCreating) {
        await createRecord.mutateAsync(modalFormData);
        toast.success("Record created successfully");
        setIsCreating(false);
      } else if (editingRow) {
        await updateRecord.mutateAsync({
          id: editingRow.id,
          fields: modalFormData,
        });
        toast.success("Record updated successfully");
        setEditingRow(null);
      }
      queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to save changes");
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const openModalEditor = (row: any) => {
    setIsCreating(false);
    setEditingRow(row);
    const initialFields: any = {};
    columns.forEach((col) => {
      if (!col.readonly) {
        initialFields[col.key] = row[col.key] ?? "";
      }
    });
    setModalFormData(initialFields);
    setActiveModalTab(isEvac ? "general" : "general_displacement");
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingRow(null);
    const initialFields: any = {};
    columns.forEach((col) => {
      if (!col.readonly) {
        initialFields[col.key] =
          col.type === "boolean" ? "" : col.type === "number" ? "" : "";
      }
    });
    setModalFormData(initialFields);
    setActiveModalTab(isEvac ? "general" : "general_displacement");
  };

  const handleDeleteRow = async () => {
    if (!rowToDelete) return;
    setIsDeleting(true);
    try {
      await deleteRecord.mutateAsync(rowToDelete.id);
      toast.success("Record deleted successfully");
      setRowToDelete(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete record");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter((rowId) => rowId !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const handleSelectAllOnPage = () => {
    if (selectedRowIds.length === results.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(results.map((r) => r.id));
    }
  };

  // Perform on-demand fetch of filtered rows to perform clean complete CSV or Excel export
  const [loadingExport, setLoadingExport] = useState(false);

  const performExport = async () => {
    // If no columns are explicitly selected, export all columns
    const columnsToExport =
      selectedExportColumns.length > 0
        ? selectedExportColumns
        : columns.map((c) => c.key);
    setLoadingExport(true);
    try {
      let blob: Blob;
      if (isEvac) {
        blob = await dynamicDataService.exportEvacuationCentres(
          columnsToExport,
          token,
          selectedProvinceFilter,
          selectedDistrictFilter,
          selectedOpFilter,
          debouncedSearch,
        );
      } else {
        blob = await dynamicDataService.exportDisplacements(
          columnsToExport,
          token,
          selectedProvinceFilter,
          selectedDistrictFilter,
          selectedOpFilter,
          debouncedSearch,
        );
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${slug}_export.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Excel file exported successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to export data");
    } finally {
      setLoadingExport(false);
    }
  };



  return (
    <Card className="border border-border bg-card/65 backdrop-blur-sm rounded-2xl overflow-hidden shadow-none animate-fadeIn">
      {/* Table Actions Header */}
      <div className="p-4 border-b border-border flex flex-col gap-4 bg-muted/20">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search page/records..."
              className="pl-9 h-9 w-full rounded-xl bg-background border-border shadow-none text-xs"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedProvinceFilter}
              onChange={(e) => {
                setSelectedProvinceFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">All Provinces</option>
              {filterOptions.provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {canEdit && (
              <Button
                variant="default"
                size="sm"
                onClick={openCreateModal}
                className="h-9 gap-1.5 font-bold cursor-pointer rounded-xl shadow-none"
              >
                <Plus className="h-4 w-4" />
                Add Record
              </Button>
            )}

            {canEdit && (
              <>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isImporting}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 gap-1.5 font-bold cursor-pointer rounded-xl bg-blue-50/45 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 shadow-none"
                >
                  {isImporting ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Import
                </Button>
              </>
            )}

            {/* Export Dropdown */}
            <div className="relative" ref={exportDropdownRef}>
              <Button
                variant="outline"
                size="sm"
                disabled={loadingExport}
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                className="h-9 gap-1.5 font-bold cursor-pointer rounded-xl bg-green-50/45 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200/60 dark:border-green-900/60 hover:bg-green-50 dark:hover:bg-green-950/40 shadow-none"
              >
                {loadingExport ? (
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export
              </Button>
              {isExportDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl z-40 p-3 animate-fadeIn shadow-none space-y-1">
                  <div className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-wider px-1 pb-2 border-b border-border">
                    Export to Excel
                  </div>
                  <button
                    onClick={performExport}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/40 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>
                      Export (
                      {selectedExportColumns.length === 0
                        ? "all"
                        : selectedExportColumns.length}{" "}
                      columns)
                    </span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                      {count} rows
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table grid */}
      <div className="w-full overflow-x-auto relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground font-semibold mt-3">
              Loading records...
            </p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[300px]">
            <X className="h-8 w-8 text-rose-500 mb-2" />
            <p className="text-xs font-bold text-foreground">
              Failed to load data
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Please check your connection and credentials.
            </p>
          </div>
        )}

        {!isLoading && !isError && results.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[300px]">
            <Download className="h-8 w-8 text-muted-foreground/30 mb-2 animate-pulse" />
            <p className="text-xs font-bold text-foreground">
              No records found
            </p>
            <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
              No dynamic data records matched your current query or filter
              configuration.
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && results.length > 0 && (
          <Table className="border-collapse">
            <TableHeader className="bg-muted/45 border-b border-border">
              <TableRow>
                <TableHead className="w-12 text-center select-none pl-4">
                  <Checkbox
                    checked={
                      results.length > 0 &&
                      selectedRowIds.length === results.length
                    }
                    onCheckedChange={handleSelectAllOnPage}
                  />
                </TableHead>
                {columns.map((col) => {
                  const isExportSelected = selectedExportColumns.includes(
                    col.key,
                  );
                  return (
                    <TableHead
                      key={col.key}
                      className="text-xs font-semibold  py-3 px-4"
                    >
                      <div className="flex items-center gap-1.5 py-1">
                        <Checkbox
                          checked={isExportSelected}
                          onCheckedChange={() => {
                            if (isExportSelected) {
                              setSelectedExportColumns(
                                selectedExportColumns.filter(
                                  (c) => c !== col.key,
                                ),
                              );
                            } else {
                              setSelectedExportColumns([
                                ...selectedExportColumns,
                                col.key,
                              ]);
                            }
                          }}
                          title="Toggle export selection for this column"
                        />
                        <span>{col.label}</span>
                      </div>
                    </TableHead>
                  );
                })}
                {canEdit && (
                  <TableHead className="w-20 text-center text-xs font-extrabold text-muted-foreground">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((row: any) => (
                <TableRow
                  key={row.id}
                  className={`hover:bg-muted/30 border-b border-border transition-colors cursor-pointer ${
                    selectedRowIds.includes(row.id)
                      ? "bg-primary/5 hover:bg-primary/10"
                      : ""
                  }`}
                >
                  <TableCell className="text-center pl-4 select-none">
                    <Checkbox
                      checked={selectedRowIds.includes(row.id)}
                      onCheckedChange={() => handleSelectRow(row.id)}
                    />
                  </TableCell>
                  {columns.map((col) => {
                    const isEditing =
                      editingCell?.rowId === row.id &&
                      editingCell?.key === col.key;
                    const value = row[col.key];

                    return (
                      <TableCell
                        key={col.key}
                        onClick={(e) => {
                          if (isEditing) {
                            e.stopPropagation();
                            return;
                          }
                          handleInlineEditStart(row, col.key, col.readonly);
                        }}
                        className={`text-xs px-4 py-2 border-r border-border/40 max-w-[240px] truncate select-none ${
                          !col.readonly && canEdit
                            ? "cursor-cell hover:bg-muted/15 relative group"
                            : ""
                        }`}
                        title={
                          !col.readonly && canEdit
                            ? "Click to edit cell"
                            : col.label
                        }
                      >
                        {isEditing ? (
                          col.type === "boolean" ? (
                            <select
                              value={String(inlineEditValue)}
                              onChange={(e) =>
                                setInlineEditValue(e.target.value)
                              }
                              onBlur={handleInlineEditSave}
                              autoFocus
                              className="w-full h-7 rounded border border-ring bg-background text-[11px] focus:outline-none"
                            >
                              <option value="">-- Null --</option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          ) : (
                            <input
                              type={col.type === "number" ? "number" : "text"}
                              value={inlineEditValue}
                              onChange={(e) =>
                                setInlineEditValue(e.target.value)
                              }
                              onBlur={handleInlineEditSave}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleInlineEditSave();
                                if (e.key === "Escape") setEditingCell(null);
                              }}
                              autoFocus
                              className="w-full h-7 px-1.5 rounded border border-ring bg-background text-[11px] focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                          )
                        ) : (
                          <>
                            {value === null || value === undefined ? (
                              <span className="text-muted-foreground/35 italic"></span>
                            ) : typeof value === "boolean" ? (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  value
                                    ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                    : "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                                }`}
                              >
                                {value ? "True" : "False"}
                              </span>
                            ) : (
                              String(value)
                            )}
                          </>
                        )}
                      </TableCell>
                    );
                  })}
                  {canEdit && (
                    <TableCell className="text-center p-2">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openModalEditor(row)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md shadow-none cursor-pointer"
                          title="Edit all fields"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRowToDelete(row);
                          }}
                          className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-md shadow-none cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
        <span className="text-xs font-semibold text-muted-foreground">
          Showing{" "}
          <span className="text-foreground font-bold">
            {results.length === 0 ? 0 : (page - 1) * 50 + 1}
          </span>{" "}
          to{" "}
          <span className="text-foreground font-bold">
            {Math.min(page * 50, count)}
          </span>{" "}
          of <span className="text-foreground font-bold">{count}</span> records
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!hasPrev || isLoading}
            className="h-8 w-8 rounded-xl cursor-pointer shadow-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-bold text-foreground px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNext || isLoading}
            className="h-8 w-8 rounded-xl cursor-pointer shadow-none"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!rowToDelete}
        onOpenChange={(open) => {
          if (!open) setRowToDelete(null);
        }}
      >
        <DialogContent className="max-w-md w-full rounded-2xl border border-border bg-card shadow-none p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Delete Record
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed mt-2">
              Are you sure you want to delete this record (ID: {rowToDelete?.id}
              )? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-2">
            <Button
              variant="outline"
              onClick={() => setRowToDelete(null)}
              className="h-9 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteRow}
              disabled={isDeleting}
              className="h-9 font-bold cursor-pointer bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />{" "}
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Record Edit/Create Modal — Shadcn Dialog (ESC closes natively) */}
      <Dialog
        open={!!(editingRow || isCreating)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRow(null);
            setIsCreating(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl! w-full rounded-2xl border border-border bg-card shadow-none p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="text-base font-bold">
              {isCreating
                ? "Create New Record"
                : `Edit Record (ID: ${editingRow?.id})`}
            </DialogTitle>
            <DialogDescription className="text-[11px] text-muted-foreground font-semibold mt-0.5">
              {isCreating
                ? "Fill in the fields to register a new entry."
                : "Update specific categories of this record. Save to apply."}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pt-4 space-y-4 pb-6">
            {/* Modal Tabs */}
            {isEvac ? (
              <div className="flex flex-wrap gap-1.5 border-b border-border pb-3">
                {[
                  { key: "general", label: "General & Location" },
                  { key: "contact", label: "Contact Info" },
                  { key: "capacity", label: "Capacity & Buildings" },
                  { key: "readiness", label: "Readiness & Status" },
                  { key: "water_sanitation", label: "Water & Sanitation" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveModalTab(tab.key)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      activeModalTab === tab.key
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 border-b border-border pb-3">
                {[
                  { key: "general_displacement", label: "General Info" },
                  { key: "geography", label: "Geography" },
                  { key: "timeline", label: "Timeline" },
                  { key: "demographics", label: "Demographics" },
                  { key: "destination", label: "Origin & Destination" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveModalTab(tab.key)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      activeModalTab === tab.key
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleModalSave} className="space-y-4">
              {isEvac ? (
                <EvacuationCentreFormFields
                  activeModalTab={activeModalTab}
                  modalFormData={modalFormData}
                  setModalFormData={setModalFormData}
                />
              ) : (
                <DisplacementFormFields
                  activeModalTab={activeModalTab}
                  modalFormData={modalFormData}
                  setModalFormData={setModalFormData}
                />
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingRow(null);
                    setIsCreating(false);
                  }}
                  className="h-9 cursor-pointer rounded-xl shadow-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingModal}
                  className="h-9 font-bold cursor-pointer rounded-xl px-5 shadow-none"
                >
                  {isSubmittingModal ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isCreating ? (
                    "Create Entry"
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
