import type { SavedAddress } from "../../types/checkout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { MapPin, Edit, Plus } from "lucide-react";

type Props = {
  addresses: SavedAddress[];
  selectedId: string;
  onSelect: (id: string) => void;

  onAddNew: () => void;
  onEdit: (address: SavedAddress) => void;

  onNext: () => void;
};

export function StepShippingAddress({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  onEdit,
  onNext,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Dirección de Envío
        </CardTitle>
        <CardDescription>Selecciona donde quieres recibir tu pedido</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <RadioGroup value={selectedId} onValueChange={onSelect}>
          {addresses.map((address) => (
            <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value={address.id} id={address.id} className="mt-1" />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor={address.id} className="font-medium">
                    {address.tipo}
                  </Label>
                  {address.principal && (
                    <Badge variant="secondary" className="text-xs">
                      Principal
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mt-1">{address.nombre}</p>
                <p className="text-sm text-muted-foreground">{address.direccion}</p>
                <p className="text-sm text-muted-foreground">
                  {address.ciudad}, {address.provincia} {address.codigoPostal}
                </p>
                <p className="text-sm text-muted-foreground">{address.telefono}</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onEdit(address);
                }}
                aria-label="Editar dirección"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>

        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={onAddNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Nueva Dirección
        </Button>

        <div className="flex justify-end">
          <Button onClick={onNext} type="button">
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
