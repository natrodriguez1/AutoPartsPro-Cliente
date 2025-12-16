import type { ShippingMethod } from "../../types/checkout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Truck } from "lucide-react";

type Props = {
  subtotal: number;
  method: ShippingMethod;
  onChange: (m: ShippingMethod) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepShippingMethod({ subtotal, method, onChange, onBack, onNext }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Método de Envío
        </CardTitle>
        <CardDescription>Elige cómo quieres recibir tu pedido</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <RadioGroup value={method} onValueChange={(v : String) => onChange(v as ShippingMethod)}>
          <div className="flex items-start space-x-3 p-4 border rounded-lg">
            <RadioGroupItem value="standard" id="standard" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="standard" className="font-medium">
                Envío Estándar
              </Label>
              <p className="text-sm text-muted-foreground mt-1">Entrega en 3-5 días hábiles</p>
              <p className="text-sm text-muted-foreground">{subtotal > 100 ? "GRATIS" : "$15.00"}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 border rounded-lg">
            <RadioGroupItem value="express" id="express" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="express" className="font-medium">
                Envío Express
              </Label>
              <p className="text-sm text-muted-foreground mt-1">Entrega en 1-2 días hábiles</p>
              <p className="text-sm text-muted-foreground">$25.00</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 border rounded-lg">
            <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="pickup" className="font-medium">
                Recoger en Tienda
              </Label>
              <p className="text-sm text-muted-foreground mt-1">Disponible en 1-2 días hábiles</p>
              <p className="text-sm text-muted-foreground">GRATIS</p>
            </div>
          </div>
        </RadioGroup>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} type="button">
            Atrás
          </Button>
          <Button onClick={onNext} type="button">
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
