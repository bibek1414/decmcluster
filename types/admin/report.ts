import { UserProfile, CommentData } from "./shared";

export interface ReportData {
  id: number;
  name: string;
  file: string | null;
  image: string | null;
  type: string;
  url: string | null;
  date: string;
  status: "unverified" | "verified" | "returned";
  comments: CommentData[] | string[];
  uploaded_by?: UserProfile | null;
  verified_by?: UserProfile | null;
  created_at: string;
  updated_at: string;
}
