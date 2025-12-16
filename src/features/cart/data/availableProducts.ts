import type { SearchProduct } from "@/features/catalog/types/product";

// Productos adicionales para búsqueda (mock)
export const availableProducts: SearchProduct[] = [
  {
    id: "new1",
    name: "Filtro de Aire K&N Performance",
    price: 45,
    originalPrice: 65,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=500&fit=crop",
    category: "engine",
    isSale: true,
    salePercentage: 30,
  },
  {
    id: "new2",
    name: "Amortiguadores Monroe Gas-Matic",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop",
    category: "suspension",
  },
  {
    id: "new3",
    name: "Batería Bosch S4 12V 60Ah",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
    category: "electrical",
  },
  {
    id: "new4",
    name: "Kit de Embrague Valeo",
    price: 280,
    originalPrice: 350,
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=500&fit=crop",
    category: "transmission",
    isSale: true,
    salePercentage: 20,
  },
];
