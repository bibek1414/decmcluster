import React from "react";
import { Input } from "@/components/ui/input";

export const EVACUATION_CENTRE_COLUMNS = [
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

interface EvacuationCentreFormFieldsProps {
  activeModalTab: string;
  modalFormData: any;
  setModalFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function EvacuationCentreFormFields({
  activeModalTab,
  modalFormData,
  setModalFormData,
}: EvacuationCentreFormFieldsProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[380px] content-start overflow-y-auto px-1 py-2">
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
}
