import type { CartItem } from "../types/cart";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Plus, Minus, Trash2, Heart } from "lucide-react";
import { ImageWithFallback } from "@/shared/components/ImageWithFallback";

type Props = {
  item: CartItem;
  isWishlisted: boolean;
  onChangeQty: (id: string, nextQty: number) => void;
  onRemove: (id: string) => void;
  onToggleWishlist: (item: CartItem) => void;
};

export function CartItemCard({
  item,
  isWishlisted,
  onChangeQty,
  onRemove,
  onToggleWishlist,
}: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 flex-shrink-0">
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded"
            />
          </div>

          <div className="flex-1">
            <h4 className="font-medium line-clamp-2">{item.name}</h4>

            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold">${item.price}</span>

              {"originalPrice" in item && item.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${item.originalPrice}
                </span>
              )}

              {"isSale" in item && item.isSale && (
                <Badge variant="destructive" className="text-xs">
                  -{item.salePercentage}%
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChangeQty(item.id, item.cantidad - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>

              <span className="w-8 text-center">{item.cantidad}</span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onChangeQty(item.id, item.cantidad + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-right">
              <p className="font-medium">
                ${(item.price * item.cantidad).toFixed(2)}
              </p>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleWishlist(item)}
                className="text-red-500 hover:text-red-600"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className="h-4 w-4"
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="text-destructive hover:text-destructive"
                aria-label="Eliminar del carrito"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
