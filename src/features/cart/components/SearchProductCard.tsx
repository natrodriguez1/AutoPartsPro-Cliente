import type { SearchProduct } from "@/features/catalog/types/product";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Heart } from "lucide-react";
import { ImageWithFallback } from "@/shared/components/ImageWithFallback";

type Props = {
  product: SearchProduct;
  isWishlisted: boolean;
  onAdd: (product: SearchProduct) => void;
  onToggleWishlist: (product: SearchProduct) => void;
};

export function SearchProductCard({
  product,
  isWishlisted,
  onAdd,
  onToggleWishlist,
}: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 flex-shrink-0">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded"
            />
          </div>

          <div className="flex-1">
            <h4 className="font-medium line-clamp-2">{product.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold">${product.price}</span>

              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}

              {product.isSale && (
                <Badge variant="destructive" className="text-xs">
                  -{product.salePercentage}%
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button size="sm" onClick={() => onAdd(product)}>
              Agregar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleWishlist(product)}
              className="text-red-500 hover:text-red-600"
              aria-label="Toggle wishlist"
            >
              <Heart
                className="h-4 w-4"
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
