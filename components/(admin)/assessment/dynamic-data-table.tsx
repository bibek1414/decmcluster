"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Edit2,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Loader2,
  Plus,
  X,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dynamicDataService } from "@/services/dynamic-data";

interface DynamicDataTableProps {
  slug: string;
  token: string | null;
  canEdit: boolean;
}

const EVACUATION_CENTRE_COLUMNS = [
  { key: "id", label: "ID", type: "number", readonly: true },
  { key: "compound_name", label: "Compound Name", type: "text" },
  { key: "province", label: "Province", type: "text" },
  { key: "area_council", label: "Area Council", type: "text" },
  { key: "island", label: "Island", type: "text" },
  { key: "village", label: "Village", type: "text" },
  { key: "country", label: "Country", type: "text" },
  { key: "organization", label: "Organization", type: "text" },
  { key: "agency", label: "Agency", type: "text" },
  { key: "latitude", label: "Latitude", type: "number" },
  { key: "longitude", label: "Longitude", type: "number" },
  { key: "primary_contact", label: "Primary Contact", type: "text" },
  { key: "secondary_contact", label: "Secondary Contact", type: "text" },
  { key: "compound_function", label: "Compound Function", type: "text" },
  { key: "is_ec_owner_approved", label: "EC Owner Approved", type: "boolean" },
  { key: "is_ec_govt_approved", label: "EC Govt Approved", type: "boolean" },
  {
    key: "name_of_outside_temporary_shelter",
    label: "Outside Temp Shelter Name",
    type: "text",
  },
  {
    key: "outside_temporary_shelter_capacity",
    label: "Outside Shelter Capacity",
    type: "number",
  },
  {
    key: "first_aid_kit_availability",
    label: "First Aid Kit Available",
    type: "boolean",
  },
  {
    key: "first_aid_trained_person",
    label: "First Aid Trained Person",
    type: "boolean",
  },
  { key: "electricity_source", label: "Electricity Source", type: "text" },
  {
    key: "drinking_water_source",
    label: "Drinking Water Source",
    type: "text",
  },
  { key: "washing_water_source", label: "Washing Water Source", type: "text" },
  {
    key: "water_storage_capacity_litres",
    label: "Water Storage Capacity (L)",
    type: "number",
  },
  { key: "no_of_buildings", label: "No. of Buildings", type: "number" },
  { key: "no_of_rooms", label: "No. of Rooms", type: "number" },
  {
    key: "internal_building_evacuee_capacity",
    label: "Internal Evacuee Capacity",
    type: "number",
  },
  {
    key: "disaster_suitable_for",
    label: "Disaster Suitable For",
    type: "text",
  },
  {
    key: "enginerring_certified_cyclone_rating",
    label: "Certified Cyclone Rating",
    type: "text",
  },
  { key: "total_mens_toilet", label: "Total Men's Toilet", type: "number" },
  { key: "total_womens_toilet", label: "Total Women's Toilet", type: "number" },
  { key: "total_unisex_toilet", label: "Total Unisex Toilet", type: "number" },
  {
    key: "total_disability_access_toilet",
    label: "Total Disability Toilet",
    type: "number",
  },
  { key: "total_mens_shower", label: "Total Men's Shower", type: "number" },
  { key: "total_womens_shower", label: "Total Women's Shower", type: "number" },
  { key: "total_unisex_shower", label: "Total Unisex Shower", type: "number" },
  {
    key: "total_disability_access_shower",
    label: "Total Disability Shower",
    type: "number",
  },
  {
    key: "kitchen_cooking_facilities",
    label: "Kitchen Cooking Facilities",
    type: "boolean",
  },
  { key: "laundry_facilities", label: "Laundry Facilities", type: "boolean" },
  { key: "communication_back_up", label: "Communication Backup", type: "text" },
];

const DISPLACEMENT_COLUMNS = [
  { key: "id", label: "ID", type: "number", readonly: true },
  { key: "operation", label: "Operation", type: "text" },
  { key: "operation_code", label: "Operation Code", type: "text" },
  { key: "admin0_name", label: "Country (Admin0)", type: "text" },
  { key: "admin0_pcode", label: "Country Pcode (Admin0)", type: "text" },
  { key: "admin1_name", label: "Province (Admin1)", type: "text" },
  { key: "admin1_pcode", label: "Province Pcode (Admin1)", type: "text" },
  { key: "admin2_name", label: "District (Admin2)", type: "text" },
  { key: "admin2_pcode", label: "District Pcode (Admin2)", type: "text" },
  { key: "admin_level", label: "Admin Level", type: "number" },
  { key: "num_present_idps", label: "No. of Present IDPs", type: "number" },
  { key: "reporting_date", label: "Reporting Date", type: "text" },
  { key: "reporting_year", label: "Reporting Year", type: "number" },
  { key: "reporting_month", label: "Reporting Month", type: "number" },
  { key: "round_number", label: "Round Number", type: "number" },
  { key: "displacement_reason", label: "Displacement Reason", type: "text" },
  { key: "males_number", label: "Males Number", type: "number" },
  { key: "female_number", label: "Females Number", type: "number" },
  { key: "males_number_0_4", label: "Males 0-4", type: "number" },
  { key: "females_number_0_4", label: "Females 0-4", type: "number" },
  { key: "males_number_5_17", label: "Males 5-17", type: "number" },
  { key: "females_number_5_17", label: "Females 5-17", type: "number" },
  { key: "males_number_18_59", label: "Males 18-59", type: "number" },
  { key: "females_number_18_59", label: "Females 18-59", type: "number" },
  { key: "males_number_60_plus", label: "Males 60+", type: "number" },
  { key: "females_number_60_plus", label: "Females 60+", type: "number" },
  { key: "total_vul_hhs", label: "Total Vul HHs", type: "number" },
  { key: "idp_origin_admin1_name", label: "Origin Admin1 Name", type: "text" },
  {
    key: "idp_origin_admin1_pcode",
    label: "Origin Admin1 Pcode",
    type: "text",
  },
  { key: "assessment_type", label: "Assessment Type", type: "text" },
  { key: "operation_status", label: "Operation Status", type: "text" },
  { key: "idp_destination", label: "IDP Destination", type: "text" },
  {
    key: "idp_destination_admin1_name",
    label: "Destination Admin1 Name",
    type: "text",
  },
  {
    key: "idp_destination_admin1_pcode",
    label: "Destination Admin1 Pcode",
    type: "text",
  },
];

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
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "dynamic-data",
      slug,
      page,
      debouncedSearch,
      selectedProvinceFilter,
      selectedDistrictFilter,
      selectedOpFilter,
      token,
    ],
    queryFn: async () => {
      if (isEvac) {
        return dynamicDataService.fetchEvacuationCentres(
          page,
          debouncedSearch,
          token,
          selectedProvinceFilter,
          selectedDistrictFilter,
          selectedOpFilter,
        );
      } else {
        return dynamicDataService.fetchDisplacements(
          page,
          debouncedSearch,
          token,
          selectedProvinceFilter,
          selectedDistrictFilter,
          selectedOpFilter,
        );
      }
    },
  });

  // Background Options state for filter dropdowns (fetched once per slug to get distinct values)
  const [filterOptions, setFilterOptions] = useState<{
    provinces: string[];
    districts: string[];
    operations: string[];
  }>({ provinces: [], districts: [], operations: [] });

  const fetchFilterOptions = async () => {
    try {
      let allResults: any[] = [];
      const fetchFn = isEvac
        ? dynamicDataService.fetchEvacuationCentres
        : dynamicDataService.fetchDisplacements;

      const firstPage = await fetchFn(1, "", token);
      allResults = [...(firstPage.results || [])];
      const totalCount = firstPage.count || 0;
      const size = firstPage.results?.length || 10;

      if (size > 0 && totalCount > size) {
        const totalPages = Math.ceil(totalCount / size);
        const promises = [];
        for (let p = 2; p <= totalPages; p++) {
          promises.push(fetchFn(p, "", token));
        }
        const remainingPages = await Promise.all(promises);
        remainingPages.forEach((pageRes) => {
          allResults.push(...(pageRes.results || []));
        });
      }

      // Compute distinct keys
      const provKey = isEvac ? "province" : "admin1_name";
      const distKey = isEvac ? "area_council" : "admin2_name";
      const opKey = isEvac ? "compound_function" : "operation";

      const provs = Array.from(
        new Set(allResults.map((r) => r[provKey]).filter(Boolean)),
      ).sort() as string[];
      const dists = Array.from(
        new Set(allResults.map((r) => r[distKey]).filter(Boolean)),
      ).sort() as string[];
      const ops = Array.from(
        new Set(allResults.map((r) => r[opKey]).filter(Boolean)),
      ).sort() as string[];

      setFilterOptions({ provinces: provs, districts: dists, operations: ops });
    } catch (e) {
      console.error("Failed to load background filter options", e);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
    setPage(1);
    setSelectedProvinceFilter("");
    setSelectedDistrictFilter("");
    setSelectedOpFilter("");
    setSelectedRowIds([]);
    setSelectedExportColumns(columns.map((c) => c.key));
  }, [slug, token]);

  // Export Columns & Selected Rows
  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    columns.map((c) => c.key),
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
  const totalPages = Math.ceil(count / 10) || 1;

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
      if (isEvac) {
        await dynamicDataService.updateEvacuationCentre(
          rowId,
          { [key]: parsedVal },
          token,
        );
      } else {
        await dynamicDataService.updateDisplacement(
          rowId,
          { [key]: parsedVal },
          token,
        );
      }
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
        if (isEvac) {
          await dynamicDataService.createEvacuationCentre(modalFormData, token);
        } else {
          await dynamicDataService.createDisplacement(modalFormData, token);
        }
        toast.success("Record created successfully");
        setIsCreating(false);
      } else if (editingRow) {
        if (isEvac) {
          await dynamicDataService.updateEvacuationCentre(
            editingRow.id,
            modalFormData,
            token,
          );
        } else {
          await dynamicDataService.updateDisplacement(
            editingRow.id,
            modalFormData,
            token,
          );
        }
        toast.success("Record updated successfully");
        setEditingRow(null);
      }
      queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
      fetchFilterOptions(); // update filters options
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
  const performExport = async (
    format: "csv" | "excel",
    onlySelected: boolean,
  ) => {
    setLoadingExport(true);
    try {
      let exportRows: any[] = [];
      if (onlySelected) {
        // Fetch matching selected rows by querying them or mapping current local ones
        // To be safe, we can just grab from all pages matching currently selected IDs
        // E.g., we fetch all records with filters, and then filter by selected IDs
        const allFiltered = await fetchAllFilteredOnDemand();
        exportRows = allFiltered.filter((r) => selectedRowIds.includes(r.id));
      } else {
        exportRows = await fetchAllFilteredOnDemand();
      }

      if (exportRows.length === 0) {
        toast.warning("No records found to export");
        return;
      }

      const exportCols = columns.filter((c) =>
        selectedExportColumns.includes(c.key),
      );

      if (format === "csv") {
        const headers = exportCols
          .map((c) => `"${c.label.replace(/"/g, '""')}"`)
          .join(",");
        const rows = exportRows.map((row) =>
          exportCols
            .map((c) => {
              const val = row[c.key];
              if (val === null || val === undefined) return '""';
              if (typeof val === "boolean") return val ? '"True"' : '"False"';
              return `"${String(val).replace(/"/g, '""')}"`;
            })
            .join(","),
        );

        const csvContent = "\uFEFF" + [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${slug}_export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("CSV file exported successfully");
      } else {
        // Excel format using SpreadsheetML/HTML
        const headersHtml = exportCols
          .map(
            (c) =>
              `<th style="background-color: #f3f4f6; font-weight: bold; border: 1px solid #d1d5db; padding: 6px;">${c.label}</th>`,
          )
          .join("");
        const rowsHtml = exportRows
          .map((row) => {
            return `<tr>${exportCols
              .map((c) => {
                const val = row[c.key];
                const displayVal =
                  val === null || val === undefined
                    ? ""
                    : typeof val === "boolean"
                      ? val
                        ? "True"
                        : "False"
                      : String(val);
                return `<td style="border: 1px solid #d1d5db; padding: 6px;">${displayVal}</td>`;
              })
              .join("")}</tr>`;
          })
          .join("");

        const htmlContent = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta charset="utf-8" />
            <!--[if gte mso 9]>
            <xml>
              <x:ExcelWorkbook>
                <x:ExcelWorksheets>
                  <x:ExcelWorksheet>
                    <x:Name>Data Export</x:Name>
                    <x:WorksheetOptions>
                      <x:DisplayGridlines/>
                    </x:WorksheetOptions>
                  </x:ExcelWorksheet>
                </x:ExcelWorksheets>
              </x:ExcelWorkbook>
            </xml>
            <![endif]-->
          </head>
          <body>
            <table>
              <thead>
                <tr>${headersHtml}</tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </body>
          </html>
        `;

        const blob = new Blob([htmlContent], {
          type: "application/vnd.ms-excel;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${slug}_export.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Excel file exported successfully");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to export data");
    } finally {
      setLoadingExport(false);
      setIsExportDropdownOpen(false);
    }
  };

  const [loadingExport, setLoadingExport] = useState(false);

  // Helper to fetch all filtered pages on demand
  const fetchAllFilteredOnDemand = async () => {
    let allResults: any[] = [];
    const fetchFn = isEvac
      ? dynamicDataService.fetchEvacuationCentres
      : dynamicDataService.fetchDisplacements;

    const firstPage = await fetchFn(
      1,
      debouncedSearch,
      token,
      selectedProvinceFilter,
      selectedDistrictFilter,
      selectedOpFilter,
    );
    allResults = [...(firstPage.results || [])];
    const totalCount = firstPage.count || 0;
    const size = firstPage.results?.length || 10;

    if (size > 0 && totalCount > size) {
      const totalPages = Math.ceil(totalCount / size);
      const promises = [];
      for (let p = 2; p <= totalPages; p++) {
        promises.push(
          fetchFn(
            p,
            debouncedSearch,
            token,
            selectedProvinceFilter,
            selectedDistrictFilter,
            selectedOpFilter,
          ),
        );
      }
      const remainingPages = await Promise.all(promises);
      remainingPages.forEach((pageRes) => {
        allResults.push(...(pageRes.results || []));
      });
    }
    return allResults;
  };

  const renderEvacuationFormFields = () => {
    const fieldGroups: Record<string, string[]> = {
      general: [
        "compound_name",
        "compound_function",
        "country",
        "province",
        "area_council",
        "island",
        "village",
        "latitude",
        "longitude",
      ],
      contact: [
        "primary_contact",
        "secondary_contact",
        "organization",
        "agency",
      ],
      capacity: [
        "no_of_buildings",
        "no_of_rooms",
        "internal_building_evacuee_capacity",
        "name_of_outside_temporary_shelter",
        "outside_temporary_shelter_capacity",
        "disaster_suitable_for",
        "enginerring_certified_cyclone_rating",
      ],
      readiness: [
        "is_ec_owner_approved",
        "is_ec_govt_approved",
        "first_aid_kit_availability",
        "first_aid_trained_person",
        "electricity_source",
        "kitchen_cooking_facilities",
        "laundry_facilities",
        "communication_back_up",
      ],
      water_sanitation: [
        "drinking_water_source",
        "washing_water_source",
        "water_storage_capacity_litres",
        "total_mens_toilet",
        "total_womens_toilet",
        "total_unisex_toilet",
        "total_disability_access_toilet",
        "total_mens_shower",
        "total_womens_shower",
        "total_unisex_shower",
        "total_disability_access_shower",
      ],
    };

    const activeFields = fieldGroups[activeModalTab] || [];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto px-1 py-2">
        {activeFields.map((fieldKey) => {
          const col = EVACUATION_CENTRE_COLUMNS.find((c) => c.key === fieldKey);
          if (!col) return null;

          return (
            <div key={col.key} className="space-y-1">
              <label className="block text-xs font-bold text-muted-foreground">
                {col.label}
              </label>
              {col.type === "boolean" ? (
                <select
                  value={String(modalFormData[col.key] ?? "")}
                  onChange={(e) => {
                    const val = e.target.value;
                    setModalFormData((prev: any) => ({
                      ...prev,
                      [col.key]:
                        val === "true" ? true : val === "false" ? false : "",
                    }));
                  }}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  <option value="">-- Blank/Null --</option>
                  <option value="true">True / Approved</option>
                  <option value="false">False / Disapproved</option>
                </select>
              ) : col.type === "number" ? (
                <Input
                  type="number"
                  value={modalFormData[col.key] ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setModalFormData((prev: any) => ({
                      ...prev,
                      [col.key]: val === "" ? "" : Number(val),
                    }));
                  }}
                  className="w-full bg-background shadow-none"
                />
              ) : (
                <Input
                  type="text"
                  value={modalFormData[col.key] ?? ""}
                  onChange={(e) => {
                    setModalFormData((prev: any) => ({
                      ...prev,
                      [col.key]: e.target.value,
                    }));
                  }}
                  className="w-full bg-background shadow-none"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDisplacementFormFields = () => {
    const fieldGroups: Record<string, string[]> = {
      general_displacement: [
        "operation",
        "operation_code",
        "displacement_reason",
        "operation_status",
        "assessment_type",
      ],
      geography: [
        "admin0_name",
        "admin0_pcode",
        "admin1_name",
        "admin1_pcode",
        "admin2_name",
        "admin2_pcode",
        "admin_level",
      ],
      timeline: [
        "reporting_date",
        "reporting_year",
        "reporting_month",
        "round_number",
      ],
      demographics: [
        "num_present_idps",
        "males_number",
        "female_number",
        "total_vul_hhs",
        "males_number_0_4",
        "females_number_0_4",
        "males_number_5_17",
        "females_number_5_17",
        "males_number_18_59",
        "females_number_18_59",
        "males_number_60_plus",
        "females_number_60_plus",
      ],
      destination: [
        "idp_origin_admin1_name",
        "idp_origin_admin1_pcode",
        "idp_destination",
        "idp_destination_admin1_name",
        "idp_destination_admin1_pcode",
      ],
    };

    const activeFields = fieldGroups[activeModalTab] || [];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto px-1 py-2">
        {activeFields.map((fieldKey) => {
          const col = DISPLACEMENT_COLUMNS.find((c) => c.key === fieldKey);
          if (!col) return null;

          return (
            <div key={col.key} className="space-y-1">
              <label className="block text-xs font-bold text-muted-foreground">
                {col.label}
              </label>
              {col.type === "number" ? (
                <Input
                  type="number"
                  value={modalFormData[col.key] ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setModalFormData((prev: any) => ({
                      ...prev,
                      [col.key]: val === "" ? "" : Number(val),
                    }));
                  }}
                  className="w-full bg-background shadow-none"
                />
              ) : (
                <Input
                  type="text"
                  value={modalFormData[col.key] ?? ""}
                  onChange={(e) => {
                    setModalFormData((prev: any) => ({
                      ...prev,
                      [col.key]: e.target.value,
                    }));
                  }}
                  className="w-full bg-background shadow-none"
                />
              )}
            </div>
          );
        })}
      </div>
    );
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

            <select
              value={selectedDistrictFilter}
              onChange={(e) => {
                setSelectedDistrictFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">All Districts/Councils</option>
              {filterOptions.districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>

            <select
              value={selectedOpFilter}
              onChange={(e) => {
                setSelectedOpFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">
                {isEvac ? "All Functions" : "All Operations"}
              </option>
              {filterOptions.operations.map((op) => (
                <option key={op} value={op}>
                  {op}
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
                <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl z-40 p-2 animate-fadeIn shadow-none">
                  <div className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-wider px-2 py-1 pb-2 border-b border-border mb-1">
                    Export Excel / CSV
                  </div>
                  <button
                    onClick={() => performExport("csv", false)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/40 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>Export Filtered Rows (CSV)</span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                      {count} rows
                    </span>
                  </button>
                  <button
                    onClick={() => performExport("excel", false)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/40 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>Export Filtered Rows (Excel)</span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                      {count} rows
                    </span>
                  </button>
                  {selectedRowIds.length > 0 && (
                    <>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={() => performExport("csv", true)}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/40 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>Export Selected (CSV)</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-bold">
                          {selectedRowIds.length} rows
                        </span>
                      </button>
                      <button
                        onClick={() => performExport("excel", true)}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/40 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>Export Selected (Excel)</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-bold">
                          {selectedRowIds.length} rows
                        </span>
                      </button>
                    </>
                  )}
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
                <TableHead className="w-16 text-center text-xs font-extrabold text-muted-foreground">
                  Actions
                </TableHead>
                {columns.map((col) => {
                  const isExportSelected = selectedExportColumns.includes(
                    col.key,
                  );
                  return (
                    <TableHead
                      key={col.key}
                      className="text-xs font-extrabold text-muted-foreground tracking-wider py-3 px-4"
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
                  <TableCell className="text-center p-2">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModalEditor(row)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md shadow-none"
                        title="Edit all fields"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
                              <span className="text-muted-foreground/35 italic">
                                blank
                              </span>
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
                            {!col.readonly && canEdit && (
                              <span className="absolute right-1 top-2.5 opacity-0 group-hover:opacity-60 transition-opacity">
                                <Edit2 className="h-2.5 w-2.5 text-muted-foreground" />
                              </span>
                            )}
                          </>
                        )}
                      </TableCell>
                    );
                  })}
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
            {results.length === 0 ? 0 : (page - 1) * 10 + 1}
          </span>{" "}
          to{" "}
          <span className="text-foreground font-bold">
            {Math.min(page * 10, count)}
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
              {isEvac
                ? renderEvacuationFormFields()
                : renderDisplacementFormFields()}

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
