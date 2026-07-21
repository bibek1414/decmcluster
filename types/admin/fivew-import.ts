export interface FiveWImportData {
  id: number;
  name: string;
  file: string;
  status: "unverified" | "verified" | "returned";
  uploaded_by: { id: number; email: string } | null;
  verified_by: { id: number; email: string } | null;
  created_at: string;
  updated_at: string;
  comments?: any[];
}
