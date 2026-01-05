export interface Product {
  id: string;
  title: string;
  year_launched: number;
  primary_image_url: string;
  secondary_image_url: string | null;
  created_at: string;
  updated_at: string;
  display_order: number;
}

export interface ProductFormData {
  title: string;
  year_launched: number;
  primary_image?: File;
  secondary_image?: File;
  primary_image_url?: string;
  secondary_image_url?: string | null;
}

export interface UploadedImage {
  url: string;
  path: string;
}
