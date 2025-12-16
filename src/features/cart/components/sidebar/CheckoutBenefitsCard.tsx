import { Card, CardContent } from "@/shared/ui/card";
import { CreditCard, Shield, Truck } from "lucide-react";

export function CheckoutBenefitsCard() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Truck className="h-4 w-4 text-green-600" />
          <span>Envío gratis en compras +$100</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-blue-600" />
          <span>Garantía en todos los productos</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="h-4 w-4 text-purple-600" />
          <span>Pago seguro y protegido</span>
        </div>
      </CardContent>
    </Card>
  );
}
