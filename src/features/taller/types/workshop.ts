import type { WorkshopCore } from "@/domain/workshop";

// Tipo para los “tags” o insignias que puede tener un taller destacado
export type WorkshopBadge = "closest" | "growth";

// Modelo de datos que el backend debería devolver para un taller destacado
export type Workshop = WorkshopCore & {
  reseñas: string[];   
  badges: WorkshopBadge[];
}