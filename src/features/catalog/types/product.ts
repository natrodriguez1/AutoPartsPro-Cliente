import type { ProductCore } from "@/domain/product";
import type { BaseFilters } from "./filters";
import { Carro } from "@/app/types/auth";

export type Product = ProductCore & {
  rating: number;
  reviewCount: number;
  compatibility: string[];
  isNew?: boolean;
  description?: string;
  workshopId?: string;
  workshopName?: string;
  image?: string;        // la “principal” (para cards)
  images?: string[];     // galería
};

export type SearchProduct = ProductCore;

export type ProductFilter = BaseFilters;

export type ProductCompatibility = {
  isUniversal: boolean;
  isSpecificCompatible: boolean;
  matchedCars: Carro[];
};