export type Product = {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    image: string;
    category: string;
    brand: string;
    compatibility: string[];
    isNew?: boolean;
    isSale?: boolean;
    salePercentage?: number;
    description?: string;
    tallerId?: string;
    tallerNombre?: string;
}

export type productFilter = {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
    brand: string[];
    compatibility: string[];
}