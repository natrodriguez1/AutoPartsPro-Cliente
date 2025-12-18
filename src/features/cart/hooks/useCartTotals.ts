import { useMemo } from "react";
import type { CartItem } from "../types/cart";

export const calcSubtotal = (items: CartItem[]) =>
  items.reduce((acc, it) => acc + it.price * it.cantidad, 0);

export function useCartTotals(items: CartItem[], descuentoAplicado: number) {
  return useMemo(() => {
    const subtotal = calcSubtotal(items);

    const descuento = (subtotal * descuentoAplicado) / 100;
    const envio = subtotal > 100 ? 0 : 15;
    const total = subtotal - descuento + envio;

    return { subtotal, descuento, envio, total };
  }, [items, descuentoAplicado]);
}
