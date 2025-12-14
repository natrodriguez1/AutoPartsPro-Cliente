import { useState, useMemo } from "react";
import type { Product, ProductFilter } from "../types/product";
import type { Carro } from "@/app/types/auth";
import type { SortOption } from "../components/SortDropdown";
import {
  createEmptyProductFilters,
  filterAndSortProducts,
} from "../utils/filtering";

export function useProductFilters(
  products: Product[],
  userCars: Carro[] = [],
  sortBy: SortOption
) {
  const [filters, setFilters] = useState<ProductFilter>(
    createEmptyProductFilters()
  );

  const items = useMemo(
    () => filterAndSortProducts(products, filters, sortBy, userCars),
    [products, filters, sortBy, userCars]
  );

  const clearFilters = () => setFilters(createEmptyProductFilters());

  return {
    filters,
    setFilters,
    items,
    clearFilters,
  };
}