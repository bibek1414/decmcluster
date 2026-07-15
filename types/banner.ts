export interface BannerData {
  id: number;
  name: string;
  Image: string; // The URL/path to the image
  image?: string; // Fallback helper
  description: string;
  created_at?: string;
  updated_at?: string;
}
