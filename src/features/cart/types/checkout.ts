export type SavedAddress = {
  id: string;
  tipo: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  telefono: string;
  principal: boolean;
};

export type SavedCard = {
  id: string;
  tipo: "VISA" | "MASTERCARD";
  ultimos4: string;
  expiracion: string;
  titular: string;
  principal: boolean;
};

export type ShippingMethod = "standard" | "express" | "pickup";
export type PaymentMethod = "tarjeta" | "transferencia" | "efectivo";
