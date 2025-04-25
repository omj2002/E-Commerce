export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  discount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
} 