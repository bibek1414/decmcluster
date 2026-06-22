export interface MapCategory {
  id: number;
  name: string;
  slug?: string; // Optional if backend doesn't return it
  created_at: string;
  updated_at: string;
}

export interface MapData {
  id: number;
  name: string;
  category: number;
  category_name: string;
  image: string; // Changed from file to image
  created_at: string;
  updated_at: string;
}
