import type { SavedCard } from "../types/checkout";

export const savedCards: SavedCard[] = [
  { id: "1", tipo: "VISA", ultimos4: "4242", expiracion: "12/28", titular: "JUAN PEREZ", principal: true },
  { id: "2", tipo: "MASTERCARD", ultimos4: "8888", expiracion: "06/27", titular: "JUAN PEREZ", principal: false },
];
