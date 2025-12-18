import type { CartItem } from "../../types/cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { ImageWithFallback } from "@/shared/components/ImageWithFallback";

type Props = {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
};

export function CheckoutOrderSummary({ items, subtotal, shippingCost, total }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Pedido</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Cantidad: {item.cantidad} × ${item.price}
                </p>
                <p className="text-sm font-medium">
                  ${(item.price * item.cantidad).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Envío</span>
            <span>
              {shippingCost === 0 ? (
                <span className="text-green-600">GRATIS</span>
              ) : (
                `$${shippingCost.toFixed(2)}`
              )}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
