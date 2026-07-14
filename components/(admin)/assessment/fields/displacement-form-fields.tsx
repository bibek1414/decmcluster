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

interface DisplacementFormFieldsProps {
  activeModalTab: string;
  modalFormData: any;
  setModalFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function DisplacementFormFields({
  activeModalTab,
  modalFormData,
  setModalFormData,
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

        return (
          <div key={col.key} className="space-y-1">
            <label className="block text-xs font-bold text-muted-foreground">{col.label}</label>
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
}
