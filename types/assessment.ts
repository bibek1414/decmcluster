export interface AssessmentData {
  id: number;
  name: string;
  slug?: string | null;
  description?: string | null;
  pdf?: string | null;
  excel?: string | null;
  created_at: string;
  updated_at: string;
}
