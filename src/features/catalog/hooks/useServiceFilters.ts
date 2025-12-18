import { useState, useMemo } from "react";
import type { Service, ServiceFilter } from "../types/service";
import type { SortOption } from "../components/SortDropdown";
import {
  createEmptyServiceFilters,
  filterAndSortServices,
} from "../utils/filtering";

export function useServiceFilters(
  services: Service[],
  sortBy: SortOption
) {
  const [filters, setFilters] = useState<ServiceFilter>(
    createEmptyServiceFilters()
  );

  const items = useMemo(
    () => filterAndSortServices(services, filters, sortBy),
    [services, filters, sortBy]
  );

  const clearFilters = () => setFilters(createEmptyServiceFilters());

  return {
    filters,
    setFilters,
    items,
    clearFilters,
  };
}