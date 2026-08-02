export interface EmergencyAlert {
  id: number;
  title: string;
  slug: string;
  link: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedEmergencyAlertsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmergencyAlert[];
}
