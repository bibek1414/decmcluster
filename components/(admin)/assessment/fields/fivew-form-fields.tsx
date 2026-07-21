import React from "react";
import { Input } from "@/components/ui/input";

export const FIVEW_COLUMNS = [
  { key: "id", label: "ID", type: "number", readonly: true },
  // Organization & Admin
  { key: "donor", label: "Donor", type: "text" },
  { key: "donor_names", label: "Donor Names", type: "text" },
  { key: "reporting_org_name", label: "Reporting Org Name", type: "text" },
  { key: "ro_code", label: "RO Code", type: "text" },
  { key: "reporting_org_type", label: "Reporting Org Type", type: "text" },
  { key: "other_ip_name", label: "Other IP Name", type: "text" },
  { key: "ip_code", label: "IP Code", type: "text" },
  { key: "ip_type", label: "IP Type", type: "text" },
  { key: "reporting_month", label: "Reporting Month", type: "text" },
  { key: "activity_status", label: "Activity Status", type: "text" },

  // Location & Cluster
  { key: "state_abyei", label: "State / Abyei", type: "text" },
  { key: "admin1_code", label: "Admin1 Code", type: "text" },
  { key: "province", label: "Province", type: "text" },
  { key: "admin2_code", label: "Admin2 Code", type: "text" },
  { key: "location_evac_name", label: "Location Evac Name", type: "text" },
  { key: "cluster_name", label: "Cluster Name", type: "text" },
  { key: "hrp_non_hrp", label: "HRP / non-HRP", type: "text" },

  // Project & Activity
  { key: "project_number", label: "Project Number", type: "text" },
  { key: "project_name", label: "Project Name", type: "text" },
  { key: "activity", label: "Activity", type: "text" },
  { key: "indicator", label: "Indicator", type: "text" },
  { key: "unit", label: "Unit", type: "text" },
  { key: "target", label: "Target", type: "number" },

  // Financial & Modality
  { key: "total_value", label: "Total Value", type: "number" },
  { key: "new_beneficiaries", label: "New Beneficiaries", type: "boolean" },
  { key: "is_mpc", label: "Is MPC", type: "boolean" },
  { key: "modality", label: "Modality", type: "text" },
  { key: "type_of_modality", label: "Type of Modality", type: "text" },
  { key: "delivery_mechanism", label: "Delivery Mechanism", type: "text" },
  { key: "number_of_transfers", label: "Number of Transfers", type: "number" },
  { key: "value_ssp", label: "Value SSP", type: "number" },
  { key: "value_usd", label: "Value USD", type: "number" },

  // Beneficiaries & Breakdown
  { key: "beneficiaries_type_under_18", label: "Beneficiaries Type Under 18", type: "text" },
  { key: "child_male_under_18", label: "Child Male (<18)", type: "number" },
  { key: "child_female_under_18", label: "Child Female (<18)", type: "number" },
  { key: "adult_male_18_60", label: "Adult Male (18-60)", type: "number" },
  { key: "adult_female_18_60", label: "Adult Female (18-60)", type: "number" },
  { key: "elderly_male_60_plus", label: "Elderly Male (60+)", type: "number" },
  { key: "elderly_female_60_plus", label: "Elderly Female (60+)", type: "number" },
  { key: "total_beneficiaries_reached", label: "Total Beneficiaries Reached", type: "number" },
  { key: "people_with_disability", label: "People with Disability", type: "number" },
  { key: "boys_above_5", label: "Boys >5", type: "number" },
  { key: "girls_above_5", label: "Girls >5", type: "number" },
  { key: "boys_5_17", label: "Boys (5-17)", type: "number" },
  { key: "girls_5_17", label: "Girls (5-17)", type: "number" },
  { key: "men_18_59", label: "Men (18-59)", type: "number" },
  { key: "women_18_59", label: "Women (18-59)", type: "number" },
  { key: "men_60_plus", label: "Men (60+)", type: "number" },
  { key: "women_60_plus", label: "Women (60+)", type: "number" },
  { key: "total_reached_quarter", label: "Total Reached Quarter", type: "number" },

  // Indicators & Sub-activities
  { key: "comments", label: "Comments", type: "text" },
  { key: "contribute_hrp_aap", label: "Contribute HRP AAP", type: "text" },
  { key: "hrp_aap_indicators", label: "HRP AAP Indicators", type: "text" },
  { key: "activity_type", label: "Activity Type", type: "text" },
  { key: "sub_activity_type", label: "Sub Activity Type", type: "text" },
  { key: "measurements", label: "Measurements", type: "text" },
  { key: "achieved", label: "Achieved", type: "number" },
  { key: "column1", label: "Column1", type: "text" },
];

interface FiveWFormFieldsProps {
  activeModalTab: string;
  modalFormData: any;
  setModalFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function FiveWFormFields({
  activeModalTab,
  modalFormData,
  setModalFormData,
}: FiveWFormFieldsProps) {
  const fieldGroups: Record<string, string[]> = {
    org_admin: [
      "donor",
      "donor_names",
      "reporting_org_name",
      "ro_code",
      "reporting_org_type",
      "other_ip_name",
      "ip_code",
      "ip_type",
      "reporting_month",
      "activity_status",
    ],
    location_cluster: [
      "state_abyei",
      "admin1_code",
      "province",
      "admin2_code",
      "location_evac_name",
      "cluster_name",
      "hrp_non_hrp",
    ],
    project_activity: [
      "project_number",
      "project_name",
      "activity",
      "indicator",
      "unit",
      "target",
    ],
    financial_modality: [
      "total_value",
      "new_beneficiaries",
      "is_mpc",
      "modality",
      "type_of_modality",
      "delivery_mechanism",
      "number_of_transfers",
      "value_ssp",
      "value_usd",
    ],
    beneficiaries: [
      "beneficiaries_type_under_18",
      "child_male_under_18",
      "child_female_under_18",
      "adult_male_18_60",
      "adult_female_18_60",
      "elderly_male_60_plus",
      "elderly_female_60_plus",
      "total_beneficiaries_reached",
      "people_with_disability",
      "boys_above_5",
      "girls_above_5",
      "boys_5_17",
      "girls_5_17",
      "men_18_59",
      "women_18_59",
      "men_60_plus",
      "women_60_plus",
      "total_reached_quarter",
    ],
    indicators_sub: [
      "comments",
      "contribute_hrp_aap",
      "hrp_aap_indicators",
      "activity_type",
      "sub_activity_type",
      "measurements",
      "achieved",
      "column1",
    ],
  };

  const activeFields = fieldGroups[activeModalTab] || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[380px] content-start overflow-y-auto px-1 py-2">
      {activeFields.map((fieldKey) => {
        const col = FIVEW_COLUMNS.find((c) => c.key === fieldKey);
        if (!col) return null;

        return (
          <div key={col.key} className="space-y-1">
            <label className="block text-xs font-bold text-muted-foreground">{col.label}</label>
            {col.type === "boolean" ? (
              <select
                value={String(modalFormData[col.key] ?? "")}
                onChange={(e) => {
                  const val = e.target.value;
                  setModalFormData((prev: any) => ({
                    ...prev,
                    [col.key]: val === "true" ? true : val === "false" ? false : null,
                  }));
                }}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
              >
                <option value="">-- Blank/Null --</option>
                <option value="true">True / Yes</option>
                <option value="false">False / No</option>
              </select>
            ) : col.type === "number" ? (
              <Input
                type="number"
                value={modalFormData[col.key] ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setModalFormData((prev: any) => ({
                    ...prev,
                    [col.key]: val === "" ? null : Number(val),
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
