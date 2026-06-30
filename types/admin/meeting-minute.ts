export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface CommentData {
  id: number;
  comment?: string;
  text?: string;
  created_at: string;
  user?: UserProfile;
}

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
