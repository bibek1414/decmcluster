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
