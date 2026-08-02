export interface Announcement {
  id: number;
  title: string;
  slug: string;
  link: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedAnnouncementsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Announcement[];
}
