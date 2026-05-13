// src/types/product.ts
export type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  tags: string[];
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  specs: Record<string, string>;
  features: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
};

export type ProductCategory = {
  name: string;
  count: number;
  description: string;
  featuredImage?: string;
};
