export interface ArchiveData {
  id: number;
  survey_type: string;
  date: string;
  survery_tools?: string | null;
  survey_tools?: string | null;
  level: string;
  file: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArchiveCreatePayload {
  survey_type: string;
  date: string;
  survery_tools: string;
  level: string;
  file?: File | null;
}

export interface ArchiveUpdatePayload {
  survey_type?: string;
  date?: string;
  survery_tools?: string;
  level?: string;
  file?: File | null;
}
