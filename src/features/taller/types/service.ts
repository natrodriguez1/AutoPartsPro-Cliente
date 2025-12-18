import type { ServiceCore } from "@/domain/service";

export type ServiceStatus  = "activo" | "inactivo";

export type WorkshopService = ServiceCore & {
  code: string;
  estimatedDurationMinutes: number;
  isAvailable: boolean;
  requiresParts: boolean;
  specialty: string;
  warranty: string;
  lastUpdatedAt: string;
  completedServicesCount: number;
  averageRating: number;
  status: ServiceStatus;
};

export type ServiceHistoryStatus  = "completado" | "en_proceso" | "pendiente" | "cancelado";

export type ServiceHistory  = {
    id: string;
    date: string;                 
    service: string;              
    customer: string;             
    vehicle: string;              
    status: ServiceHistoryStatus; 
    price: number;                
    rating: number | null;        
};