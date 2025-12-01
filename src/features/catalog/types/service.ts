export type Service = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  duration?: string;
  description?: string;
  tallerId?: string;
  tallerNombre?: string;
  ciudad?: string;
  direccion?: string;
  telefono?: string;
  whatsapp?: string;
  especialidad?: string;
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