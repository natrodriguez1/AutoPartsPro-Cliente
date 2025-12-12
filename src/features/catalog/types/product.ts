import type { ProductCore } from "@/domain/product";

export type Product = ProductCore & {
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  compatibility: string[];
  isSale?: boolean;
  salePercentage?: number;
  isNew?: boolean;
  description?: string;
  workshopId?: string;
  workshopName?: string;
};

export type SearchProduct = ProductCore;

export type ProductFilter = {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
    brand: string[];
    compatibility: string[];
}