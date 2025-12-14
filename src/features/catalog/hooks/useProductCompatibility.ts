import { useMemo } from "react";
import type { Product } from "../types/product";
import type { Carro } from "@/app/types/auth";
import type { ProductCompatibility } from "../types/product";
import { getProductCompatibility } from "../utils/productCompatibility";

export function useProductCompatibility(
  product: Product,
  userCars: Carro[] = []
): ProductCompatibility {
  return useMemo(() => getProductCompatibility(product, userCars),
    [product.compatibility, userCars]);
}
