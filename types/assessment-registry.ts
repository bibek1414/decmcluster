export interface AssessmentRegistryData {
  id: number;
  types_of_survey: string;
  level_of_survey: string;
  frequency: string | null;
  name_of_survey_tool: string | null;
  last_survey_conducted: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
