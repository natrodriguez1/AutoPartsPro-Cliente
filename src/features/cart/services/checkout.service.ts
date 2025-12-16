import api from "@/shared/lib/axios";
import type { CartItem } from "../types/cart";
import type { PaymentMethod, ShippingMethod } from "../types/checkout";

// 👇 Cambia esto a false cuando ya tengas el backend listo
const USE_MOCKS = true;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** ---------- TYPES (contratos del servicio) ---------- */
export type CalculateShippingInput = {
  subtotal: number;
  method: ShippingMethod;
  addressId?: string;
};

export type CreateOrderInput = {
  items: CartItem[];
  addressId: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  discountCode?: string;
  discountPercentage?: number;
};

export type CreateOrderResult = {
  orderId: string;
  amount: number;
  currency: "USD";
};

export type ProcessPaymentInput = {
  orderId: string;
  paymentMethod: PaymentMethod;
  selectedCardId?: string;

  // ⚠️ placeholder académico; en prod usar tokenización
  newCard?: {
    number: string;
    exp: string;
    cvv: string;
    holderName: string;
    save: boolean;
  };

  paymentToken?: string;
};

export type ProcessPaymentResult = {
  status: "succeeded" | "failed";
};

/** ---------- HELPERS ---------- */
function mapItems(items: CartItem[]) {
  return items.map((it) => ({
    productId: it.id,
    qty: it.cantidad,
    unitPrice: it.price,
  }));
}

/** ---------- API FUNCTIONS ---------- */

/**
 * Calcula costo de envío.
 * - MODO mock: regla simple (gratis > 100, express 25, pickup 0)
 * - MODO api: POST /shipping/quote
 */
export async function calculateShipping(input: CalculateShippingInput): Promise<number> {
  if (USE_MOCKS) {
    await sleep(150);

    if (input.method === "express") return 25;
    if (input.method === "pickup") return 0;
    return input.subtotal > 100 ? 0 : 15;
  }

  const { data } = await api.post<{ cost: number; currency: "USD" }>("/shipping/quote", {
    subtotal: input.subtotal,
    method: input.method,
    addressId: input.addressId ?? null,
  });

  return data.cost;
}

/**
 * Crea una orden.
 * - MODO mock: genera orderId y total con reglas mock
 * - MODO api: POST /orders
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (USE_MOCKS) {
    await sleep(300);

    const subtotal = input.items.reduce((acc, it) => acc + it.price * it.cantidad, 0);
    const discount = (subtotal * (input.discountPercentage ?? 0)) / 100;

    const shipping = await calculateShipping({
      subtotal,
      method: input.shippingMethod,
      addressId: input.addressId,
    });

    return {
      orderId: `ord_${Math.random().toString(16).slice(2)}`,
      amount: subtotal - discount + shipping,
      currency: "USD",
    };
  }

  const { data } = await api.post<{
    orderId: string;
    currency: "USD";
    totals: { subtotal: number; shipping: number; total: number };
  }>("/orders", {
    addressId: input.addressId,
    shippingMethod: input.shippingMethod,
    paymentMethod: input.paymentMethod,
    items: mapItems(input.items),
    discountCode: input.discountCode ?? null,
  });

  return {
    orderId: data.orderId,
    amount: data.totals.total,
    currency: data.currency,
  };
}

/**
 * Procesa pago.
 * - MODO mock: siempre succeeded (puedes simular fallos si quieres)
 * - MODO api: POST /orders/:id/pay
 */
export async function processPayment(input: ProcessPaymentInput): Promise<ProcessPaymentResult> {
  if (USE_MOCKS) {
    await sleep(900);
    return { status: "succeeded" };
  }

  const { data } = await api.post<ProcessPaymentResult>(`/orders/${input.orderId}/pay`, {
    paymentMethod: input.paymentMethod,
    selectedCardId: input.selectedCardId ?? null,
    paymentToken: input.paymentToken ?? null,
    newCard: input.newCard ?? null,
  });

  return data;
}
