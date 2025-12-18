import { Card, CardContent } from "@/shared/ui/card";
import { Shield, Lock, Truck } from "lucide-react";

export function CheckoutTrustInfo() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-green-600" />
          <span>Pago 100% seguro</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Lock className="h-4 w-4 text-blue-600" />
          <span>Datos protegidos con SSL</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Truck className="h-4 w-4 text-purple-600" />
          <span>Envío con seguro incluido</span>
        </div>
      </CardContent>
    </Card>
  );
}
