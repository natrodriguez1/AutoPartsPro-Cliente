import { useState } from "react";
import { Heart, ShoppingCart, Star, MessageCircle, Award, CheckCircle, Eye, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    image: string;
    isNew?: boolean;
    isSale?: boolean;
    salePercentage?: number;
    description?: string;
    tallerId?: string;
    tallerNombre?: string;
    compatibility?: string[];
    brand?: string;
  };
  onAddToCart: (productId: string) => void;
  onWishlistToggle: (productId: string) => void;
  onVerProducto: (productId: string) => void;
  isInWishlist?: boolean;
  viewMode?: "grid" | "list";
  userCars?: Array<{
    id: string;
    marca: string;
    modelo: string;
    año: number;
    motor?: string;
  }>;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onWishlistToggle, 
  onVerProducto,
  isInWishlist = false,
  viewMode = "grid",
  userCars = []
}: ProductCardProps) {

  const handleAddToCart = () => {
    onAddToCart(product.id);
  };

  const handleWishlistToggle = () => {
    onWishlistToggle(product.id);
  };

  const handleVerProducto = () => {
    onVerProducto(product.id);
  };

  // Verificar compatibilidad mejorada
  const checkCompatibility = () => {
    if (!product.compatibility) return { 
      isUniversal: false, 
      isSpecificCompatible: false, 
      matchedCars: [] 
    };
    
    // Verificar si es universal
    const isUniversal = product.compatibility.some(compat => 
      compat.toLowerCase() === "universal"
    );
    
    if (!userCars.length) {
      return { 
        isUniversal, 
        isSpecificCompatible: false, 
        matchedCars: [] 
      };
    }
    
    const matchedCars = [];
    
    for (const car of userCars) {
      const carBrand = car.marca.toLowerCase();
      const carModel = car.modelo.toLowerCase();
      
      const isSpecificCompatible = product.compatibility.some(compat => {
        const compatLower = compat.toLowerCase();
        return compatLower !== "universal" && (
          compatLower === carBrand || 
          compatLower.includes(carBrand) ||
          compatLower === carModel ||
          compatLower.includes(carModel)
        );
      });
      
      if (isSpecificCompatible) {
        matchedCars.push(car);
      }
    }
    
    return { 
      isUniversal, 
      isSpecificCompatible: matchedCars.length > 0, 
      matchedCars 
    };
  };

  const compatibility = checkCompatibility();

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-muted-foreground"
          }`}
        />
      );
    }
    return stars;
  };

  if (viewMode === "list") {
    return (
      <Card className={`hover:shadow-md transition-shadow ${
        compatibility.isSpecificCompatible ? "ring-2 ring-green-200 bg-green-50/30" : ""
      }`}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div 
              className="w-24 h-24 flex-shrink-0 relative cursor-pointer" 
              onClick={handleVerProducto}
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded"
              />
              {compatibility.isSpecificCompatible && (
                <div className="absolute -top-1 -right-1">
                  <CheckCircle className="h-5 w-5 bg-green-500 text-white rounded-full" />
                </div>
              )}
              {compatibility.isUniversal && !compatibility.isSpecificCompatible && (
                <div className="absolute -top-1 -right-1">
                  <Globe className="h-5 w-5 bg-blue-500 text-white rounded-full p-1" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 
                      className="font-medium line-clamp-2 cursor-pointer hover:text-primary transition-colors" 
                      onClick={handleVerProducto}
                    >
                      {product.name}
                    </h3>
                    {compatibility.isSpecificCompatible && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Compatible
                      </Badge>
                    )}
                    {compatibility.isUniversal && !compatibility.isSpecificCompatible && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        Universal
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(product.rating)}
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <div className="flex gap-1">
                    {product.isNew && (
                      <Badge variant="secondary" className="text-xs">Nuevo</Badge>
                    )}
                    {product.isSale && (
                      <Badge variant="destructive" className="text-xs">
                        -{product.salePercentage}%
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddToCart}>
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Agregar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleWishlistToggle}
                      className={isInWishlist ? "text-red-500" : ""}
                    >
                      <Heart className={`h-3 w-3 ${isInWishlist ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view con lógica de compatibilidad mejorada
  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 border-0 shadow-sm ${
      compatibility.isSpecificCompatible ? "ring-2 ring-green-200 bg-green-50/30" : ""
    }`}>
      <CardContent className="p-4">
        <div className="relative">
          <div 
            className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted cursor-pointer"
            onClick={handleVerProducto}
          >
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button variant="secondary" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalle
              </Button>
            </div>
          </div>
          
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge variant="secondary" className="text-xs font-medium">
                Nuevo
              </Badge>
            )}
            {product.isSale && (
              <Badge variant="destructive" className="text-xs font-medium">
                -{product.salePercentage}%
              </Badge>
            )}
            {compatibility.isSpecificCompatible && (
              <Badge className="bg-green-500 text-white text-xs font-medium">
                <CheckCircle className="h-3 w-3 mr-1" />
                Compatible
              </Badge>
            )}
            {compatibility.isUniversal && !compatibility.isSpecificCompatible && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium">
                <Globe className="h-3 w-3 mr-1" />
                Universal
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background ${
              isInWishlist ? "text-red-500" : "text-muted-foreground"
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="space-y-2">
          <h3 
            className="font-medium leading-tight line-clamp-2 h-10 cursor-pointer hover:text-primary transition-colors"
            onClick={handleVerProducto}
          >
            {product.name}
          </h3>

          {/* Mostrar compatibilidad específica solo si es compatible */}
          {compatibility.isSpecificCompatible && (
            <div className="bg-green-100 rounded-md p-2">
              <p className="text-xs text-green-700 font-medium">
                ✓ Compatible con tus vehículos
              </p>
            </div>
          )}

          {/* Mostrar nota universal */}
          {compatibility.isUniversal && !compatibility.isSpecificCompatible && (
            <div className="bg-blue-50 rounded-md p-2">
              <p className="text-xs text-blue-700 font-medium">
                🌐 Compatible con todos los vehículos
              </p>
            </div>
          )}

          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
            <span className="text-sm text-muted-foreground ml-1">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {product.tallerNombre && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Award className="h-3 w-3" />
              <span>Por {product.tallerNombre}</span>
            </div>
          )}

          <Button 
            onClick={handleAddToCart} 
            className={`w-full ${compatibility.isSpecificCompatible ? "bg-green-600 hover:bg-green-700" : ""}`}
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {compatibility.isSpecificCompatible ? "Agregar Compatible" : "Agregar al Carrito"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}