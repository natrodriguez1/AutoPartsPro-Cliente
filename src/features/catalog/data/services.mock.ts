import { Service } from "../types/service";

export const servicesMock: Service[] = [
  {
    id: "service_001",
    name: "Cambio de Aceite y Filtros Premium",
    price: 45,
    originalPrice: 60,
    rating: 4.9,
    reviewCount: 328,
    image: "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=400&h=500&fit=crop",
    category: "mantenimiento",
    duration: "30 min",
    description: "Cambio de aceite sintético premium con filtro de aceite y revisión general de 21 puntos",
    workshopId: "1",
    workshopName: "AutoMaster Quito",
    city: "Quito",
    phoneNumber: "+593-2-245-6789",
    whatsapp: "+593-99-123-4567",
    specialty: "Mantenimiento Preventivo",
    isPromoted: true
  },
  {
    id: "service_002",
    name: "Diagnóstico Computarizado Completo",
    price: 25,
    rating: 4.8,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=500&fit=crop",
    category: "diagnostico",
    duration: "45 min",
    description: "Diagnóstico completo con scanner profesional, revisión de códigos de error y reporte detallado",
    workshopId: "1",
    workshopName: "AutoMaster Quito",
    city: "Quito",
    phoneNumber: "+593-2-245-6789",
    whatsapp: "+593-99-123-4567",
    specialty: "Diagnóstico Electrónico"
  },
  {
    id: "service_003",
    name: "Revisión de Frenos Integral",
    price: 35,
    rating: 4.7,
    reviewCount: 289,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
    category: "frenos",
    duration: "60 min",
    description: "Revisión completa de pastillas, discos, líquido de frenos y calibración del sistema",
    workshopId: "2",
    workshopName: "TallerPro Guayaquil",
    city: "Guayaquil",
    phoneNumber: "+593-4-289-3456",
    whatsapp: "+593-98-765-4321",
    specialty: "Sistema de Frenos"
  },
  {
    id: "service_004",
    name: "Alineación 3D Computarizada",
    price: 25,
    rating: 4.9,
    reviewCount: 198,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop",
    category: "suspension",
    duration: "45 min",
    description: "Alineación de precisión con tecnología 3D, balanceado de llantas incluido",
    workshopId: "3",
    workshopName: "MecánicaTotal Cuenca",
    city: "Cuenca",
    phoneNumber: "+593-7-405-7890",
    whatsapp: "+593-96-789-0123",
    specialty: "Suspensión y Dirección",
    isUrgent: true
  },
  {
    id: "service_005",
    name: "Mantenimiento de Transmisión",
    price: 80,
    originalPrice: 100,
    rating: 4.6,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1559992290-8b72b62aeca8?w=400&h=500&fit=crop",
    category: "transmision",
    duration: "90 min",
    description: "Cambio de aceite de transmisión, revisión de embrague y ajustes necesarios",
    workshopId: "4",
    workshopName: "ExpressAuto Ambato",
    city: "Ambato",
    phoneNumber: "+593-3-242-1890",
    whatsapp: "+593-97-456-7890",
    specialty: "Transmisión Manual y Automática"
  },
  {
    id: "service_006",
    name: "Revisión Pre-ITV Completa",
    price: 40,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1632823469652-6ac2ce2e7351?w=400&h=500&fit=crop",
    category: "revision",
    duration: "75 min",
    description: "Revisión integral preparatoria para la Inspección Técnica Vehicular",
    workshopId: "5",
    workshopName: "AutoTech Manta",
    city: "Manta",
    phoneNumber: "+593-5-262-3456",
    whatsapp: "+593-95-234-5678",
    specialty: "Inspección Vehicular",
    isPromoted: true
  },
  {
    id: "service_007",
    name: "Servicio de A/C y Climatización",
    price: 55,
    rating: 4.7,
    reviewCount: 145,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=500&fit=crop",
    category: "climatizacion",
    duration: "60 min",
    description: "Revisión, recarga y mantenimiento completo del sistema de aire acondicionado",
    workshopId: "6",
    workshopName: "ClimaCar Loja",
    city: "Loja",
    phoneNumber: "+593-7-257-4567",
    whatsapp: "+593-94-567-8901",
    specialty: "Aire Acondicionado"
  }
] as const;

export const serviceCategories = [
  { id: "mantenimiento", label: "Mantenimiento Preventivo", count: 12 },
  { id: "diagnostico", label: "Diagnóstico y Revisión", count: 8 },
  { id: "frenos", label: "Servicios de Frenos", count: 6 },
  { id: "suspension", label: "Suspensión y Alineación", count: 7 },
  { id: "transmision", label: "Transmisión y Embrague", count: 4 },
  { id: "electrico", label: "Sistema Eléctrico", count: 5 },
  { id: "revision", label: "Inspección Técnica", count: 3 },
  { id: "climatizacion", label: "Aire Acondicionado", count: 4 },
  { id: "emergencia", label: "Servicios de Emergencia", count: 2 }
];

export // Servicios relacionados
const serviciosRelacionados = [
  {
    id: "related_service_1",
    name: "Cambio de Aceite Premium",
    price: 45,
    duration: "30 min",
    rating: 4.8,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=300&h=300&fit=crop",
    tallerNombre: "AutoMaster Quito"
  },
  {
    id: "related_service_2", 
    name: "Alineación 3D Computarizada",
    price: 25,
    duration: "45 min",
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=300&fit=crop",
    tallerNombre: "MecánicaTotal Cuenca"
  },
  {
    id: "related_service_3",
    name: "Revisión de Frenos Completa",
    price: 35,
    duration: "60 min",
    rating: 4.7,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    tallerNombre: "TallerPro Guayaquil"
  }
];