import React from "react";
import { Input } from "@/components/ui/input";

export const DISPLACEMENT_COLUMNS = [
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
  { key: "reporting_date", label: "Reporting Date (YYYY-MM-DD)", type: "date" },
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
  {
    key: "operation_status",
    label: "Operation Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
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

interface DisplacementFormFieldsProps {
  activeModalTab: string;
  modalFormData: any;
  setModalFormData: React.Dispatch<React.SetStateAction<any>>;
  isCreating?: boolean;
  formErrors?: Record<string, string>;
  setFormErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function DisplacementFormFields({
  activeModalTab,
  modalFormData,
  setModalFormData,
  isCreating,
  formErrors,
  setFormErrors,
}: DisplacementFormFieldsProps) {
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
    timeline: ["reporting_date", "reporting_year", "reporting_month", "round_number"],
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[380px] content-start overflow-y-auto px-1 py-2">
      {activeFields.map((fieldKey) => {
        const col = DISPLACEMENT_COLUMNS.find((c) => c.key === fieldKey);
        if (!col) return null;

        const isDateField = col.type === "date" || col.key.includes("date");
        const fieldError = formErrors?.[col.key];

        const clearError = () => {
          if (fieldError && setFormErrors) {
            setFormErrors((prev) => {
              const copy = { ...prev };
              delete copy[col.key];
              return copy;
            });
          }
        };

        return (
          <div key={col.key} className="space-y-1">
            <label className="block text-xs font-bold text-muted-foreground">
              {col.label}
              {isCreating && col.key === "operation" && (
                <span className="text-rose-500 font-bold ml-0.5">*</span>
              )}
            </label>
            {col.type === "select" || (col as any).options ? (
              <select
                value={modalFormData[col.key] ?? ""}
                onChange={(e) => {
                  clearError();
                  setModalFormData((prev: any) => ({
                    ...prev,
                    [col.key]: e.target.value,
                  }));
                }}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none cursor-pointer"
              >
                <option value="">-- Select Option --</option>
                {(col as any).options?.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : col.type === "number" ? (
              <Input
                type="number"
                value={modalFormData[col.key] ?? ""}
                onChange={(e) => {
                  clearError();
                  const val = e.target.value;
                  setModalFormData((prev: any) => ({
                    ...prev,
                    [col.key]: val === "" ? "" : Number(val),
                  }));
                }}
                className="w-full bg-background shadow-none text-xs"
              />
            ) : isDateField ? (
              <Input
                type="date"
                value={
                  modalFormData[col.key]
                    ? String(modalFormData[col.key]).split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  clearError();
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
                className="w-full bg-background shadow-none text-xs font-mono"
              />
            ) : (
              <Input
                type="text"
                value={modalFormData[col.key] ?? ""}
                onChange={(e) => {
                  clearError();
                  setModalFormData((prev: any) => ({
                    ...prev,
                    [col.key]: e.target.value,
                  }));
                }}
                className="w-full bg-background shadow-none text-xs"
              />
            )}
            {fieldError && (
              <p className="text-[11px] font-medium text-rose-500 mt-1 animate-fadeIn">
                {fieldError}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
