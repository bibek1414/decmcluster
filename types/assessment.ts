export interface AssessmentData {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  pdf?: string | null;
  excel?: string | null;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResultData {
  id: number;
  assessment: number;
  title: string;
  description?: string | null;
  file?: string | null;
  created_at: string;
  updated_at: string;
}
