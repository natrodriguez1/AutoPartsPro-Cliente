import type { PaymentMethod, SavedCard } from "../../types/checkout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { Checkbox } from "@/shared/ui/checkbox";
import { CreditCard } from "lucide-react";

type Props = {
  cards: SavedCard[];
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (m: PaymentMethod) => void;

  selectedCardId: string;
  onSelectedCardChange: (id: string) => void;

  numeroTarjeta: string;
  setNumeroTarjeta: (v: string) => void;
  fechaExpiracion: string;
  setFechaExpiracion: (v: string) => void;
  cvv: string;
  setCvv: (v: string) => void;
  nombreTitular: string;
  setNombreTitular: (v: string) => void;
  guardarTarjeta: boolean;
  setGuardarTarjeta: (v: boolean) => void;

  onBack: () => void;
  onNext: () => void;
};

function formatCardNumber(raw: string) {
  const clean = raw.replace(/\s/g, "");
  const groups = clean.match(/.{1,4}/g);
  return groups ? groups.join(" ") : clean;
}

export function StepPaymentMethod({
  cards,
  paymentMethod,
  onPaymentMethodChange,
  selectedCardId,
  onSelectedCardChange,
  numeroTarjeta,
  setNumeroTarjeta,
  fechaExpiracion,
  setFechaExpiracion,
  cvv,
  setCvv,
  nombreTitular,
  setNombreTitular,
  guardarTarjeta,
  setGuardarTarjeta,
  onBack,
  onNext,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Método de Pago
        </CardTitle>
        <CardDescription>Selecciona cómo quieres pagar</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={paymentMethod} onValueChange={(v:String) => onPaymentMethodChange(v as PaymentMethod)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tarjeta">Tarjeta</TabsTrigger>
            <TabsTrigger value="transferencia">Transferencia</TabsTrigger>
            <TabsTrigger value="efectivo">Efectivo</TabsTrigger>
          </TabsList>

          <TabsContent value="tarjeta" className="space-y-4 mt-6">
            <h4 className="font-medium">Tarjetas Guardadas</h4>

            <RadioGroup value={selectedCardId} onValueChange={onSelectedCardChange}>
              {cards.map((card) => (
                <div key={card.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value={card.id} id={card.id} />

                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold ${
                        card.tipo === "VISA"
                          ? "bg-gradient-to-r from-blue-600 to-blue-800"
                          : "bg-gradient-to-r from-red-600 to-orange-600"
                      }`}
                    >
                      {card.tipo === "VISA" ? "VISA" : "MC"}
                    </div>

                    <div>
                      <p className="font-medium">**** **** **** {card.ultimos4}</p>
                      <p className="text-sm text-muted-foreground">
                        Expira {card.expiracion} • {card.titular}
                      </p>
                    </div>
                  </div>

                  {card.principal && (
                    <Badge variant="secondary" className="text-xs">
                      Principal
                    </Badge>
                  )}
                </div>
              ))}
            </RadioGroup>

            <Separator />

            <h4 className="font-medium">Nueva Tarjeta</h4>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="numero">Número de tarjeta</Label>
                <Input
                  id="numero"
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(numeroTarjeta)}
                  onChange={(e) => setNumeroTarjeta(e.target.value.replace(/\s/g, ""))}
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiracion">MM/AA</Label>
                  <Input
                    id="expiracion"
                    placeholder="12/28"
                    value={fechaExpiracion}
                    onChange={(e) => setFechaExpiracion(e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                    type="password"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="titular">Nombre del titular</Label>
                <Input
                  id="titular"
                  placeholder="Como aparece en la tarjeta"
                  value={nombreTitular}
                  onChange={(e) => setNombreTitular(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="guardar"
                  checked={guardarTarjeta}
                  onCheckedChange={(v:String) => setGuardarTarjeta(Boolean(v))}
                />
                <Label htmlFor="guardar" className="text-sm">
                  Guardar esta tarjeta para futuras compras
                </Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transferencia" className="space-y-4 mt-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Transferencia Bancaria</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Realiza tu transferencia a la siguiente cuenta:
              </p>

              <div className="space-y-2 text-sm">
                <p><strong>Banco:</strong> Banco Pichincha</p>
                <p><strong>Cuenta:</strong> 2100123456</p>
                <p><strong>RUC:</strong> 1792146739001</p>
                <p><strong>Beneficiario:</strong> AutoParts Pro S.A.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="efectivo" className="space-y-4 mt-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Pago Contraentrega</h4>
              <p className="text-sm text-muted-foreground">
                Paga en efectivo cuando recibas tu pedido. Solo disponible para pedidos menores a $500.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
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
