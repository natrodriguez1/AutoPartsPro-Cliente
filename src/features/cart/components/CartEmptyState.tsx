import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ShoppingBag } from "lucide-react";

type Props = {
  onContinue: () => void;
};

export function CartEmptyState({ onContinue }: Props) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
        <p className="text-muted-foreground mb-4">
          Agrega algunos repuestos para continuar
        </p>
        <Button onClick={onContinue}>Continuar Comprando</Button>
      </CardContent>
    </Card>
  );
}
