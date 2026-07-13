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
    op?: string
  ): Promise<PaginatedResponse<EvacuationCentreRecord>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/evacuation-centres/?page=${page}`;
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
    token: string | null
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
    op?: string
  ): Promise<PaginatedResponse<DisplacementRecord>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/displacements/?page=${page}`;
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
    token: string | null
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
    token: string | null
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
    token: string | null
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
};
