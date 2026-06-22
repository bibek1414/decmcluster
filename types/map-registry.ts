export interface MapCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface MapData {
  id: number;
  name: string;
  category: number;
  category_name: string;
  file: string;
  created_at: string;
  updated_at: string;
}
