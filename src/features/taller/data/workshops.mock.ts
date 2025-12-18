import type { Workshop } from "../types/workshop";

export const talleresDestacadosMock: Workshop[] = [
  {
    id: "1",
    nombre: "AutoMaster Quito",
    especialidad: "Motor y Transmisión",
    ciudad: "Quito",
    rating: 4.8,
    distancia: "2.3 km",
    telefono: "+593-2-245-6789",
    whatsapp: "+593-99-123-4567",
    reseñas: [
      "Excelente diagnóstico computarizado",
      "Muy profesionales y puntuales",
    ],
    badges: ["closest"], // Más cercano
  },
  {
    id: "2",
    nombre: "TallerPro Guayaquil",
    especialidad: "Sistema de Frenos y Eléctrico",
    ciudad: "Guayaquil",
    rating: 4.6,
    distancia: "3.1 km",
    telefono: "+593-4-289-3456",
    whatsapp: "+593-98-765-4321",
    reseñas: [
      "Especialistas en frenos europeos",
      "Trabajo de calidad garantizado",
    ],
    badges: ["growth"], // Mayor crecimiento
  },
  {
    id: "3",
    nombre: "MecánicaTotal Cuenca",
    especialidad: "Suspensión y Dirección",
    ciudad: "Cuenca",
    rating: 4.7,
    distancia: "4.5 km",
    telefono: "+593-7-405-7890",
    whatsapp: "+593-96-789-0123",
    reseñas: [
      "Los mejores en alineación 3D",
      "Personal altamente capacitado",
    ],
    badges: [],
  },
  {
    id: "4",
    nombre: "ExpressAuto Ambato",
    especialidad: "Servicio Rápido y Mantenimiento",
    ciudad: "Ambato",
    rating: 4.5,
    distancia: "5.2 km",
    telefono: "+593-3-242-1890",
    whatsapp: "+593-97-456-7890",
    reseñas: [
      "Servicio express muy eficiente",
      "Buenos precios y calidad",
    ],
    badges: [],
  },
  {
    id: "5",
    nombre: "AutoTech Manta",
    especialidad: "Tecnología Avanzada",
    ciudad: "Manta",
    rating: 4.9,
    distancia: "6.8 km",
    telefono: "+593-5-262-3456",
    whatsapp: "+593-95-234-5678",
    reseñas: [
      "Equipos de última generación",
      "Excelente servicio al cliente",
    ],
    badges: [],
  },
  {
    id: "6",
    nombre: "ClimaCar Loja",
    especialidad: "Aire Acondicionado y Climatización",
    ciudad: "Loja",
    rating: 4.4,
    distancia: "7.5 km",
    telefono: "+593-7-257-4567",
    whatsapp: "+593-94-567-8901",
    reseñas: [
      "Especialistas en A/C",
      "Soluciones efectivas",
    ],
    badges: [],
  },
] as const;
