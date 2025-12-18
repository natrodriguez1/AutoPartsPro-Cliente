import type { ServiceCore } from "@/domain/service";
import type { BaseFilters } from "./filters";

export type Service = ServiceCore & {
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  duration?: string;
  city?: string;
  direction?: string;
  phoneNumber?: string;
  whatsapp?: string;
  specialty?: string;
  isPromoted?: boolean;
  isUrgent?: boolean;
};

export type ServiceFilter = BaseFilters;