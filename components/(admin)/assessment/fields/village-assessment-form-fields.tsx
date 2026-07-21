import React from "react";
import { Input } from "@/components/ui/input";

export const VILLAGE_ASSESSMENT_COLUMNS = [
  { key: "id", label: "ID", type: "number", readonly: true },
  { key: "survey_start", label: "Survey Start", type: "text" },
  { key: "survey_end", label: "Survey End", type: "text" },
  { key: "survey_date", label: "Survey Date", type: "text" },
  { key: "enumerator_username", label: "Enumerator Username", type: "text" },
  { key: "device_id", label: "Device ID", type: "text" },
  { key: "audit_file", label: "Audit File", type: "text" },
  { key: "audit_url", label: "Audit URL", type: "text" },
  { key: "consent", label: "Consent", type: "text" },

  // Methodology
  { key: "methodology_individual_ki", label: "Methodology Individual KI", type: "text" },
  { key: "methodology_group_ki", label: "Methodology Group KI", type: "text" },
  { key: "methodology_direct_observation", label: "Methodology Direct Obs", type: "text" },
  { key: "methodology_other", label: "Methodology Other", type: "text" },
  { key: "data_collection_method", label: "Data Collection Method", type: "text" },

  // Key Informants 1-6
  { key: "ki1_name", label: "KI1 Name", type: "text" },
  { key: "ki1_type", label: "KI1 Type", type: "text" },
  { key: "ki1_gender", label: "KI1 Gender", type: "text" },
  { key: "ki1_age", label: "KI1 Age", type: "number" },
  { key: "ki1_contact", label: "KI1 Contact", type: "text" },
  { key: "ki2_name", label: "KI2 Name", type: "text" },
  { key: "ki2_type", label: "KI2 Type", type: "text" },
  { key: "ki2_gender", label: "KI2 Gender", type: "text" },
  { key: "ki2_age", label: "KI2 Age", type: "number" },
  { key: "ki2_contact", label: "KI2 Contact", type: "text" },
  { key: "ki3_name", label: "KI3 Name", type: "text" },
  { key: "ki3_type", label: "KI3 Type", type: "text" },
  { key: "ki3_gender", label: "KI3 Gender", type: "text" },
  { key: "ki3_age", label: "KI3 Age", type: "number" },
  { key: "ki3_contact", label: "KI3 Contact", type: "text" },
  { key: "ki4_name", label: "KI4 Name", type: "text" },
  { key: "ki4_type", label: "KI4 Type", type: "text" },
  { key: "ki4_gender", label: "KI4 Gender", type: "text" },
  { key: "ki4_age", label: "KI4 Age", type: "number" },
  { key: "ki4_contact", label: "KI4 Contact", type: "text" },
  { key: "ki5_name", label: "KI5 Name", type: "text" },
  { key: "ki5_type", label: "KI5 Type", type: "text" },
  { key: "ki5_gender", label: "KI5 Gender", type: "text" },
  { key: "ki5_age", label: "KI5 Age", type: "number" },
  { key: "ki5_contact", label: "KI5 Contact", type: "text" },
  { key: "ki6_name", label: "KI6 Name", type: "text" },
  { key: "ki6_type", label: "KI6 Type", type: "text" },
  { key: "ki6_gender", label: "KI6 Gender", type: "text" },
  { key: "ki6_age", label: "KI6 Age", type: "number" },
  { key: "ki6_contact", label: "KI6 Contact", type: "text" },

  // Assessment & Enumerators
  { key: "assessment_date", label: "Assessment Date", type: "text" },
  { key: "assessment_start_time", label: "Assessment Start Time", type: "text" },
  { key: "enumerator1_name", label: "Enumerator 1 Name", type: "text" },
  { key: "enumerator1_phone", label: "Enumerator 1 Phone", type: "text" },
  { key: "enumerator1_gender", label: "Enumerator 1 Gender", type: "text" },
  { key: "enumerator2_name", label: "Enumerator 2 Name", type: "text" },
  { key: "enumerator2_phone", label: "Enumerator 2 Phone", type: "text" },
  { key: "enumerator2_gender", label: "Enumerator 2 Gender", type: "text" },

  // Geographic Info
  { key: "province", label: "Province", type: "text" },
  { key: "area_council", label: "Area Council", type: "text" },
  { key: "village_name", label: "Village Name", type: "text" },
  { key: "village_other", label: "Village Other", type: "text" },
  { key: "village_condition", label: "Village Condition", type: "text" },

  // IDP & Returnee Stats
  { key: "idp_present", label: "IDP Present", type: "boolean" },
  { key: "idp_households_total", label: "IDP Households Total", type: "number" },
  { key: "idp_infant_male", label: "IDP Infant Male", type: "number" },
  { key: "idp_infant_female", label: "IDP Infant Female", type: "number" },
  { key: "idp_child_1_5_male", label: "IDP Child (1-5) Male", type: "number" },
  { key: "idp_child_1_5_female", label: "IDP Child (1-5) Female", type: "number" },
  { key: "idp_child_6_12_male", label: "IDP Child (6-12) Male", type: "number" },
  { key: "idp_child_6_12_female", label: "IDP Child (6-12) Female", type: "number" },
  { key: "idp_adolescent_male", label: "IDP Adolescent Male", type: "number" },
  { key: "idp_adolescent_female", label: "IDP Adolescent Female", type: "number" },
  { key: "idp_adult_male", label: "IDP Adult Male", type: "number" },
  { key: "idp_adult_female", label: "IDP Adult Female", type: "number" },
  { key: "idp_elderly_male", label: "IDP Elderly Male", type: "number" },
  { key: "idp_elderly_female", label: "IDP Elderly Female", type: "number" },
  { key: "idp_male_total", label: "IDP Male Total", type: "number" },
  { key: "idp_female_total", label: "IDP Female Total", type: "number" },
  { key: "idp_individuals_total", label: "IDP Individuals Total", type: "number" },
  { key: "returnees_present", label: "Returnees Present", type: "boolean" },
  { key: "returnee_households_total", label: "Returnee HH Total", type: "number" },
  { key: "returnee_individuals_total", label: "Returnee Individuals Total", type: "number" },

  // Vulnerabilities & Shelter
  { key: "pregnant_women_count", label: "Pregnant Women Count", type: "number" },
  { key: "female_headed_hh", label: "Female Headed HH", type: "number" },
  { key: "elderly_headed_hh", label: "Elderly Headed HH", type: "number" },
  { key: "male_headed_hh", label: "Male Headed HH", type: "number" },
  { key: "child_headed_hh", label: "Child Headed HH", type: "number" },
  { key: "pwd_total", label: "PWD Total", type: "number" },
  { key: "idp_pwd_total", label: "IDP PWD Total", type: "number" },
  { key: "shelter_primary", label: "Shelter Primary", type: "text" },
  { key: "shelter_secondary", label: "Shelter Secondary", type: "text" },
  { key: "displacement_shelter_type", label: "Displacement Shelter Type", type: "text" },
  { key: "displaced_hh_estimated", label: "Displaced HH Estimated", type: "number" },
  { key: "displacement_duration", label: "Displacement Duration", type: "text" },
  { key: "housing_type_pre_cyclone", label: "Housing Type Pre-Cyclone", type: "text" },
  { key: "house_rebuild_duration", label: "House Rebuild Duration", type: "text" },
  { key: "rebuild_material_type", label: "Rebuild Material Type", type: "text" },
  { key: "house_cyclone_resilience", label: "House Cyclone Resilience", type: "text" },
  { key: "remaining_idp_intention", label: "Remaining IDP Intention", type: "text" },

  // Community Context & Needs
  { key: "seasonal_worker_level", label: "Seasonal Worker Level", type: "text" },
  { key: "community_participation", label: "Community Participation", type: "text" },
  { key: "cdccc_exists", label: "CDCCC Exists", type: "boolean" },
  { key: "early_warning_received", label: "Early Warning Received", type: "boolean" },
  { key: "annual_population_displaced", label: "Annual Pop Displaced", type: "number" },
  { key: "top_need_1", label: "Top Need 1", type: "text" },
  { key: "top_need_2", label: "Top Need 2", type: "text" },
  { key: "top_need_3", label: "Top Need 3", type: "text" },

  // GPS & Submission Info
  { key: "gps_latitude", label: "GPS Latitude", type: "number" },
  { key: "gps_longitude", label: "GPS Longitude", type: "number" },
  { key: "gps_altitude", label: "GPS Altitude", type: "number" },
  { key: "gps_precision", label: "GPS Precision", type: "number" },
  { key: "record_id", label: "Record ID", type: "text" },
  { key: "record_uuid", label: "Record UUID", type: "text" },
  { key: "submission_time", label: "Submission Time", type: "text" },
  { key: "validation_status", label: "Validation Status", type: "text" },
  { key: "submission_status", label: "Submission Status", type: "text" },
  { key: "submitted_by", label: "Submitted By", type: "text" },
  { key: "form_version", label: "Form Version", type: "text" },
  { key: "record_index", label: "Record Index", type: "number" },
];

interface VillageAssessmentFormFieldsProps {
  activeModalTab: string;
  modalFormData: any;
  setModalFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function VillageAssessmentFormFields({
  activeModalTab,
  modalFormData,
  setModalFormData,
}: VillageAssessmentFormFieldsProps) {
  const fieldGroups: Record<string, string[]> = {
    general: [
      "survey_start",
      "survey_end",
      "survey_date",
      "enumerator_username",
      "device_id",
      "audit_file",
      "audit_url",
      "consent",
      "methodology_individual_ki",
      "methodology_group_ki",
      "methodology_direct_observation",
      "methodology_other",
      "data_collection_method",
    ],
    geography: [
      "province",
      "area_council",
      "village_name",
      "village_other",
      "village_condition",
      "assessment_date",
      "assessment_start_time",
      "enumerator1_name",
      "enumerator1_phone",
      "enumerator1_gender",
      "enumerator2_name",
      "enumerator2_phone",
      "enumerator2_gender",
    ],
    key_informants: [
      "ki1_name", "ki1_type", "ki1_gender", "ki1_age", "ki1_contact",
      "ki2_name", "ki2_type", "ki2_gender", "ki2_age", "ki2_contact",
      "ki3_name", "ki3_type", "ki3_gender", "ki3_age", "ki3_contact",
      "ki4_name", "ki4_type", "ki4_gender", "ki4_age", "ki4_contact",
      "ki5_name", "ki5_type", "ki5_gender", "ki5_age", "ki5_contact",
      "ki6_name", "ki6_type", "ki6_gender", "ki6_age", "ki6_contact",
    ],
    idp_statistics: [
      "idp_present",
      "idp_households_total",
      "idp_infant_male",
      "idp_infant_female",
      "idp_child_1_5_male",
      "idp_child_1_5_female",
      "idp_child_6_12_male",
      "idp_child_6_12_female",
      "idp_adolescent_male",
      "idp_adolescent_female",
      "idp_adult_male",
      "idp_adult_female",
      "idp_elderly_male",
      "idp_elderly_female",
      "idp_male_total",
      "idp_female_total",
      "idp_individuals_total",
      "returnees_present",
      "returnee_households_total",
      "returnee_individuals_total",
    ],
    vulnerabilities_shelter: [
      "pregnant_women_count",
      "female_headed_hh",
      "elderly_headed_hh",
      "male_headed_hh",
      "child_headed_hh",
      "pwd_total",
      "idp_pwd_total",
      "shelter_primary",
      "shelter_secondary",
      "displacement_shelter_type",
      "displaced_hh_estimated",
      "displacement_duration",
      "housing_type_pre_cyclone",
      "house_rebuild_duration",
      "rebuild_material_type",
      "house_cyclone_resilience",
      "remaining_idp_intention",
    ],
    community_needs: [
      "seasonal_worker_level",
      "community_participation",
      "cdccc_exists",
      "early_warning_received",
      "annual_population_displaced",
      "top_need_1",
      "top_need_2",
      "top_need_3",
    ],
    gps_submission: [
      "gps_latitude",
      "gps_longitude",
      "gps_altitude",
      "gps_precision",
      "record_id",
      "record_uuid",
      "submission_time",
      "validation_status",
      "submission_status",
      "submitted_by",
      "form_version",
      "record_index",
    ],
  };

  const activeFields = fieldGroups[activeModalTab] || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[380px] content-start overflow-y-auto px-1 py-2">
      {activeFields.map((fieldKey) => {
        const col = VILLAGE_ASSESSMENT_COLUMNS.find((c) => c.key === fieldKey);
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
