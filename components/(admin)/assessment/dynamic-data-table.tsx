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
  FileText,
  SlidersHorizontal,
  Settings,
  ListPlus,
  Layers,
  CheckCircle2,
  CheckCheck,
  ShieldCheck,
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
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { dynamicDataService } from "@/services/dynamic-data";
import {
  useDynamicData,
  useCreateDynamicRecord,
  useUpdateDynamicRecord,
  useDeleteDynamicRecord,
  useImportDynamicRecord,
  useVerifyDynamicRecord,
} from "@/hooks/use-dynamic-data";
import {
  EVACUATION_CENTRE_COLUMNS,
  EvacuationCentreFormFields,
} from "./fields/evacuation-centre-form-fields";
import { DISPLACEMENT_COLUMNS, DisplacementFormFields } from "./fields/displacement-form-fields";
import {
  VILLAGE_ASSESSMENT_COLUMNS,
  VillageAssessmentFormFields,
} from "./fields/village-assessment-form-fields";
import { FIVEW_COLUMNS, FiveWFormFields } from "./fields/fivew-form-fields";
import { getSchemaForSlug, validateTabFields } from "@/lib/schemas/assessment-schemas";

const GENERIC_FORM_SLUGS = [
  "durable-solution-relocation-survey",
  "service-monitoring-tool-2026",
  "displacement-tracking-matrix-form",
  "rapid-assessment-form-area-council",
  "community-level-damage-assessment-form",
  "displacement-profile-phone-survey",
  "damage-assessment-form-community-v2",
];

const GENERIC_COLUMNS = [
  { key: "field_name", label: "Field Name", type: "string", readonly: false },
];

export function formatDateISO(val: any): string | null {
  if (!val || typeof val !== "string" || !val.trim()) return null;
  const str = val.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  if (str.includes("T")) {
    const part = str.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(part)) return part;
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return str;
}

export function sanitizeRecordPayload(fields: Record<string, any>): Record<string, any> {
  if (!fields || typeof fields !== "object") return fields;
  const cleaned: Record<string, any> = { ...fields };

  Object.keys(cleaned).forEach((key) => {
    const val = cleaned[key];
    const isDateField =
      key.toLowerCase().includes("date") ||
      key === "survey_start" ||
      key === "survey_end" ||
      key.endsWith("_at");

    if (val === "" || val === undefined) {
      cleaned[key] = null;
    } else if (isDateField && typeof val === "string") {
      cleaned[key] = formatDateISO(val);
    }
  });

  return cleaned;
}

export interface DynamicColumnDef {
  key: string;
  label: string;
  type: string;
  options?: string[];
  readonly?: boolean;
}

function computeGenericColumns(results: any[]): DynamicColumnDef[] {
  const fieldDefsMap = new Map<string, DynamicColumnDef>();

  results.forEach((row) => {
    if (row.field) {
      if (Array.isArray(row.field.fields)) {
        row.field.fields.forEach((f: any) => {
          if (f && f.key) {
            fieldDefsMap.set(f.key, {
              key: f.key,
              label: f.label || f.key,
              type: f.type || "string",
              options: f.options,
              readonly: false,
            });
          }
        });
      } else if (Array.isArray(row.field)) {
        row.field.forEach((f: any) => {
          if (typeof f === "object" && f.key) {
            fieldDefsMap.set(f.key, {
              key: f.key,
              label: f.label || f.key,
              type: f.type || "string",
              options: f.options,
              readonly: false,
            });
          }
        });
      } else if (typeof row.field === "object") {
        Object.entries(row.field).forEach(([k, v]: [string, any]) => {
          if (k !== "field_name" && typeof v === "object" && v !== null && (v.label || v.type)) {
            fieldDefsMap.set(k, {
              key: k,
              label: v.label || k,
              type: v.type || "string",
              options: v.options,
              readonly: false,
            });
          }
        });
      }
    }

    if (row.data && typeof row.data === "object" && !Array.isArray(row.data)) {
      Object.keys(row.data).forEach((k) => {
        if (!fieldDefsMap.has(k)) {
          const val = row.data[k];
          let type = "string";
          if (typeof val === "number") type = "number";
          if (typeof val === "boolean") type = "boolean";
          fieldDefsMap.set(k, {
            key: k,
            label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            type,
            readonly: false,
          });
        }
      });
    }
  });

  if (fieldDefsMap.size > 0) {
    const dynamicCols = Array.from(fieldDefsMap.values());
    return [{ key: "id", label: "S.N.", type: "number", readonly: true }, ...dynamicCols];
  }

  return [
    { key: "id", label: "S.N.", type: "number", readonly: true },
    { key: "field_name", label: "Field Name", type: "string", readonly: false },
  ];
}

const EVAC_TABS = [
  { key: "general", label: "General & Info" },
  { key: "contact", label: "Contacts & Agency" },
  { key: "capacity", label: "Capacity & Buildings" },
  { key: "readiness", label: "Facilities & Readiness" },
  { key: "water_sanitation", label: "WASH (Water & Sanitation)" },
];

const VILLAGE_TABS = [
  { key: "general", label: "General & Survey" },
  { key: "geography", label: "Geography" },
  { key: "key_informants", label: "Key Informants" },
  { key: "idp_statistics", label: "IDP & Returnees" },
  { key: "vulnerabilities_shelter", label: "Vulnerabilities & Shelter" },
  { key: "community_needs", label: "Community & Needs" },
  { key: "gps_submission", label: "GPS & Submission" },
];

const FIVEW_TABS = [
  { key: "org_admin", label: "Organization & Admin" },
  { key: "location_cluster", label: "Location & Cluster" },
  { key: "project_activity", label: "Project & Activity" },
  { key: "financial_modality", label: "Financial & Modality" },
  { key: "beneficiaries", label: "Beneficiaries & Reached" },
  { key: "indicators_sub", label: "Indicators & Sub-activities" },
];

const DISPLACEMENT_TABS = [
  { key: "general_displacement", label: "General Info" },
  { key: "geography", label: "Geography" },
  { key: "timeline", label: "Timeline" },
  { key: "demographics", label: "Demographics" },
  { key: "destination", label: "Origin & Destination" },
];

const EVAC_GROUPS: Record<string, string[]> = {
  general: ["compound_name", "compound_function", "country", "province", "area_council", "island", "village", "latitude", "longitude"],
  contact: ["primary_contact", "secondary_contact", "organization", "agency"],
  capacity: ["no_of_buildings", "no_of_rooms", "internal_building_evacuee_capacity", "name_of_outside_temporary_shelter", "outside_temporary_shelter_capacity", "disaster_suitable_for", "enginerring_certified_cyclone_rating"],
  readiness: ["is_ec_owner_approved", "is_ec_govt_approved", "first_aid_kit_availability", "first_aid_trained_person", "electricity_source", "kitchen_cooking_facilities", "laundry_facilities", "communication_back_up"],
  water_sanitation: ["drinking_water_source", "washing_water_source", "water_storage_capacity_litres", "total_mens_toilet", "total_womens_toilet", "total_unisex_toilet", "total_disability_access_toilet", "total_mens_shower", "total_womens_shower", "total_unisex_shower", "total_disability_access_shower"],
};

const VILLAGE_GROUPS: Record<string, string[]> = {
  general: ["survey_start", "survey_end", "survey_date", "enumerator_username", "device_id", "audit_file", "audit_url", "consent", "methodology_individual_ki", "methodology_group_ki", "methodology_direct_observation", "methodology_other", "data_collection_method"],
  geography: ["province", "area_council", "village_name", "village_other", "village_condition", "assessment_date", "assessment_start_time", "enumerator1_name", "enumerator1_phone", "enumerator1_gender", "enumerator2_name", "enumerator2_phone", "enumerator2_gender"],
  key_informants: ["ki1_name", "ki1_type", "ki1_gender", "ki1_age", "ki1_contact", "ki2_name", "ki2_type", "ki2_gender", "ki2_age", "ki2_contact", "ki3_name", "ki3_type", "ki3_gender", "ki3_age", "ki3_contact", "ki4_name", "ki4_type", "ki4_gender", "ki4_age", "ki4_contact", "ki5_name", "ki5_type", "ki5_gender", "ki5_age", "ki5_contact", "ki6_name", "ki6_type", "ki6_gender", "ki6_age", "ki6_contact"],
  idp_statistics: ["idp_present", "idp_households_total", "idp_infant_male", "idp_infant_female", "idp_child_1_5_male", "idp_child_1_5_female", "idp_child_6_12_male", "idp_child_6_12_female", "idp_adolescent_male", "idp_adolescent_female", "idp_adult_male", "idp_adult_female", "idp_elderly_male", "idp_elderly_female", "idp_male_total", "idp_female_total", "idp_individuals_total", "returnees_present", "returnee_households_total", "returnee_individuals_total"],
  vulnerabilities_shelter: ["pregnant_women_count", "female_headed_hh", "elderly_headed_hh", "male_headed_hh", "child_headed_hh", "pwd_total", "idp_pwd_total", "shelter_primary", "shelter_secondary", "displacement_shelter_type", "displaced_hh_estimated", "displacement_duration", "housing_type_pre_cyclone", "house_rebuild_duration", "rebuild_material_type", "house_cyclone_resilience", "remaining_idp_intention"],
  community_needs: ["seasonal_worker_level", "community_participation", "cdccc_exists", "early_warning_received", "annual_population_displaced", "top_need_1", "top_need_2", "top_need_3"],
  gps_submission: ["gps_latitude", "gps_longitude", "gps_altitude", "gps_precision", "record_id", "record_uuid", "submission_time", "validation_status", "submission_status", "submitted_by", "form_version", "record_index"],
};

const FIVEW_GROUPS: Record<string, string[]> = {
  org_admin: ["donor", "donor_names", "reporting_org_name", "ro_code", "reporting_org_type", "other_ip_name", "ip_code", "ip_type", "reporting_month", "activity_status"],
  location_cluster: ["state_abyei", "admin1_code", "province", "admin2_code", "location_evac_name", "cluster_name", "hrp_non_hrp"],
  project_activity: ["project_number", "project_name", "activity", "indicator", "unit", "target"],
  financial_modality: ["total_value", "new_beneficiaries", "is_mpc", "modality", "type_of_modality", "delivery_mechanism", "number_of_transfers", "value_ssp", "value_usd"],
  beneficiaries: ["beneficiaries_type_under_18", "child_male_under_18", "child_female_under_18", "adult_male_18_60", "adult_female_18_60", "elderly_male_60_plus", "elderly_female_60_plus", "total_beneficiaries_reached", "people_with_disability", "boys_above_5", "girls_above_5", "boys_5_17", "girls_5_17", "men_18_59", "women_18_59", "men_60_plus", "women_60_plus", "total_reached_quarter"],
  indicators_sub: ["comments", "contribute_hrp_aap", "hrp_aap_indicators", "activity_type", "sub_activity_type", "measurements", "achieved", "column1"],
};

const DISPLACEMENT_GROUPS: Record<string, string[]> = {
  general_displacement: ["operation", "operation_code", "displacement_reason", "operation_status", "assessment_type"],
  geography: ["admin0_name", "admin0_pcode", "admin1_name", "admin1_pcode", "admin2_name", "admin2_pcode", "admin_level"],
  timeline: ["reporting_date", "reporting_year", "reporting_month", "round_number"],
  demographics: ["num_present_idps", "males_number", "female_number", "total_vul_hhs", "males_number_0_4", "females_number_0_4", "males_number_5_17", "females_number_5_17", "males_number_18_59", "females_number_18_59", "males_number_60_plus", "females_number_60_plus"],
  destination: ["idp_origin_admin1_name", "idp_origin_admin1_pcode", "idp_destination", "idp_destination_admin1_name", "idp_destination_admin1_pcode"],
};

const getGenericFieldName = (row: any) => {
  if (!row) return "";
  if (typeof row.field_name === "string" && row.field_name.trim()) return row.field_name;
  if (row.field) {
    if (typeof row.field === "string") return row.field;
    if (typeof row.field === "object") {
      return row.field.field_name || row.field.name || row.field.label || JSON.stringify(row.field);
    }
  }
  if (typeof row.name === "string" && row.name.trim()) return row.name;
  return "";
};

interface DynamicDataTableProps {
  slug: string;
  token: string | null;
  canEdit: boolean;
}

export function DynamicDataTable({ slug, token, canEdit }: DynamicDataTableProps) {
  const isGenericForm = GENERIC_FORM_SLUGS.includes(slug);
  const isEvac = slug === "evacuation-centre-assessment-form" || slug === "evacuation-centre-data";
  const isVillage = slug === "village-assessment" || slug === "village-assessments";
  const isFiveW = slug === "5w-response-data" || slug === "fivew";

  const currentTabs = isEvac
    ? EVAC_TABS
    : isVillage
      ? VILLAGE_TABS
      : isFiveW
        ? FIVEW_TABS
        : DISPLACEMENT_TABS;

  const currentGroups = isEvac
    ? EVAC_GROUPS
    : isVillage
      ? VILLAGE_GROUPS
      : isFiveW
        ? FIVEW_GROUPS
        : DISPLACEMENT_GROUPS;

  const queryClient = useQueryClient();

  // Pagination & Search States
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filters & Form Errors State
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState("");
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("");
  const [selectedOpFilter, setSelectedOpFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
    statusFilter,
  );

  const createRecord = useCreateDynamicRecord(slug, token);
  const updateRecord = useUpdateDynamicRecord(slug, token);
  const deleteRecord = useDeleteDynamicRecord(slug, token);
  const importRecord = useImportDynamicRecord(slug, token);
  const verifyRecord = useVerifyDynamicRecord(slug, token);

  const handleVerifySingle = async (id: number) => {
    try {
      await verifyRecord.mutateAsync(id);
      toast.success(`Record #${id} verified successfully and merged into Live Data`);
    } catch (err: any) {
      toast.error(err.message || "Failed to verify record");
    }
  };

  const handleVerifyBatch = async () => {
    if (selectedRowIds.length === 0) return;
    let countSuccess = 0;
    for (const id of selectedRowIds) {
      try {
        await verifyRecord.mutateAsync(id);
        countSuccess++;
      } catch (err) {}
    }
    toast.success(`${countSuccess} record(s) verified and merged into Live Data`);
    setSelectedRowIds([]);
  };

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
  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>([]);
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
  const [genericFieldName, setGenericFieldName] = useState("");
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
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = data?.results || [];

  const genericColumns = useMemo(() => {
    if (!isGenericForm) return [];
    return computeGenericColumns(results);
  }, [isGenericForm, results]);

  const columns = isGenericForm
    ? genericColumns
    : isEvac
      ? EVACUATION_CENTRE_COLUMNS
      : isVillage
        ? VILLAGE_ASSESSMENT_COLUMNS
        : isFiveW
          ? FIVEW_COLUMNS
          : DISPLACEMENT_COLUMNS;

  // Manage Form Fields state (schema definitions: field JSONField)
  const [isManageFieldsOpen, setIsManageFieldsOpen] = useState(false);
  const [fieldSchemaList, setFieldSchemaList] = useState<DynamicColumnDef[]>([]);
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"string" | "number" | "select" | "boolean">("string");
  const [newFieldOptions, setNewFieldOptions] = useState("");
  const [isKeyCustomized, setIsKeyCustomized] = useState(false);

  useEffect(() => {
    if (isGenericForm) {
      const dynamicFieldsOnly = genericColumns.filter(
        (c) => c.key !== "id" && c.key !== "field_name",
      );
      if (dynamicFieldsOnly.length > 0) {
        setFieldSchemaList(dynamicFieldsOnly);
      }
    }
  }, [isGenericForm, genericColumns]);

  const handleLabelChange = (val: string) => {
    setNewFieldLabel(val);
    if (!isKeyCustomized) {
      const slugified = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
      setNewFieldKey(slugified);
    }
  };

  const handleKeyChange = (val: string) => {
    setNewFieldKey(val);
    setIsKeyCustomized(true);
  };

  const handleAddFieldSchema = () => {
    const label = newFieldLabel.trim();
    const key =
      newFieldKey.trim() || label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    if (!label && !key) {
      toast.error("Please enter a field label");
      return;
    }
    if (fieldSchemaList.some((f) => f.key === key)) {
      toast.error("Field key already exists in schema");
      return;
    }
    const newCol: DynamicColumnDef = {
      key,
      label: label || key,
      type: newFieldType,
      options:
        newFieldType === "select"
          ? newFieldOptions
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
      readonly: false,
    };
    setFieldSchemaList([...fieldSchemaList, newCol]);
    setNewFieldKey("");
    setNewFieldLabel("");
    setNewFieldType("string");
    setNewFieldOptions("");
    setIsKeyCustomized(false);
    toast.success(`Field "${newCol.label}" added to schema list`);
  };

  const handleRemoveFieldSchema = (keyToRemove: string) => {
    setFieldSchemaList(fieldSchemaList.filter((f) => f.key !== keyToRemove));
    toast.info("Field removed from schema list");
  };

  const handleSaveFormSchema = async () => {
    try {
      if (results.length > 0 && results[0]?.id) {
        await updateRecord.mutateAsync({
          id: results[0].id,
          fields: { field: { fields: fieldSchemaList } },
        });
      } else {
        await createRecord.mutateAsync({
          field: { fields: fieldSchemaList },
        });
      }
      queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
      toast.success("Form field schema saved successfully");
      setIsManageFieldsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save field schema");
    }
  };

  const count = data?.count || 0;
  const hasNext = !!data?.next;
  const hasPrev = !!data?.previous;
  const totalPages = Math.ceil(count / 50) || 1;

  // Inline edit start
  const handleInlineEditStart = (row: any, key: string, readonly?: boolean) => {
    if (!canEdit || readonly) return;
    setEditingCell({ rowId: row.id, key });
    const curVal = isGenericForm
      ? (row.data?.[key] ?? row[key] ?? row.field?.[key] ?? "")
      : (row[colKeyFor(key)] ?? row[key] ?? "");
    setInlineEditValue(curVal);
  };

  const colKeyFor = (k: string) => k;

  const handleInlineEditSave = async () => {
    if (!editingCell) return;
    const { rowId, key } = editingCell;
    const column = columns.find((c) => c.key === key);

    let parsedVal = inlineEditValue;
    const isDateField =
      column?.type === "date" || key.toLowerCase().includes("date") || key === "survey_start" || key === "survey_end";

    if (isDateField) {
      parsedVal = formatDateISO(inlineEditValue);
    } else if (column?.type === "number") {
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
      if (isGenericForm) {
        const row = results.find((r: any) => r.id === rowId);
        if (key === "field_name") {
          await updateRecord.mutateAsync({
            id: rowId,
            fields: String(parsedVal),
          });
        } else {
          const updatedData = sanitizeRecordPayload({
            ...(row?.data || {}),
            [key]: parsedVal,
          });
          await updateRecord.mutateAsync({
            id: rowId,
            fields: { data: updatedData },
          });
        }
      } else {
        const cleanedFields = sanitizeRecordPayload({ [key]: parsedVal });
        await updateRecord.mutateAsync({
          id: rowId,
          fields: cleanedFields,
        });
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

    const cleanedFormData = sanitizeRecordPayload(modalFormData);

    if (isGenericForm) {
      const activeFields =
        fieldSchemaList.length > 0
          ? fieldSchemaList
          : genericColumns.filter((c) => c.key !== "id" && c.key !== "field_name");

      if (activeFields.length === 0) {
        if (!genericFieldName.trim()) {
          toast.error("Field name is required");
          setIsSubmittingModal(false);
          return;
        }
        try {
          if (isCreating) {
            await createRecord.mutateAsync(genericFieldName.trim());
            toast.success("Field name added successfully");
            setIsCreating(false);
          } else if (editingRow) {
            await updateRecord.mutateAsync({
              id: editingRow.id,
              fields: genericFieldName.trim(),
            });
            toast.success("Field name updated successfully");
            setEditingRow(null);
          }
          queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
        } catch (error: any) {
          toast.error(error.message || "Failed to save field name");
        } finally {
          setIsSubmittingModal(false);
        }
        return;
      }

      try {
        const payload = {
          field: { fields: activeFields },
          data: cleanedFormData,
          ...(genericFieldName ? { field_name: genericFieldName } : {}),
        };

        if (isCreating) {
          await createRecord.mutateAsync(payload);
          toast.success("Data entry created successfully");
          setIsCreating(false);
        } else if (editingRow) {
          await updateRecord.mutateAsync({
            id: editingRow.id,
            fields: payload,
          });
          toast.success("Data entry updated successfully");
          setEditingRow(null);
        }
        queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
      } catch (error: any) {
        toast.error(error.message || "Failed to save data entry");
      } finally {
        setIsSubmittingModal(false);
      }
      return;
    }

    if (isCreating && !isGenericForm) {
      const schema = getSchemaForSlug(slug);
      if (schema) {
        const errors = validateTabFields(schema, cleanedFormData);
        if (Object.keys(errors).length > 0) {
          const firstMissingKey = Object.keys(errors)[0];
          let targetTab = activeModalTab;
          for (const [tabKey, fields] of Object.entries(currentGroups)) {
            if (fields.includes(firstMissingKey)) {
              targetTab = tabKey;
              break;
            }
          }
          setActiveModalTab(targetTab);
          setFormErrors(errors);
          setIsSubmittingModal(false);
          return;
        }
      }
    }

    try {
      if (isCreating) {
        await createRecord.mutateAsync(cleanedFormData);
        toast.success("Record created successfully");
        setIsCreating(false);
      } else if (editingRow) {
        await updateRecord.mutateAsync({
          id: editingRow.id,
          fields: cleanedFormData,
        });
        toast.success("Record updated successfully");
        setEditingRow(null);
      }
      queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
    } catch (error: any) {
      const msg = error?.message || "";
      const fieldMatch = msg.match(/^([a-z0-9_]+):\s*(.*)/i);
      if (fieldMatch) {
        const fieldKey = fieldMatch[1];
        const col = columns.find((c) => c.key === fieldKey);
        const label = col?.label || fieldKey;

        let targetTab = activeModalTab;
        for (const [tabKey, fields] of Object.entries(currentGroups)) {
          if (fields.includes(fieldKey)) {
            targetTab = tabKey;
            break;
          }
        }
        setActiveModalTab(targetTab);
        setFormErrors((prev) => ({
          ...prev,
          [fieldKey]: `${label} is required.`,
        }));
      } else {
        toast.error(msg || "Failed to save changes");
      }
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const activeTabIndex = currentTabs.findIndex((t) => t.key === activeModalTab);

  const handleNextTab = () => {
    if (isCreating && !isGenericForm) {
      const schema = getSchemaForSlug(slug);
      if (schema) {
        const fieldsOnTab = currentGroups[activeModalTab] || [];
        const errors = validateTabFields(schema, modalFormData, fieldsOnTab, columns);
        if (Object.keys(errors).length > 0) {
          setFormErrors((prev) => ({ ...prev, ...errors }));
          return;
        }
      }
    }
    setFormErrors({});
    if (activeTabIndex < currentTabs.length - 1) {
      setActiveModalTab(currentTabs[activeTabIndex + 1].key);
    }
  };

  const openModalEditor = (row: any) => {
    setIsCreating(false);
    setEditingRow(row);
    setFormErrors({});
    if (isGenericForm) {
      setGenericFieldName(getGenericFieldName(row));
      const initialFields: Record<string, any> = {};
      const activeFields =
        fieldSchemaList.length > 0
          ? fieldSchemaList
          : genericColumns.filter((c) => c.key !== "id" && c.key !== "field_name");
      activeFields.forEach((col) => {
        initialFields[col.key] = row.data?.[col.key] ?? row[col.key] ?? "";
      });
      setModalFormData(initialFields);
      return;
    }
    const initialFields: any = {};
    columns.forEach((col) => {
      if (!col.readonly) {
        initialFields[col.key] = row[col.key] ?? "";
      }
    });
    setModalFormData(initialFields);
    setActiveModalTab(
      isEvac ? "general" : isVillage ? "general" : isFiveW ? "org_admin" : "general_displacement",
    );
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingRow(null);
    setFormErrors({});
    if (isGenericForm) {
      setGenericFieldName("");
      const initialFields: Record<string, any> = {};
      const activeFields =
        fieldSchemaList.length > 0
          ? fieldSchemaList
          : genericColumns.filter((c) => c.key !== "id" && c.key !== "field_name");
      activeFields.forEach((col) => {
        initialFields[col.key] = col.type === "boolean" ? false : "";
      });
      setModalFormData(initialFields);
      return;
    }
    const initialFields: any = {};
    columns.forEach((col) => {
      if (!col.readonly) {
        initialFields[col.key] = col.type === "boolean" ? "" : col.type === "number" ? "" : "";
      }
    });
    setModalFormData(initialFields);
    setActiveModalTab(
      isEvac ? "general" : isVillage ? "general" : isFiveW ? "org_admin" : "general_displacement",
    );
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
      selectedExportColumns.length > 0 ? selectedExportColumns : columns.map((c) => c.key);
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
      } else if (isVillage) {
        blob = await dynamicDataService.exportVillageAssessments(
          columnsToExport,
          token,
          selectedProvinceFilter,
          selectedDistrictFilter,
          selectedOpFilter,
          debouncedSearch,
        );
      } else if (isFiveW) {
        blob = await dynamicDataService.exportFiveWActivities(
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
      <div className="p-4 border-b border-border flex flex-col gap-3 bg-muted/20">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isGenericForm ? "Search field names..." : "Search page/records..."}
              className="pl-9 h-9 w-full rounded-xl bg-background border-border shadow-none text-xs"
            />
          </div>

          {/* Filter Dropdowns */}
          {!isGenericForm && (
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
          )}

          <div className="flex items-center gap-2 ml-auto">
            {canEdit && isGenericForm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsManageFieldsOpen(true)}
                className="h-9 gap-1.5 font-bold cursor-pointer rounded-xl bg-purple-50/45 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-200/60 dark:border-purple-900/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 shadow-none"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Manage Fields
              </Button>
            )}

            {!isGenericForm && canEdit && (
              <Button
                variant={statusFilter.toLowerCase() === "unverified" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(statusFilter.toLowerCase() === "unverified" ? "all" : "Unverified");
                  setPage(1);
                }}
                className={`h-9 gap-1.5 font-bold cursor-pointer rounded-xl shadow-none ${
                  statusFilter.toLowerCase() === "unverified"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100 dark:hover:bg-amber-950/40"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                Unverified Data
              </Button>
            )}

            {canEdit && (
              <Button
                variant="default"
                size="sm"
                onClick={openCreateModal}
                className="h-9 gap-1.5 font-bold cursor-pointer rounded-xl shadow-none"
              >
                <Plus className="h-4 w-4" />
                {isGenericForm ? "Add Record / Entry" : "Add Record"}
              </Button>
            )}

            {!isGenericForm && canEdit && (
              <>
                {isEvac ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-9 gap-1.5 font-bold cursor-pointer rounded-xl bg-blue-50/45 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 shadow-none"
                  >
                    <Link href="/assement/evacuation-centre-assessment-form/imports">
                      <Upload className="h-4 w-4" />
                      Import
                    </Link>
                  </Button>
                ) : isVillage ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-9 gap-1.5 font-bold cursor-pointer rounded-xl bg-blue-50/45 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 shadow-none"
                  >
                    <Link href="/assement/village-assessment/imports">
                      <Upload className="h-4 w-4" />
                      Import
                    </Link>
                  </Button>
                ) : isFiveW ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-9 gap-1.5 font-bold cursor-pointer rounded-xl bg-blue-50/45 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 shadow-none"
                  >
                    <Link href="/assement/5w-response-data/imports">
                      <Upload className="h-4 w-4" />
                      Import
                    </Link>
                  </Button>
                ) : slug === "displacement-data" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-9 gap-1.5 font-bold cursor-pointer rounded-xl bg-blue-50/45 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 shadow-none"
                  >
                    <Link href="/assement/displacement-data/imports">
                      <Upload className="h-4 w-4" />
                      Import
                    </Link>
                  </Button>
                ) : (
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
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImporting}
                      className="h-9 gap-1.5 font-bold cursor-pointer rounded-xl bg-blue-50/45 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 shadow-none"
                    >
                      {isImporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Import
                    </Button>
                  </>
                )}
              </>
            )}

            {/* Export dropdown */}
            <div className="relative" ref={exportDropdownRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                className="h-9 gap-1.5 font-bold cursor-pointer rounded-xl border-border bg-background shadow-none"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              {isExportDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-xl p-1.5 z-30 animate-fadeIn">
                  <div className="px-2 py-1.5 text-[11px] font-bold text-muted-foreground border-b border-border">
                    {selectedExportColumns.length > 0
                      ? `Exporting ${selectedExportColumns.length} selected columns`
                      : "Exporting all columns"}
                  </div>
                  <button
                    onClick={() => {
                      setIsExportDropdownOpen(false);
                      performExport();
                    }}
                    disabled={loadingExport}
                    className="w-full text-left px-2 py-2 text-xs font-semibold hover:bg-muted rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Download Excel (.xlsx)</span>
                    {loadingExport && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unverified Queue Banner */}
        {statusFilter.toLowerCase() === "unverified" && (
          <div className="bg-amber-500/10 border border-amber-500/25 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs text-amber-700 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-500" />
              <span>
                <strong>Viewing Unverified Data Queue.</strong> Review, edit, and click <strong>"Verify"</strong> to merge records into the live database.
              </span>
            </div>
            {selectedRowIds.length > 0 && canEdit && (
              <Button
                size="sm"
                onClick={handleVerifyBatch}
                disabled={verifyRecord.isPending}
                className="h-7 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 rounded-lg cursor-pointer shadow-none"
              >
                {verifyRecord.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCheck className="h-3.5 w-3.5" />
                )}
                Verify Selected ({selectedRowIds.length})
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Table Area */}
      <div className="overflow-x-auto relative">
        {isLoading && (
          <div className="flex items-center justify-center p-12 text-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && isError && (
          <div className="p-8 text-center text-rose-500 text-xs font-bold">
            Failed to load records. Please try again.
          </div>
        )}

        {!isLoading && !isError && results.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[300px]">
            <Download className="h-8 w-8 text-muted-foreground/30 mb-2 animate-pulse" />
            <p className="text-xs font-bold text-foreground">No records found</p>
            <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
              {statusFilter.toLowerCase() === "unverified"
                ? "There are no unverified data records pending verification."
                : "No dynamic data records matched your current query or filter configuration."}
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && results.length > 0 && (
          <Table className="border-collapse">
            <TableHeader className="bg-muted/45 border-b border-border">
              <TableRow>
                <TableHead className="w-12 text-center select-none pl-4">
                  <Checkbox
                    checked={results.length > 0 && selectedRowIds.length === results.length}
                    onCheckedChange={handleSelectAllOnPage}
                  />
                </TableHead>
                {columns.map((col) => {
                  const isExportSelected = selectedExportColumns.includes(col.key);
                  return (
                    <TableHead key={col.key} className="text-xs font-semibold  py-3 px-4">
                      <div className="flex items-center gap-1.5 py-1">
                        <Checkbox
                          checked={isExportSelected}
                          onCheckedChange={() => {
                            if (isExportSelected) {
                              setSelectedExportColumns(
                                selectedExportColumns.filter((c) => c !== col.key),
                              );
                            } else {
                              setSelectedExportColumns([...selectedExportColumns, col.key]);
                            }
                          }}
                          title="Toggle export selection for this column"
                        />
                        <span>{col.key === "id" ? "S.N." : col.label}</span>
                      </div>
                    </TableHead>
                  );
                })}
                {canEdit && (
                  <TableHead className="w-24 text-center text-xs font-extrabold text-muted-foreground">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((row: any, index: number) => (
                <TableRow
                  key={row.id}
                  className={`hover:bg-muted/30 border-b border-border transition-colors cursor-pointer ${
                    selectedRowIds.includes(row.id) ? "bg-primary/5 hover:bg-primary/10" : ""
                  }`}
                >
                  <TableCell className="text-center pl-4 select-none">
                    <Checkbox
                      checked={selectedRowIds.includes(row.id)}
                      onCheckedChange={() => handleSelectRow(row.id)}
                    />
                  </TableCell>
                  {columns.map((col) => {
                    const isEditing = editingCell?.rowId === row.id && editingCell?.key === col.key;
                    const value = isGenericForm
                      ? col.key === "id"
                        ? (page - 1) * 50 + index + 1
                        : col.key === "field_name"
                        ? getGenericFieldName(row)
                        : row.data?.[col.key] ?? row[col.key] ?? row.field?.[col.key]
                      : row[col.key];

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
                        title={!col.readonly && canEdit ? "Click to edit cell" : col.label}
                      >
                        {isGenericForm && col.key === "field_name" ? (
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-md bg-primary/10 text-primary">
                              <FileText className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-bold text-foreground text-xs font-mono">
                              {getGenericFieldName(row) || "—"}
                            </span>
                          </div>
                        ) : isEditing ? (
                          col.type === "boolean" ? (
                            <select
                              value={String(inlineEditValue)}
                              onChange={(e) => setInlineEditValue(e.target.value)}
                              onBlur={handleInlineEditSave}
                              autoFocus
                              className="w-full h-7 rounded border border-ring bg-background text-[11px] focus:outline-none"
                            >
                              <option value="">-- Null --</option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          ) : col.type === "select" || (col as any).options ? (
                            <select
                              value={String(inlineEditValue ?? "")}
                              onChange={(e) => setInlineEditValue(e.target.value)}
                              onBlur={handleInlineEditSave}
                              autoFocus
                              className="w-full h-7 rounded border border-ring bg-background text-[11px] focus:outline-none"
                            >
                              <option value="">-- Select --</option>
                              {(col as any).options?.map((opt: any) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={col.type === "number" ? "number" : "text"}
                              value={inlineEditValue}
                              onChange={(e) => setInlineEditValue(e.target.value)}
                              onBlur={handleInlineEditSave}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleInlineEditSave();
                                if (e.key === "Escape") setEditingCell(null);
                              }}
                              autoFocus
                              className="w-full h-7 px-1.5 rounded border border-ring bg-background text-[11px] focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                          )
                        ) : col.key === "id" ? (
                          (page - 1) * 50 + index + 1
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
                        {!isGenericForm && (row.status?.toLowerCase() === "unverified" || statusFilter.toLowerCase() === "unverified") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerifySingle(row.id);
                            }}
                            disabled={verifyRecord.isPending}
                            className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-md shadow-none cursor-pointer"
                            title="Verify record & merge to Live Data"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
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
          to <span className="text-foreground font-bold">{Math.min(page * 50, count)}</span> of{" "}
          <span className="text-foreground font-bold">{count}</span> records
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
            <DialogTitle className="text-base font-bold text-foreground">Delete Record</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed mt-2">
              Are you sure you want to delete this record 
              ? This action cannot be undone.
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
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Dynamic Form Fields Modal */}
      <Dialog open={isManageFieldsOpen} onOpenChange={setIsManageFieldsOpen}>
        <DialogContent className="max-w-2xl! w-full rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-5">
          <DialogHeader className="flex flex-row items-start gap-3.5 space-y-0 pb-3 border-b border-border">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Manage Dynamic Form Fields & Schema
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Configure form field definitions for this assessment. Defined fields automatically generate dynamic table headers and data submission inputs.
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Add New Field Form Card */}
          <div className="bg-muted/20 border border-border/80 p-4.5 rounded-2xl space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-primary" />
                Add New Field Definition
              </h4>
              <span className="text-[10px] text-muted-foreground font-medium">
                Auto-generates snake_case key
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-muted-foreground">
                  Field Label <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={newFieldLabel}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="e.g. Total Households Affected"
                  className="h-9 text-xs bg-background rounded-xl border-border/80 focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-muted-foreground">
                  Field Key (snake_case)
                </label>
                <Input
                  value={newFieldKey}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  placeholder="e.g. households_affected"
                  className="h-9 text-xs font-mono bg-background rounded-xl border-border/80"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-muted-foreground">
                  Field Type
                </label>
                <select
                  value={newFieldType}
                  onChange={(e: any) => setNewFieldType(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="string">Text (String)</option>
                  <option value="number">Number</option>
                  <option value="select">Dropdown Select</option>
                  <option value="boolean">Yes / No (Boolean)</option>
                </select>
              </div>
              {newFieldType === "select" && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-muted-foreground">
                    Select Options (comma-separated)
                  </label>
                  <Input
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="e.g. Mild, Moderate, Severe"
                    className="h-9 text-xs bg-background rounded-xl border-border/80"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="button"
                size="sm"
                onClick={handleAddFieldSchema}
                className="h-8.5 px-4 text-xs font-bold gap-1.5 rounded-xl cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-none"
              >
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            </div>
          </div>

          {/* Configured Fields List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                Configured Form Fields ({fieldSchemaList.length})
              </h4>
            </div>

            {fieldSchemaList.length === 0 ? (
              <div className="p-6 border border-dashed border-border rounded-2xl text-center bg-card/40 space-y-1.5">
                <ListPlus className="h-7 w-7 text-muted-foreground/40 mx-auto" />
                <p className="text-xs font-bold text-foreground">No dynamic fields defined yet</p>
                <p className="text-[11px] text-muted-foreground">
                  Fill out the field label above and click <strong>"Add Field"</strong> to start building your form schema.
                </p>
              </div>
            ) : (
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {fieldSchemaList.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-center justify-between p-3 bg-card border border-border rounded-xl text-xs shadow-2xs hover:border-border/80 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-foreground">{field.label}</span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/60">
                        {field.key}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                          field.type === "number"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : field.type === "select"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : field.type === "boolean"
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }`}
                      >
                        {field.type}
                      </span>
                      {field.options && field.options.length > 0 && (
                        <span className="text-[10px] text-muted-foreground italic">
                          Options: {field.options.join(", ")}
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFieldSchema(field.key)}
                      className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer shrink-0"
                      title="Remove field"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setIsManageFieldsOpen(false)}
              className="h-9 font-semibold rounded-xl cursor-pointer shadow-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveFormSchema}
              className="h-9 font-bold cursor-pointer rounded-xl bg-primary text-primary-foreground shadow-none"
            >
              Save Schema Configuration
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
        <DialogContent className="max-w-4xl! w-full rounded-2xl border border-border bg-card shadow-none p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="text-base font-bold">
              {isCreating ? "Create New Entry" : `Edit Entry (ID: ${editingRow?.id})`}
            </DialogTitle>
            <DialogDescription className="text-[11px] text-muted-foreground font-semibold mt-0.5">
              {isCreating
                ? "Fill in the form response fields to register a new entry."
                : "Update specific response fields of this record. Save to apply."}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pt-4 space-y-4 pb-6">
            {/* Modal Tabs */}
            {!isGenericForm && (
              <div className="flex flex-wrap gap-1.5 border-b border-border pb-3">
                {currentTabs.map((tab, idx) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      if (isCreating && !isGenericForm && idx > activeTabIndex) {
                        const schema = getSchemaForSlug(slug);
                        if (schema) {
                          const fieldsOnTab = currentGroups[activeModalTab] || [];
                          const errors = validateTabFields(schema, modalFormData, fieldsOnTab, columns);
                          if (Object.keys(errors).length > 0) {
                            setFormErrors((prev) => ({ ...prev, ...errors }));
                            return;
                          }
                        }
                      }
                      setFormErrors({});
                      setActiveModalTab(tab.key);
                    }}
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
              {isGenericForm ? (
                <div className="space-y-4 py-2">
                  {fieldSchemaList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {fieldSchemaList.map((col) => (
                        <div key={col.key} className="space-y-1">
                          <label className="block text-xs font-bold text-muted-foreground">
                            {col.label}
                          </label>
                          {col.type === "select" ? (
                            <select
                              value={modalFormData[col.key] ?? ""}
                              onChange={(e) =>
                                setModalFormData({ ...modalFormData, [col.key]: e.target.value })
                              }
                              className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
                            >
                              <option value="">-- Select {col.label} --</option>
                              {col.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : col.type === "boolean" ? (
                            <select
                              value={String(modalFormData[col.key] ?? "false")}
                              onChange={(e) =>
                                setModalFormData({
                                  ...modalFormData,
                                  [col.key]: e.target.value === "true",
                                })
                              }
                              className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
                            >
                              <option value="false">False / No</option>
                              <option value="true">True / Yes</option>
                            </select>
                          ) : col.type === "number" ? (
                            <Input
                              type="number"
                              value={modalFormData[col.key] ?? ""}
                              onChange={(e) =>
                                setModalFormData({
                                  ...modalFormData,
                                  [col.key]:
                                    e.target.value === "" ? "" : Number(e.target.value),
                                })
                              }
                              placeholder={`Enter ${col.label.toLowerCase()}...`}
                              className="w-full bg-background text-xs"
                            />
                          ) : col.type === "date" || col.key.includes("date") ? (
                            <Input
                              type="date"
                              value={
                                modalFormData[col.key]
                                  ? String(modalFormData[col.key]).split("T")[0]
                                  : ""
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                setModalFormData((prev: any) => {
                                  const updated = {
                                    ...prev,
                                    [col.key]: val ? val : null,
                                  };
                                  if (col.key === "reporting_date" && val) {
                                    const parts = val.split("-");
                                    if (parts.length === 3) {
                                      updated.reporting_year = Number(parts[0]);
                                      updated.reporting_month = Number(parts[1]);
                                    }
                                  }
                                  return updated;
                                });
                              }}
                              className="w-full bg-background text-xs font-mono"
                            />
                          ) : (
                            <Input
                              type="text"
                              value={modalFormData[col.key] ?? ""}
                              onChange={(e) =>
                                setModalFormData({
                                  ...modalFormData,
                                  [col.key]: e.target.value,
                                })
                              }
                              placeholder={`Enter ${col.label.toLowerCase()}...`}
                              className="w-full bg-background text-xs"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-muted-foreground">
                        Field Name / Label
                      </label>
                      <Input
                        value={genericFieldName}
                        onChange={(e) => setGenericFieldName(e.target.value)}
                        placeholder="Enter field name (e.g. household_count)..."
                        className="w-full bg-background font-mono text-xs"
                        required
                        autoFocus
                      />
                      <div className="p-3 bg-muted/30 border border-border rounded-xl text-xs text-muted-foreground flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-primary shrink-0" />
                        <span>
                          Tip: Click <strong>"Manage Fields"</strong> on the main table to define custom dynamic form schemas.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : isEvac ? (
                <EvacuationCentreFormFields
                  activeModalTab={activeModalTab}
                  modalFormData={modalFormData}
                  setModalFormData={setModalFormData}
                  isCreating={isCreating}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                />
              ) : isVillage ? (
                <VillageAssessmentFormFields
                  activeModalTab={activeModalTab}
                  modalFormData={modalFormData}
                  setModalFormData={setModalFormData}
                  isCreating={isCreating}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                />
              ) : isFiveW ? (
                <FiveWFormFields
                  activeModalTab={activeModalTab}
                  modalFormData={modalFormData}
                  setModalFormData={setModalFormData}
                  isCreating={isCreating}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                />
              ) : (
                <DisplacementFormFields
                  activeModalTab={activeModalTab}
                  modalFormData={modalFormData}
                  setModalFormData={setModalFormData}
                  isCreating={isCreating}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                />
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  {!isGenericForm && activeTabIndex > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveModalTab(currentTabs[activeTabIndex - 1].key)}
                      className="h-9 font-semibold cursor-pointer rounded-xl shadow-none"
                    >
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
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

                  {!isGenericForm && activeTabIndex < currentTabs.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNextTab}
                      className="h-9 font-bold cursor-pointer rounded-xl px-5 shadow-none"
                    >
                      Next
                    </Button>
                  ) : (
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
                  )}
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
