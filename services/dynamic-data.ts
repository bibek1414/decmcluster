import { siteConfig } from "@/config/site";
import { PaginatedResponse } from "@/types/assessment-registry";

export interface EvacuationCentreRecord {
  id: number;
  country: string | null;
  organization: string | null;
  agency: string | null;
  compound_name: string | null;
  latitude: number | null;
  longitude: number | null;
  province: string | null;
  area_council: string | null;
  island: string | null;
  village: string | null;
  primary_contact: string | null;
  secondary_contact: string | null;
  compound_function: string | null;
  is_ec_owner_approved: boolean | null;
  is_ec_govt_approved: boolean | null;
  name_of_outside_temporary_shelter: string | null;
  outside_temporary_shelter_capacity: number | null;
  first_aid_kit_availability: boolean | null;
  first_aid_trained_person: boolean | null;
  electricity_source: string | null;
  drinking_water_source: string | null;
  washing_water_source: string | null;
  water_storage_capacity_litres: number | null;
  no_of_buildings: number | null;
  no_of_rooms: number | null;
  internal_building_evacuee_capacity: number | null;
  disaster_suitable_for: string | null;
  enginerring_certified_cyclone_rating: string | null;
  total_mens_toilet: number | null;
  total_womens_toilet: number | null;
  total_unisex_toilet: number | null;
  total_disability_access_toilet: number | null;
  total_mens_shower: number | null;
  total_womens_shower: number | null;
  total_unisex_shower: number | null;
  total_disability_access_shower: number | null;
  kitchen_cooking_facilities: boolean | null;
  laundry_facilities: boolean | null;
  communication_back_up: string | null;
  created_at: string;
  updated_at: string;
}

export interface DisplacementRecord {
  id: number;
  operation_code: string | null;
  operation: string | null;
  admin0_name: string | null;
  admin0_pcode: string | null;
  admin1_name: string | null;
  admin1_pcode: string | null;
  admin2_name: string | null;
  admin2_pcode: string | null;
  admin_level: number | null;
  num_present_idps: number | null;
  reporting_date: string | null;
  reporting_year: number | null;
  reporting_month: number | null;
  round_number: number | null;
  displacement_reason: string | null;
  males_number: number | null;
  female_number: number | null;
  males_number_0_4: number | null;
  females_number_0_4: number | null;
  males_number_5_17: number | null;
  females_number_5_17: number | null;
  males_number_18_59: number | null;
  females_number_18_59: number | null;
  males_number_60_plus: number | null;
  females_number_60_plus: number | null;
  total_vul_hhs: number | null;
  idp_origin_admin1_name: string | null;
  idp_origin_admin1_pcode: string | null;
  assessment_type: string | null;
  operation_status: string | null;
  idp_destination: string | null;
  idp_destination_admin1_name: string | null;
  idp_destination_admin1_pcode: string | null;
}

export interface VillageAssessmentRecord {
  id: number;
  survey_start: string | null;
  survey_end: string | null;
  survey_date: string | null;
  enumerator_username: string | null;
  device_id: string | null;
  audit_file: string | null;
  audit_url: string | null;
  consent: string | null;
  methodology_individual_ki: string | null;
  methodology_group_ki: string | null;
  methodology_direct_observation: string | null;
  methodology_other: string | null;
  data_collection_method: string | null;
  ki1_name: string | null;
  ki1_type: string | null;
  ki1_gender: string | null;
  ki1_age: number | null;
  ki1_contact: string | null;
  ki2_name: string | null;
  ki2_type: string | null;
  ki2_gender: string | null;
  ki2_age: number | null;
  ki2_contact: string | null;
  ki3_name: string | null;
  ki3_type: string | null;
  ki3_gender: string | null;
  ki3_age: number | null;
  ki3_contact: string | null;
  ki4_name: string | null;
  ki4_type: string | null;
  ki4_gender: string | null;
  ki4_age: number | null;
  ki4_contact: string | null;
  ki5_name: string | null;
  ki5_type: string | null;
  ki5_gender: string | null;
  ki5_age: number | null;
  ki5_contact: string | null;
  ki6_name: string | null;
  ki6_type: string | null;
  ki6_gender: string | null;
  ki6_age: number | null;
  ki6_contact: string | null;
  assessment_date: string | null;
  assessment_start_time: string | null;
  enumerator1_name: string | null;
  enumerator1_phone: string | null;
  enumerator1_gender: string | null;
  enumerator2_name: string | null;
  enumerator2_phone: string | null;
  enumerator2_gender: string | null;
  province: string | null;
  area_council: string | null;
  village_name: string | null;
  village_other: string | null;
  village_condition: string | null;
  idp_present: boolean | null;
  idp_households_total: number | null;
  idp_infant_male: number | null;
  idp_infant_female: number | null;
  idp_child_1_5_male: number | null;
  idp_child_1_5_female: number | null;
  idp_child_6_12_male: number | null;
  idp_child_6_12_female: number | null;
  idp_adolescent_male: number | null;
  idp_adolescent_female: number | null;
  idp_adult_male: number | null;
  idp_adult_female: number | null;
  idp_elderly_male: number | null;
  idp_elderly_female: number | null;
  idp_male_total: number | null;
  idp_female_total: number | null;
  idp_individuals_total: number | null;
  returnees_present: boolean | null;
  returnee_households_total: number | null;
  returnee_individuals_total: number | null;
  pregnant_women_count: number | null;
  female_headed_hh: number | null;
  elderly_headed_hh: number | null;
  male_headed_hh: number | null;
  child_headed_hh: number | null;
  pwd_total: number | null;
  idp_pwd_total: number | null;
  shelter_primary: string | null;
  shelter_secondary: string | null;
  displacement_shelter_type: string | null;
  displaced_hh_estimated: number | null;
  displacement_duration: string | null;
  housing_type_pre_cyclone: string | null;
  house_rebuild_duration: string | null;
  rebuild_material_type: string | null;
  house_cyclone_resilience: string | null;
  remaining_idp_intention: string | null;
  seasonal_worker_level: string | null;
  community_participation: string | null;
  cdccc_exists: boolean | null;
  early_warning_received: boolean | null;
  annual_population_displaced: number | null;
  top_need_1: string | null;
  top_need_2: string | null;
  top_need_3: string | null;
  gps_latitude: number | null;
  gps_longitude: number | null;
  gps_altitude: number | null;
  gps_precision: number | null;
  record_id: string | null;
  record_uuid: string | null;
  submission_time: string | null;
  validation_status: string | null;
  submission_status: string | null;
  submitted_by: string | null;
  form_version: string | null;
  record_index: number | null;
  created_at: string;
  updated_at: string;
}

const getHeaders = (token: string | null) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    if (token.startsWith("eyJ") || token.includes(".")) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      headers["Authorization"] = `Token ${token}`;
    }
  }
  return headers;
};

export const dynamicDataService = {
  fetchEvacuationCentres: async (
    page: number = 1,
    search: string = "",
    token: string | null = null,
    province?: string,
    district?: string,
    op?: string,
    pageSize: number = 50,
  ): Promise<PaginatedResponse<EvacuationCentreRecord>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/evacuation-centres/?page=${page}&page_size=${pageSize}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (province) {
      url += `&province=${encodeURIComponent(province)}`;
    }
    if (district) {
      url += `&area_council=${encodeURIComponent(district)}`;
    }
    if (op) {
      url += `&compound_function=${encodeURIComponent(op)}`;
    }
    const res = await fetch(url, { headers: getHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch evacuation centres data");
    return res.json();
  },

  updateEvacuationCentre: async (
    id: number,
    fields: Partial<EvacuationCentreRecord>,
    token: string | null,
  ): Promise<EvacuationCentreRecord> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/evacuation-centres/${id}/`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to update evacuation centre";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) errorMsg = parsed.detail;
        else if (typeof parsed === "object") {
          const firstKey = Object.keys(parsed)[0];
          errorMsg = `${firstKey}: ${parsed[firstKey]}`;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return res.json();
  },

  fetchDisplacements: async (
    page: number = 1,
    search: string = "",
    token: string | null = null,
    province?: string,
    district?: string,
    op?: string,
    pageSize: number = 50,
  ): Promise<PaginatedResponse<DisplacementRecord>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/displacements/?page=${page}&page_size=${pageSize}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (province) {
      url += `&admin1_name=${encodeURIComponent(province)}`;
    }
    if (district) {
      url += `&admin2_name=${encodeURIComponent(district)}`;
    }
    if (op) {
      url += `&operation=${encodeURIComponent(op)}`;
    }
    const res = await fetch(url, { headers: getHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch displacements data");
    return res.json();
  },

  updateDisplacement: async (
    id: number,
    fields: Partial<DisplacementRecord>,
    token: string | null,
  ): Promise<DisplacementRecord> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/displacements/${id}/`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to update displacement";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) errorMsg = parsed.detail;
        else if (typeof parsed === "object") {
          const firstKey = Object.keys(parsed)[0];
          errorMsg = `${firstKey}: ${parsed[firstKey]}`;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return res.json();
  },

  createEvacuationCentre: async (
    fields: Partial<EvacuationCentreRecord>,
    token: string | null,
  ): Promise<EvacuationCentreRecord> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/evacuation-centres/`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to create evacuation centre";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) errorMsg = parsed.detail;
        else if (typeof parsed === "object") {
          const firstKey = Object.keys(parsed)[0];
          errorMsg = `${firstKey}: ${parsed[firstKey]}`;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return res.json();
  },

  createDisplacement: async (
    fields: Partial<DisplacementRecord>,
    token: string | null,
  ): Promise<DisplacementRecord> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/displacements/`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to create displacement";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) errorMsg = parsed.detail;
        else if (typeof parsed === "object") {
          const firstKey = Object.keys(parsed)[0];
          errorMsg = `${firstKey}: ${parsed[firstKey]}`;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return res.json();
  },

  deleteEvacuationCentre: async (id: number, token: string | null): Promise<void> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/evacuation-centres/${id}/`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to delete evacuation centre");
  },

  deleteDisplacement: async (id: number, token: string | null): Promise<void> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/displacements/${id}/`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to delete displacement record");
  },

  exportEvacuationCentres: async (
    columns: string[],
    token: string | null,
    province?: string,
    district?: string,
    op?: string,
    search?: string,
  ): Promise<Blob> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const params = new URLSearchParams();
    if (columns.length > 0) params.set("columns", columns.join(","));
    if (province) params.set("province", province);
    if (district) params.set("area_council", district);
    if (op) params.set("compound_function", op);
    if (search?.trim()) params.set("search", search.trim());

    const res = await fetch(`${baseUrl}/api/evacuation-centres/export/?${params.toString()}`, {
      headers: {
        ...getHeaders(token),
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
    if (!res.ok) throw new Error("Failed to export evacuation centres");
    return res.blob();
  },

  exportDisplacements: async (
    columns: string[],
    token: string | null,
    province?: string,
    district?: string,
    op?: string,
    search?: string,
  ): Promise<Blob> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const params = new URLSearchParams();
    if (columns.length > 0) params.set("columns", columns.join(","));
    if (province) params.set("admin1_name", province);
    if (district) params.set("admin2_name", district);
    if (op) params.set("operation", op);
    if (search?.trim()) params.set("search", search.trim());

    const res = await fetch(`${baseUrl}/api/displacements/export/?${params.toString()}`, {
      headers: {
        ...getHeaders(token),
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
    if (!res.ok) throw new Error("Failed to export displacements");
    return res.blob();
  },

  importEvacuationCentres: async (file: File, token: string | null): Promise<any> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const formData = new FormData();
    formData.append("file", file);

    const headers = getHeaders(token);
    delete headers["Content-Type"]; // Let browser set Content-Type with boundary for FormData

    const res = await fetch(`${baseUrl}/api/evacuation-centres/import/`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to import evacuation centres");
    }
    return res.json();
  },

  importDisplacements: async (file: File, token: string | null): Promise<any> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const formData = new FormData();
    formData.append("file", file);

    const headers = getHeaders(token);
    delete headers["Content-Type"]; // Let browser set Content-Type with boundary for FormData

    const res = await fetch(`${baseUrl}/api/displacements/import/`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to import displacements");
    }
    return res.json();
  },

  fetchVillageAssessments: async (
    page: number = 1,
    search: string = "",
    token: string | null = null,
    province?: string,
    district?: string,
    op?: string,
    pageSize: number = 50,
  ): Promise<PaginatedResponse<VillageAssessmentRecord>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/village-assessments/?page=${page}&page_size=${pageSize}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (province) {
      url += `&province=${encodeURIComponent(province)}`;
    }
    if (district) {
      url += `&area_council=${encodeURIComponent(district)}`;
    }
    if (op) {
      url += `&village_name=${encodeURIComponent(op)}`;
    }
    const res = await fetch(url, { headers: getHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch village assessments data");
    return res.json();
  },

  updateVillageAssessment: async (
    id: number,
    fields: Partial<VillageAssessmentRecord>,
    token: string | null,
  ): Promise<VillageAssessmentRecord> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/village-assessments/${id}/`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to update village assessment";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) errorMsg = parsed.detail;
        else if (typeof parsed === "object") {
          const firstKey = Object.keys(parsed)[0];
          errorMsg = `${firstKey}: ${parsed[firstKey]}`;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return res.json();
  },

  createVillageAssessment: async (
    fields: Partial<VillageAssessmentRecord>,
    token: string | null,
  ): Promise<VillageAssessmentRecord> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/village-assessments/`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to create village assessment";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) errorMsg = parsed.detail;
        else if (typeof parsed === "object") {
          const firstKey = Object.keys(parsed)[0];
          errorMsg = `${firstKey}: ${parsed[firstKey]}`;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return res.json();
  },

  deleteVillageAssessment: async (id: number, token: string | null): Promise<void> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/village-assessments/${id}/`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to delete village assessment");
  },

  exportVillageAssessments: async (
    columns: string[],
    token: string | null,
    province?: string,
    district?: string,
    op?: string,
    search?: string,
  ): Promise<Blob> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const params = new URLSearchParams();
    if (columns.length > 0) params.set("columns", columns.join(","));
    if (province) params.set("province", province);
    if (district) params.set("area_council", district);
    if (op) params.set("village_name", op);
    if (search?.trim()) params.set("search", search.trim());

    const res = await fetch(`${baseUrl}/api/village-assessments/export/?${params.toString()}`, {
      headers: {
        ...getHeaders(token),
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
    if (!res.ok) throw new Error("Failed to export village assessments");
    return res.blob();
  },

  importVillageAssessments: async (file: File, token: string | null): Promise<any> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const formData = new FormData();
    formData.append("file", file);

    const headers = getHeaders(token);
    delete headers["Content-Type"];

    const res = await fetch(`${baseUrl}/api/village-assessments/import/`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to import village assessments");
    }
    return res.json();
  },
};

