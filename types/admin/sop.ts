import { UserProfile, CommentData } from "./shared";

export interface SOPData {
  id: number;
  name: string;
  description: string | null;
  file: string | null;
  status: "unverified" | "verified" | "returned";
  comments: CommentData[] | string[];
  uploaded_by?: UserProfile | null;
  verified_by?: UserProfile | null;
  created_at: string;
  updated_at: string;
}

