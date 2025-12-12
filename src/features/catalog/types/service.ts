import type { ServiceCore } from "@/domain/service";

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

export type serviceFilter = {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
    brand: string[];
    compatibility: string[];
}