import { UserProfile, CommentData } from "./shared";
export type { UserProfile, CommentData };
export interface MeetingMinuteData {
  id: number;
  name: string;
  file: string;
  status: "unverified" | "verified" | "returned";
  comments: CommentData[] | string[];
  uploaded_by?: UserProfile | null;
  verified_by?: UserProfile | null;
  created_at: string;
  updated_at: string;
}
