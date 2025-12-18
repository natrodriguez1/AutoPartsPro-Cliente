import { Product } from "../types/product";

export const productsMock: Product[] = [
  {
    id: "brake_001",
    name: "Pastillas de Freno Cerámicas Premium Bosch",
    price: 89,
    originalPrice: 119,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
    category: "frenos",
    brand: "bosch",
    compatibility: ["honda", "toyota", "nissan"],
    isSale: true,
    salePercentage: 25,
    description: "Pastillas de freno cerámicas de alto rendimiento, menos ruido y mayor durabilidad",
    workshopId: "1",
    workshopName: "AutoMaster Quito"
  },
  {
    id: "engine_001",
    name: "Filtro de Aire K&N Performance",
    price: 45,
    originalPrice: 65,
    rating: 4.6,
    reviewCount: 298,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=500&fit=crop",
    category: "motor",
    brand: "k&n",
    compatibility: ["universal"],
    isSale: true,
    salePercentage: 30,
    description: "Filtro de aire de alto flujo, lavable y reutilizable",
    workshopId: "1",
    workshopName: "AutoMaster Quito"
  },
  {
    id: "tire_001",
    name: "Neumáticos Urbanos Bridgestone 205/55R16",
    price: 285,
    originalPrice: 320,
    rating: 4.6,
    reviewCount: 223,
    image: "https://images.unsplash.com/photo-1449667585940-75d7cfeae11b?w=400&h=500&fit=crop",
    category: "neumaticos",
    brand: "bridgestone",
    compatibility: ["universal"],
    isSale: true,
    salePercentage: 11,
    description: "Neumáticos para ciudad con excelente durabilidad y confort",
    workshopId: "2",
    workshopName: "TallerPro Guayaquil"
  },
  {
    id: "elec_001",
    name: "Batería Bosch S4 12V 60Ah",
    price: 120,
    rating: 4.6,
    reviewCount: 289,
    image: "https://images.unsplash.com/photo-1620064723069-5e2b2bd2102f?w=400&h=500&fit=crop",
    category: "electrico",
    brand: "bosch",
    compatibility: ["universal"],
    description: "Batería libre de mantenimiento con 3 años de garantía",
    workshopId: "1",
    workshopName: "AutoMaster Quito"
  },
  {
    id: "susp_001",
    name: "Amortiguadores Monroe Gas-Matic (Par)",
    price: 180,
    rating: 4.7,
    reviewCount: 167,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop",
    category: "suspension",
    brand: "monroe",
    compatibility: ["toyota", "honda", "nissan"],
    description: "Amortiguadores de gas para mejor control y confort de manejo",
    workshopId: "3",
    workshopName: "MecánicaTotal Cuenca"
  },
  {
    id: "engine_002",
    name: "Aceite de Motor Sintético Mobil 1",
    price: 35,
    rating: 4.9,
    reviewCount: 445,
    image: "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=400&h=500&fit=crop",
    category: "motor",
    brand: "mobil1",
    compatibility: ["universal"],
    description: "Aceite sintético premium 5W-30 para máxima protección del motor",
    workshopId: "1",
    workshopName: "AutoMaster Quito"
  },
  {
    id: "elec_002",
    name: "Kit de Conversión LED para Faros",
    price: 159,
    rating: 4.5,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=500&fit=crop",
    category: "electrico",
    brand: "philips",
    compatibility: ["universal"],
    isNew: true,
    description: "Luces LED de alta eficiencia para mejor visibilidad nocturna",
    workshopId: "2",
    workshopName: "TallerPro Guayaquil"
  },
  {
    id: "trans_001",
    name: "Kit de Embrague Valeo",
    price: 280,
    originalPrice: 350,
    rating: 4.7,
    reviewCount: 123,
    image: "https://images.unsplash.com/photo-1559992290-8b72b62aeca8?w=400&h=500&fit=crop",
    category: "transmision",
    brand: "valeo",
    compatibility: ["ford", "chevrolet", "fiat"],
    isSale: true,
    salePercentage: 20,
    description: "Kit completo de embrague para transmisión manual",
    workshopId: "1",
    workshopName: "AutoMaster Quito"
  }
];

export const productCategories = [
  { id: "frenos", label: "Frenos y Sistema de Frenado", count: 12 },
  { id: "motor", label: "Motor y Componentes", count: 18 },
  { id: "neumaticos", label: "Neumáticos y Llantas", count: 8 },
  { id: "suspension", label: "Suspensión y Dirección", count: 14 },
  { id: "electrico", label: "Sistema Eléctrico", count: 10 },
  { id: "transmision", label: "Transmisión y Embrague", count: 6 },
  { id: "accesorios", label: "Accesorios y Confort", count: 15 },
  { id: "herramientas", label: "Herramientas y Equipos", count: 9 }
];

// Productos relacionados
export const productosRelacionados = [
  {
    id: "related_001",
    name: "Pastillas de Freno Cerámicas Bosch",
    price: 89,
    originalPrice: 119,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    isSale: true,
    salePercentage: 25
  },
  {
    id: "related_002", 
    name: "Discos de Freno Ventilados Brembo",
    price: 156,
    rating: 4.7,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1563592181-b4fa94773834?w=300&h=300&fit=crop"
  },
  {
    id: "related_003",
    name: "Líquido de Frenos DOT 4",
    price: 25,
    rating: 4.5,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1574321017281-7798ba7e4ad1?w=300&h=300&fit=crop"
  },
  {
    id: "related_004",
    name: "Aceite de Motor Sintético",
    price: 35,
    rating: 4.9,
    reviewCount: 445,
    image: "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=300&h=300&fit=crop"
  }
];

