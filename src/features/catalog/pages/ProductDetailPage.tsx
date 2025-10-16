import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  RotateCcw,
  CheckCircle,
  Award,
  MessageCircle,
  Phone
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

interface ProductDetailProps {
  product: any;
  onRegresar: () => void;
  onAgregarCarrito: (producto: any, cantidad: number) => void;
  onToggleWishlist: (producto: any) => void;
  onVerProducto: (producto: any) => void;
  isInWishlist?: boolean;
  userCars?: Array<{
    id: string;
    marca: string;
    modelo: string;
    año: number;
  }>;
}

// Productos relacionados
const productosRelacionados = [
  {
    id: "related_001",
    name: "Pastillas de Freno Cerámicas Bosch",
    price: 89,
    originalPrice: 119,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    isSale: true,
    salePercentage: 25
  },
  {
    id: "related_002", 
    name: "Discos de Freno Ventilados Brembo",
    price: 156,
    rating: 4.7,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1563592181-b4fa94773834?w=300&h=300&fit=crop"
  },
  {
    id: "related_003",
    name: "Líquido de Frenos DOT 4",
    price: 25,
    rating: 4.5,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1574321017281-7798ba7e4ad1?w=300&h=300&fit=crop"
  },
  {
    id: "related_004",
    name: "Aceite de Motor Sintético",
    price: 35,
    rating: 4.9,
    reviewCount: 445,
    image: "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=300&h=300&fit=crop"
  }
];

// Reviews detalladas
const reviewsDetalladas = [
  {
    id: "1",
    usuario: "Carlos M.",
    rating: 5,
    fecha: "15 Nov 2024",
    titulo: "Excelente calidad",
    comentario: "Superó mis expectativas. La calidad es excepcional y la instalación fue muy sencilla. Lo recomiendo al 100%.",
    verificado: true,
    util: 24,
    imagenes: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop"]
  },
  {
    id: "2",
    usuario: "María R.",
    rating: 4,
    fecha: "8 Nov 2024", 
    titulo: "Buen producto",
    comentario: "Funciona muy bien, aunque tardé un poco en instalarlo. La relación calidad-precio es buena.",
    verificado: true,
    util: 18,
    imagenes: []
  },
  {
    id: "3",
    usuario: "Pedro L.",
    rating: 5,
    fecha: "2 Nov 2024",
    titulo: "Perfecto para mi Honda Civic",
    comentario: "Encajó perfectamente en mi Civic 2020. Muy satisfecho con la compra. El envío fue rápido.",
    verificado: false,
    util: 12,
    imagenes: []
  },
  {
    id: "4",
    usuario: "Ana S.",
    rating: 3,
    fecha: "28 Oct 2024",
    titulo: "Regular",
    comentario: "Cumple su función pero esperaba un poco más por el precio. La calidad es aceptable.",
    verificado: true,
    util: 8,
    imagenes: []
  }
];

export function ProductDetail({ 
  product, 
  onRegresar, 
  onAgregarCarrito, 
  onToggleWishlist, 
  onVerProducto,
  isInWishlist = false,
  userCars = []
}: ProductDetailProps) {
  const [cantidad, setCantidad] = useState(1);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [tabActiva, setTabActiva] = useState("descripcion");

  // Múltiples imágenes del producto
  const imagenesProducto = [
    product?.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1563592181-b4fa94773834?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1574321017281-7798ba7e4ad1?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=600&h=600&fit=crop"
  ];

  // Verificar compatibilidad con los carros del usuario
  const checkCompatibility = () => {
    if (!userCars.length || !product?.compatibility) return { isCompatible: false, matchedCars: [] };
    
    const matchedCars = [];
    
    for (const car of userCars) {
      const carBrand = car.marca.toLowerCase();
      const carModel = car.modelo.toLowerCase();
      
      const isCompatible = product.compatibility.some((compat: string) => {
        const compatLower = compat.toLowerCase();
        return compatLower === "universal" || 
               compatLower === carBrand || 
               compatLower.includes(carBrand) ||
               compatLower === carModel ||
               compatLower.includes(carModel);
      });
      
      if (isCompatible) {
        matchedCars.push(car);
      }
    }
    
    return { 
      isCompatible: matchedCars.length > 0, 
      matchedCars 
    };
  };

  const compatibility = checkCompatibility();

  const handleAgregarCarrito = () => {
    onAgregarCarrito(product, cantidad);
    toast.success(`${cantidad} ${product.name} agregado${cantidad > 1 ? 's' : ''} al carrito`);
  };

  const handleContactarTaller = () => {
    if (product?.tallerNombre) {
      toast.success(`Contactando con ${product.tallerNombre}...`);
    }
  };

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const stars = [];
    const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${sizeClass} ${
            i <= rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-muted-foreground"
          }`}
        />
      );
    }
    return stars;
  };

  const calcularDistribucionRatings = () => {
    const distribucion = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsDetalladas.forEach(review => {
      distribucion[review.rating as keyof typeof distribucion]++;
    });
    
    const total = reviewsDetalladas.length;
    return Object.entries(distribucion).map(([stars, count]) => ({
      stars: parseInt(stars),
      count,
      percentage: (count / total) * 100
    })).reverse();
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button variant="outline" onClick={onRegresar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <p className="mt-4">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Button variant="ghost" size="sm" onClick={onRegresar} className="p-0 h-auto">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al catálogo
        </Button>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="capitalize">{product.brand}</span>
      </div>

      {/* Alerta de compatibilidad */}
      {compatibility.isCompatible && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Compatible con tus vehículos</p>
              <p className="text-sm text-green-700">
                {compatibility.matchedCars.map(car => `${car.marca} ${car.modelo} ${car.año}`).join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Imágenes del producto */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <ImageWithFallback
              src={imagenesProducto[imagenSeleccionada]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {imagenesProducto.map((imagen, index) => (
              <button
                key={index}
                onClick={() => setImagenSeleccionada(index)}
                className={`aspect-square overflow-hidden rounded-md border-2 ${
                  index === imagenSeleccionada ? 'border-primary' : 'border-muted'
                }`}
              >
                <ImageWithFallback
                  src={imagen}
                  alt={`${product.name} - imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="capitalize">{product.brand}</Badge>
              {product.isNew && <Badge className="bg-blue-100 text-blue-800">Nuevo</Badge>}
              {product.isSale && <Badge variant="destructive">-{product.salePercentage}% OFF</Badge>}
            </div>
            
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {renderStars(product.rating, "md")}
              </div>
              <span className="font-medium">{product.rating}</span>
              <button className="text-sm text-primary hover:underline">
                ({product.reviewCount} reseñas)
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="text-green-600 font-medium">
                    Ahorras ${product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            <p className="text-muted-foreground mb-6">
              {product.description || "Producto de alta calidad para tu vehículo."}
            </p>

            {/* Información del taller */}
            {product.tallerNombre && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Vendido por {product.tallerNombre}</p>
                        <p className="text-sm text-muted-foreground">Taller verificado</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleContactarTaller}>
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-3 w-3 mr-1" />
                        Llamar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Compatibilidad */}
            {product.compatibility && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Compatibilidad:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.slice(0, 6).map((comp: string) => (
                    <Badge 
                      key={comp} 
                      variant="outline" 
                      className={`capitalize ${
                        compatibility.matchedCars.some(car => 
                          comp.toLowerCase() === "universal" ||
                          comp.toLowerCase() === car.marca.toLowerCase() ||
                          comp.toLowerCase().includes(car.marca.toLowerCase())
                        ) ? "bg-green-100 text-green-800 border-green-300" : ""
                      }`}
                    >
                      {comp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel de compra */}
        <div className="lg:col-span-1 xl:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Cantidad:</span>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      disabled={cantidad <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{cantidad}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCantidad(cantidad + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className={`w-full ${compatibility.isCompatible ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={handleAgregarCarrito}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Agregar al carrito - ${(product.price * cantidad).toFixed(2)}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onToggleWishlist(product)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? "fill-current text-red-500" : ""}`} />
                    {isInWishlist ? "En favoritos" : "Agregar a favoritos"}
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
        </div>
      </div>

      {/* Tabs de información detallada */}
      <div className="mt-12">
        <Tabs value={tabActiva} onValueChange={setTabActiva}>
          <TabsList>
            <TabsTrigger value="descripcion">Descripción</TabsTrigger>
            <TabsTrigger value="especificaciones">Especificaciones</TabsTrigger>
            <TabsTrigger value="reviews">Reseñas ({reviewsDetalladas.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="descripcion" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Descripción del producto</h3>
                <div className="prose prose-sm max-w-none">
                  <p>{product.description || "Producto de alta calidad diseñado para brindar el máximo rendimiento y durabilidad."}</p>
                  <h4>Características principales:</h4>
                  <ul>
                    <li>Fabricado con materiales de primera calidad</li>
                    <li>Diseño optimizado para máximo rendimiento</li>
                    <li>Fácil instalación y mantenimiento</li>
                    <li>Compatible con múltiples modelos de vehículos</li>
                    <li>Garantía extendida incluida</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="especificaciones" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Especificaciones técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Marca:</strong> {product.brand}</p>
                    <p><strong>Categoría:</strong> {product.category}</p>
                    <p><strong>Peso:</strong> 2.5 kg</p>
                    <p><strong>Dimensiones:</strong> 15 x 10 x 5 cm</p>
                  </div>
                  <div>
                    <p><strong>Material:</strong> Acero inoxidable</p>
                    <p><strong>Garantía:</strong> 12 meses</p>
                    <p><strong>País de origen:</strong> Ecuador</p>
                    <p><strong>Certificaciones:</strong> ISO 9001</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold mb-2">{product.rating}</div>
                      <div className="flex justify-center mb-2">
                        {renderStars(product.rating, "md")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Basado en {reviewsDetalladas.length} reseñas
                      </div>
                    </div>

                    <div className="space-y-2">
                      {calcularDistribucionRatings().map(({ stars, count, percentage }) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm w-8">{stars}★</span>
                          <Progress value={percentage} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-8">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {reviewsDetalladas.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>{review.usuario.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.usuario}</span>
                            {review.verificado && (
                              <Badge variant="secondary" className="text-xs">Compra verificada</Badge>
                            )}
                            <span className="text-sm text-muted-foreground">{review.fecha}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="font-medium">{review.titulo}</span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{review.comentario}</p>
                          
                          {review.imagenes.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {review.imagenes.map((imagen, index) => (
                                <div key={index} className="w-16 h-16 rounded overflow-hidden">
                                  <ImageWithFallback
                                    src={imagen}
                                    alt="Imagen de reseña"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm">
                            <button className="text-muted-foreground hover:text-foreground">
                              👍 Útil ({review.util})
                            </button>
                            <button className="text-muted-foreground hover:text-foreground">
                              Reportar
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Productos relacionados */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Productos relacionados</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {productosRelacionados.map((relacionado) => (
            <Card key={relacionado.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onVerProducto(relacionado)}>
              <CardContent className="p-4">
                <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
                  <ImageWithFallback
                    src={relacionado.image}
                    alt={relacionado.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm line-clamp-2">{relacionado.name}</h4>
                  <div className="flex items-center gap-1">
                    {renderStars(relacionado.rating, "sm")}
                    <span className="text-xs text-muted-foreground">({relacionado.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">${relacionado.price}</span>
                    {relacionado.originalPrice && (
                      <>
                        <span className="text-sm text-muted-foreground line-through">
                          ${relacionado.originalPrice}
                        </span>
                        {relacionado.isSale && (
                          <Badge variant="destructive" className="text-xs">
                            -{relacionado.salePercentage}%
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}