import type { Product, ProductFilter } from "../types/product";
import type { Service, ServiceFilter } from "../types/service";
import type { SortOption } from "../components/SortDropdown";
import type { Carro } from "@/app/types/auth";
import { getProductCompatibility } from "./productCompatibility";

export const DEFAULT_PRICE_RANGE: [number, number] = [0, 500];

export function createEmptyProductFilters(): ProductFilter {
  return {
    categories: [],
    priceRange: DEFAULT_PRICE_RANGE,
    minRating: 0,
    brand: [],
    compatibility: [],
  };
}

export function createEmptyServiceFilters(): ServiceFilter {
  return {
    categories: [],
    priceRange: DEFAULT_PRICE_RANGE,
    minRating: 0,
    brand: [],
    compatibility: [],
  };
}

export function filterAndSortProducts(
  products: Product[],
  filters: ProductFilter,
  sortBy: SortOption,
  userCars: Carro[] = []
): Product[] {
  let result = [...products];

  // 1) FILTROS
  if (filters.categories.length > 0) {
    result = result.filter((p) => filters.categories.includes(p.category));
  }

  if (filters.brand.length > 0) {
    result = result.filter((p) => filters.brand.includes(p.brand));
  }

  if (filters.compatibility.length > 0) {
    result = result.filter((p) =>
      filters.compatibility.some((compat) =>
        p.compatibility.includes(compat)
      )
    );
  }

  result = result.filter(
    (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
  );

  if (filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating);
  }

  // 2) ORDENAMIENTO
  switch (sortBy) {
    case "price-low-high":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high-low":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    default:
      // "relevance": usamos compatibilidad + rating
      result.sort((a, b) => {
        const aComp = getProductCompatibility(a, userCars);
        const bComp = getProductCompatibility(b, userCars);

        // 1°: productos compatibles con tus carros
        if (aComp.isSpecificCompatible && !bComp.isSpecificCompatible) return -1;
        if (!aComp.isSpecificCompatible && bComp.isSpecificCompatible) return 1;

        // 2°: productos universales
        if (aComp.isUniversal && !bComp.isUniversal) return -1;
        if (!aComp.isUniversal && bComp.isUniversal) return 1;

        // 3°: rating
        return b.rating - a.rating;
      });
  }

  return result;
}

export function filterAndSortServices(
  services: Service[],
  filters: ServiceFilter,
  sortBy: SortOption
): Service[] {
  let result = [...services];

  // FILTROS
  if (filters.categories.length > 0) {
    result = result.filter((s) => filters.categories.includes(s.category));
  }

  result = result.filter(
    (s) => s.price >= filters.priceRange[0] && s.price <= filters.priceRange[1]
  );

  if (filters.minRating > 0) {
    result = result.filter((s) => s.rating >= filters.minRating);
  }

  // ORDENAMIENTO
  switch (sortBy) {
    case "price-low-high":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high-low":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // "relevance": priorizamos promocionados y luego rating
      result.sort((a, b) => {
        if (a.isPromoted && !b.isPromoted) return -1;
        if (!a.isPromoted && b.isPromoted) return 1;
        return b.rating - a.rating;
      });
  }

  return result;
}