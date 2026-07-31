export interface LatestUpdateCategory {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryDetails extends LatestUpdateCategory {}

export interface LatestUpdate {
  id: number;
  category?: number | null;
  category_details?: CategoryDetails | null;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  thumbnail_image: string | null;
  thumbnail_alt_desc: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedLatestUpdatesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LatestUpdate[];
}

export interface PaginatedCategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LatestUpdateCategory[];
}
