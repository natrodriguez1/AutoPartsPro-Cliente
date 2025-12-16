import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { CreditCard } from "lucide-react";

type Props = {
  itemsCount: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  onCheckout: () => void;
};

export function OrderSummaryCard({
  itemsCount,
  subtotal,
  discountPercent,
  discountAmount,
  shippingCost,
  total,
  onCheckout,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Pedido</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal ({itemsCount} productos)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discountPercent > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Descuento ({discountPercent}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
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

        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <Button onClick={onCheckout} className="w-full mt-4">
          <CreditCard className="h-4 w-4 mr-2" />
          Proceder al Pago
        </Button>
      </CardContent>
    </Card>
  );
}
