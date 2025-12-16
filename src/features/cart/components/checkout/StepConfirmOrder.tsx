import type { PaymentMethod, SavedAddress, SavedCard, ShippingMethod } from "../../types/checkout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Shield, Lock } from "lucide-react";

type Props = {
  address?: SavedAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  selectedCard?: SavedCard;
  total: number;
  processing: boolean;
  onBack: () => void;
  onPay: () => void;
};

export function StepConfirmOrder({
  address,
  shippingMethod,
  paymentMethod,
  selectedCard,
  total,
  processing,
  onBack,
  onPay,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Confirmar Pedido
        </CardTitle>
        <CardDescription>Revisa todos los detalles antes de finalizar</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Dirección de Envío</h4>
          <div className="p-3 bg-muted/50 rounded">
            <p className="font-medium">{address?.tipo}</p>
            <p className="text-sm">{address?.nombre}</p>
            <p className="text-sm">{address?.direccion}</p>
            <p className="text-sm">
              {address?.ciudad}, {address?.provincia}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Método de Envío</h4>
          <p className="text-sm text-muted-foreground">
            {shippingMethod === "standard" && "Envío Estándar (3-5 días)"}
            {shippingMethod === "express" && "Envío Express (1-2 días)"}
            {shippingMethod === "pickup" && "Recoger en Tienda"}
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Método de Pago</h4>
          {paymentMethod === "tarjeta" && (
            <p className="text-sm text-muted-foreground">
              Tarjeta terminada en {selectedCard?.ultimos4}
            </p>
          )}
          {paymentMethod === "transferencia" && (
            <p className="text-sm text-muted-foreground">Transferencia Bancaria</p>
          )}
          {paymentMethod === "efectivo" && (
            <p className="text-sm text-muted-foreground">Pago Contraentrega</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} type="button">
            Atrás
          </Button>

          <Button onClick={onPay} disabled={processing} className="min-w-[120px]" type="button">
            {processing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Pagar ${total.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
