

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
  author?: UserProfile;
  user?: UserProfile;
}
