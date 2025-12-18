import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CartItem } from "../types/cart";
import type { PaymentMethod, ShippingMethod } from "../types/checkout";
import type { ProcessPaymentInput } from "../services/checkout.service";
import { calculateShipping, createOrder, processPayment } from "../services/checkout.service";
import { calcSubtotal } from "./useCartTotals";

type Args = {
  items: CartItem[];
  shippingMethod: ShippingMethod;
  discountPercentage?: number;
  discountCode?: string;
};

export function useCheckout({ items, shippingMethod, discountPercentage = 0, discountCode }: Args) {
  const [shippingCost, setShippingCost] = useState(0);
  const [processing, setProcessing] = useState(false);

  const subtotal = useMemo(() => calcSubtotal(items), [items]);

    const discount = useMemo(
        () => (subtotal * discountPercentage) / 100,
        [subtotal, discountPercentage]
    );

  const total = useMemo(() => subtotal - discount + shippingCost, [subtotal, discount, shippingCost]);

  const reqId = useRef(0);

  useEffect(() => {
    let alive = true;
    const id = ++reqId.current;

    (async () => {
      const cost = await calculateShipping({ subtotal, method: shippingMethod });
      if (!alive) return;
      if (id !== reqId.current) return;
      setShippingCost(cost);
    })();

    return () => {
      alive = false;
    };
  }, [subtotal, shippingMethod]);

  const submit = useCallback(
    async (input: {
      addressId: string;
      paymentMethod: PaymentMethod;
      selectedCardId?: string;
      newCard?: ProcessPaymentInput["newCard"];
    }) => {
      setProcessing(true);
      try {
        const order = await createOrder({
          items,
          addressId: input.addressId,
          shippingMethod,
          paymentMethod: input.paymentMethod,
          discountCode,
          discountPercentage,
        });

        const pay = await processPayment({
          orderId: order.orderId,
          paymentMethod: input.paymentMethod,
          selectedCardId: input.selectedCardId,
          newCard: input.newCard,
        });

        if (pay.status !== "succeeded") throw new Error("PAYMENT_FAILED");

        return { orderId: order.orderId, total: order.amount, currency: order.currency };
      } finally {
        setProcessing(false);
      }
    },
    [items, shippingMethod, discountCode, discountPercentage]
  );

  return { subtotal, discount, shippingCost, total, processing, submit };
}
