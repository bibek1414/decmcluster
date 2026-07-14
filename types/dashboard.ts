export interface DashboardSummary {
  id: number;
  estimated_idp: number;
  evacuation_centres: number;
  affected_hhs: number;
  villages_assessed: number;
  shelter_needs: number;
  access_to_basic_services: number;
  children_affected: number;
  person_with_disabilities: number;
  active_partners: number;
  response_coverage: number;
}

export interface EvacuationCentreLocationSummary {
  id: number;
  province: string;
  ecs: number;
  idps: number;
  order: number;
}

export interface ProvinceSectorSummary {
  id: number;
  title: string;
  percentage: number;
}

export interface HistoricalEvent {
  id: number;
  event: string;
  year: number;
  impact: string;
}

export interface EvacuationCentre {
  id: number;
  province: string;
  site_name: string;
  type: string;
  status: string;
  hhs: number;
}

export interface ResponseTrackingSummary {
  id: number;
  sector: string;
  partner: string;
  status: string;
  coverage: number;
}

export interface WashAndFacilities {
  toilets: number;
  showers: number;
  kitchen_facilities: number;
  laundry_facilities: number;
}

export interface EvacuationCenterProvinceInfo {
  province: string;
  total_ec: number;
  count: number;
}

export interface ReadinessIndicators {
  is_ec_owner_approved: number;
  is_ec_govt_approved: number;
  first_aid_kit_availability: number;
  first_aid_trained_person: number;
  kitchen_cooking_facilities: number;
  laundry_facilities: number;
}

export interface WashAndFacilityIndicators {
  total_water_storage_capacity: number;
  water_storage_sites: number;
  mens_toilet: number;
  female_toilet: number;
  total_unisex_toilet: number;
  total_disability_toilet: number;
  total_mens_shower: number;
  total_womens_shower: number;
  total_unisex_shower: number;
  total_disability_shower: number;
  total_disabilityies_shower: number;
  mens_toilet_sites: number;
  female_toilet_sites: number;
  total_unisex_toilet_sites: number;
  total_disability_toilet_sites: number;
  total_mens_shower_sites: number;
  total_womens_shower_sites: number;
  total_unisex_shower_sites: number;
  total_disability_shower_sites: number;
  kitchen_available_sites: number;
  laundry_available_sites: number;
}

export interface EvacuationCentresStats {
  total_ec: number;
  total_internal_capacity: number;
  total_toilets: number;
  total_water_storage: number;
  total_showers: number;
  is_govt_approved: number;
  first_aid_kit_available: number;
  first_aid_trained_person: number;
  ec_by_province: EvacuationCenterProvinceInfo[];
  readiness_indicators: ReadinessIndicators;
  wash_and_facility_indicators: WashAndFacilityIndicators;
}

export interface EvacuationCentreLocation {
  id: number;
  compound_name: string;
  latitude: number;
  longitude: number;
  is_ec_owner_approved: boolean;
  is_ec_govt_approved: boolean;
  province: string;
}

export interface IDPByYear {
  year: number;
  total_male: number;
  total_female: number;
  total_idp: number;
  total_vulnerable_hhs?: number;
  total_0_4?: number;
  total_5_17?: number;
  total_18_59?: number;
  total_60_plus?: number;
}

export interface IDPByAdmin1 {
  admin1_name: string;
  total_male: number;
  total_female: number;
  total_idp: number;
  total_vulnerable_hhs?: number;
  total_0_4?: number;
  total_5_17?: number;
  total_18_59?: number;
  total_60_plus?: number;
}

export interface DisplacementStats {
  total_idp: number;
  total_male: number;
  total_female: number;
  operation_count: number;
  total_vulnerable_hhs: number;
  total_0_4: number;
  total_5_17: number;
  total_18_59: number;
  total_60_plus: number;
  idps_by_year: IDPByYear[];
  idps_by_admin1: IDPByAdmin1[];
}
