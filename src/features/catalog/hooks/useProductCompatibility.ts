import { useMemo } from "react";
import type { Product } from "../types/product";
import type { Carro } from "@/app/types/auth";
import type { ProductCompatibility } from "../types/product";
import { getProductCompatibility } from "../utils/productCompatibility";

export function useProductCompatibility(
  product: Product | null | undefined,
  userCars: Carro[] = []
): ProductCompatibility {
  return useMemo<ProductCompatibility>(() =>{
    if (!product) {
      return {
        isUniversal: false,
        isSpecificCompatible: false,
        matchedCars: [],
      };
    }

    return getProductCompatibility(product, userCars);
  }, [product, userCars]);
}
