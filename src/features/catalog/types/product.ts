export type ProductCore = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isSale?: boolean;
  salePercentage?: number;
};

export type Product = ProductCore &{
    rating: number;
    reviewCount: number;
    brand: string;
    compatibility: string[];
    isNew?: boolean;
    description?: string;
    tallerId?: string;
    tallerNombre?: string;
}

export type SearchProduct = ProductCore;

export type ProductFilter = {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
    brand: string[];
    compatibility: string[];
}