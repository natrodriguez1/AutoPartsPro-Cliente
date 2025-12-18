export type ExchangeStatus = "pendiente" | "en_proceso" | "completado" | "rechazado";

export type ExchangeDirection = "envia" | "recibe";

export type WorkshopExchangePartner = {
  id: string;
  name: string;
  distance: string;
  rating: number;
  specialty: string;
  phoneNumber: string;
  email: string;
  inventorySummary: string[];
};

export type WorkshopExchange = {
  id: string;
  workshopName: string;
  requestedPart: string;
  offeredPart: string;
  status: ExchangeStatus;
  createdAt: string;       // puede ser fecha o string tipo "Hace 2 horas"
  direction: ExchangeDirection;
  progress: number;        // porcentaje 0–100
  nextStep: string;
};