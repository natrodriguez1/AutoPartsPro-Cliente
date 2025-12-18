import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { QuantitySelector } from "./QuantitySelector";

type Props = {
  quantity: number;
  onQuantityChange: (n: number) => void;

  isWishlisted: boolean;
  onToggleWishlist: () => void;

  onAddToCart: () => void;

  totalLabel: string; // ya formateado
  highlight?: boolean; // compatibilidad
};

export function ProductPurchaseCard({
  quantity,
  onQuantityChange,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  totalLabel,
  highlight = false,
}: Props) {
  return (
    <Card className="sticky top-4">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Cantidad:</span>
            <QuantitySelector value={quantity} onChange={onQuantityChange} />
          </div>

          <div className="space-y-2">
            <Button
              className={`w-full ${highlight ? "bg-green-600 hover:bg-green-700" : ""}`}
              onClick={onAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar al carrito - {totalLabel}
            </Button>

            <Button variant="outline" className="w-full" onClick={onToggleWishlist}>
              <Heart
                className={`h-4 w-4 mr-2 ${
                  isWishlisted ? "fill-current text-red-500" : ""
                }`}
              />
              {isWishlisted ? "En favoritos" : "Agregar a favoritos"}
            </Button>
          </div>

          <Separator />

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <Truck className="h-4 w-4" />
              <span>Envío gratis en pedidos +$100</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Shield className="h-4 w-4" />
              <span>Garantía de 12 meses</span>
            </div>
            <div className="flex items-center gap-2 text-orange-600">
              <RotateCcw className="h-4 w-4" />
              <span>Devolución gratuita 30 días</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
