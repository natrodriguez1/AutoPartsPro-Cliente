import type { SavedAddress } from "../types/checkout";

export const savedAddresses: SavedAddress[] = [
  {
    id: "1",
    tipo: "Casa",
    nombre: "Juan Pérez",
    direccion: "Av. Amazonas N24-03 y Colón",
    ciudad: "Quito",
    provincia: "Pichincha",
    codigoPostal: "170143",
    telefono: "+593 99 123 4567",
    principal: true,
  },
  {
    id: "2",
    tipo: "Oficina",
    nombre: "Juan Pérez",
    direccion: "Av. Francisco de Orellana, Centro Comercial Mall del Sol",
    ciudad: "Guayaquil",
    provincia: "Guayas",
    codigoPostal: "090313",
    telefono: "+593 99 876 5432",
    principal: false,
  },
];
