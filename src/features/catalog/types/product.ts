import type { ProductCore } from "@/domain/product";
import type { BaseFilters } from "./filters";
import { Carro } from "@/app/types/auth";

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

export type ProductFilter = BaseFilters;

export type ProductCompatibility = {
  isUniversal: boolean;
  isSpecificCompatible: boolean;
  matchedCars: Carro[];
};