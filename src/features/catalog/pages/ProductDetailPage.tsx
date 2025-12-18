import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Progress } from "@/shared/ui/progress";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import {
  ArrowLeft,
  CheckCircle,
  Award,
  MessageCircle,
  Phone,
} from "lucide-react";

import { toast } from "sonner";

import type { Product} from "../types/product";
import type { Carro } from "@/app/types/auth";

import { RatingStars } from "@/shared/components/RatingStars";
import { ImageWithFallback } from "@/shared/components/ImageWithFallback";

import { useAuth } from "@/app/providers/AuthContext";
import { useCart } from "@/features/cart/store/cart.store";
import { useProductCompatibility } from "../hooks/useProductCompatibility";
import { getProductById } from "../services/products.service";
import { productosRelacionados } from "../data/product.mock";

import { DetailBreadcrumb } from "../components/detail/DetailBreadcrumb";
import { ImageGallery } from "../components/detail/ImageGallery";
import { ProductPurchaseCard } from "../components/detail/ProductPurchaseCard";

// Reviews detalladas (igual que antes)
const reviewsDetalladas = [
  {
    id: "1",
    usuario: "Carlos M.",
    rating: 5,
    fecha: "15 Nov 2024",
    titulo: "Excelente calidad",
    comentario:
      "Superó mis expectativas. La calidad es excepcional y la instalación fue muy sencilla. Lo recomiendo al 100%.",
    verificado: true,
    util: 24,
    imagenes: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop",
    ],
  },
  {
    id: "2",
    usuario: "María R.",
    rating: 4,
    fecha: "8 Nov 2024",
    titulo: "Buen producto",
    comentario:
      "Funciona muy bien, aunque tardé un poco en instalarlo. La relación calidad-precio es buena.",
    verificado: true,
    util: 18,
    imagenes: [],
  },
  {
    id: "3",
    usuario: "Pedro L.",
    rating: 5,
    fecha: "2 Nov 2024",
    titulo: "Perfecto para mi Honda Civic",
    comentario:
      "Encajó perfectamente en mi Civic 2020. Muy satisfecho con la compra. El envío fue rápido.",
    verificado: false,
    util: 12,
    imagenes: [],
  },
  {
    id: "4",
    usuario: "Ana S.",
    rating: 3,
    fecha: "28 Oct 2024",
    titulo: "Regular",
    comentario:
      "Cumple su función pero esperaba un poco más por el precio. La calidad es aceptable.",
    verificado: true,
    util: 8,
    imagenes: [],
  },
];

export function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { usuario } = useAuth();
  const userCars: Carro[] = usuario?.carros || [];

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [cantidad, setCantidad] = useState(1);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [tabActiva, setTabActiva] = useState("descripcion");

  // --- carrito y wishlist (igual estilo que HomePage) ---
  const wishlistItems = useCart((s) => s.wishlistItems);
  const toggleWishlist = useCart((s) => s.toggleWishlist);  
  const cartItems = useCart((s) => s.items);
  const addToCart = useCart((s) => s.add);

  const isInWishlist = product
    ? wishlistItems.some((item) => item.id === product.id)
    : false;

  // --- cargar producto desde el repository ---
  useEffect(() => {
    let alive = true;

    async function loadProduct() {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const found = await getProductById(id);
        if (!alive) return;

        // aquí corregimos el error de tipos: Product | undefined -> Product | null
        setProduct(found ?? null);
      } catch (error) {
        console.error("Error cargando producto:", error);
        if (alive) {
          setProduct(null);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      alive = false;
    };
  }, [id]);

  // --- compatibilidad con los carros del usuario ---
  const compatibility = useProductCompatibility(product, userCars);

  const imagenesProducto = useMemo(() => {
    const placeholder =
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop";

    // si vienen imágenes reales, úsalas
    if (product?.images && product.images.length > 0) return product.images;

    // fallback a la image principal si existe
    if (product?.image) return [product.image];

    // último fallback
    return [placeholder];
  }, [product]);

  const onRegresar = () => navigate(-1);

  const handleAgregarCarrito = () => {
    if (!product) return;

    const isInCart = cartItems.some((item) => item.id === product.id);
    addToCart(product, cantidad);

    toast.success(
      isInCart
        ? `Se aumentó la cantidad de ${product.name}`
        : `${cantidad} ${product.name} agregado${
            cantidad > 1 ? "s" : ""
          } al carrito`
    );
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    toggleWishlist(product);

    toast.success(
      isInWishlist
        ? `${product.name} eliminado de favoritos`
        : `${product.name} agregado a favoritos`
    );
  };

  const handleContactarTaller = () => {
    if (product?.workshopName) {
      toast.success(`Contactando con ${product.workshopName}...`);
    }
  };

  const calcularDistribucionRatings = () => {
    const distribucion: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviewsDetalladas.forEach((review) => {
      distribucion[review.rating] =
        (distribucion[review.rating] ?? 0) + 1;
    });

    const total = reviewsDetalladas.length || 1;

    // Ya los devolvemos en orden 5 → 1, así que no hace falta sort
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: distribucion[stars],
      percentage: (distribucion[stars] / total) * 100,
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button variant="outline" onClick={onRegresar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <p className="mt-4">Cargando producto...</p>
      </div>
    );
  }

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
      <DetailBreadcrumb
        onBack={onRegresar}
        category={product.category}
        brand={product.brand}
        backLabel="Volver al catálogo"
      />

      {/* Alerta de compatibilidad */}
      {(compatibility.isSpecificCompatible || compatibility.isUniversal) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                {compatibility.isSpecificCompatible
                  ? "Compatible con tus vehículos"
                  : "Producto universal, compatible con la mayoría de vehículos"}
              </p>
              {compatibility.isSpecificCompatible &&
                compatibility.matchedCars.length > 0 && (
                  <p className="text-sm text-green-700">
                    {compatibility.matchedCars
                      .map(
                        (car) => `${car.marca} ${car.modelo} ${car.año}`
                      )
                      .join(", ")}
                  </p>
                )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">

        {/* Imágenes del producto */}
        <ImageGallery
          images={imagenesProducto}
          selectedIndex={imagenSeleccionada}
          onSelect={setImagenSeleccionada}
          alt={product.name}
        />

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="capitalize">
                {product.brand}
              </Badge>
              {product.isNew && (
                <Badge className="bg-blue-100 text-blue-800">Nuevo</Badge>
              )}
              {product.isSale && (
                <Badge variant="destructive">
                  -{product.salePercentage}% OFF
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <RatingStars rating={product.rating} size="md" />
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
                    Ahorras {(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="text-muted-foreground mb-6">
              {product.description ||
                "Producto de alta calidad para tu vehículo."}
            </p>

            {/* Información del taller */}
            {product.workshopName && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">
                          Vendido por {product.workshopName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Taller verificado
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleContactarTaller}
                      >
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
                  {product.compatibility.slice(0, 6).map((comp: string) => {
                    const compLower = comp.toLowerCase();

                    const isHighlighted =
                      (compLower === "universal" &&
                        compatibility.isUniversal) ||
                      compatibility.matchedCars.some((car) => {
                        const brand = car.marca.toLowerCase();
                        const model = car.modelo.toLowerCase();
                        return (
                          compLower === brand ||
                          compLower.includes(brand) ||
                          compLower === model ||
                          compLower.includes(model)
                        );
                      });

                    return (
                      <Badge
                        key={comp}
                        variant="outline"
                        className={`capitalize ${
                          isHighlighted
                            ? "bg-green-100 text-green-800 border-green-300"
                            : ""
                        }`}
                      >
                        {comp}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel de compra */}
        <div className="lg:col-span-1 xl:col-span-1">
          <ProductPurchaseCard
            quantity={cantidad}
            onQuantityChange={setCantidad}
            isWishlisted={isInWishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAgregarCarrito}
            totalLabel={`$${(product.price * cantidad).toFixed(2)}`}
            highlight={compatibility.isSpecificCompatible}
          />
        </div>
      </div>

      {/* Tabs de información detallada */}
      <div className="mt-12">
        <Tabs value={tabActiva} onValueChange={setTabActiva}>
          <TabsList>
            <TabsTrigger value="descripcion">Descripción</TabsTrigger>
            <TabsTrigger value="especificaciones">Especificaciones</TabsTrigger>
            <TabsTrigger value="reviews">
              Reseñas ({reviewsDetalladas.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="descripcion" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Descripción del producto</h3>
                <div className="prose prose-sm max-w-none">
                  <p>
                    {product.description ||
                      "Producto de alta calidad diseñado para brindar el máximo rendimiento y durabilidad."}
                  </p>
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
                    <p>
                      <strong>Marca:</strong> {product.brand}
                    </p>
                    <p>
                      <strong>Categoría:</strong> {product.category}
                    </p>
                    <p>
                      <strong>Peso:</strong> 2.5 kg
                    </p>
                    <p>
                      <strong>Dimensiones:</strong> 15 x 10 x 5 cm
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Material:</strong> Acero inoxidable
                    </p>
                    <p>
                      <strong>Garantía:</strong> 12 meses
                    </p>
                    <p>
                      <strong>País de origen:</strong> Ecuador
                    </p>
                    <p>
                      <strong>Certificaciones:</strong> ISO 9001
                    </p>
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
                      <div className="text-4xl font-bold mb-2">
                        {product.rating}
                      </div>
                      <div className="flex justify-center mb-2">
                        <RatingStars rating={product.rating} size="md" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Basado en {reviewsDetalladas.length} reseñas
                      </div>
                    </div>

                    <div className="space-y-2">
                      {calcularDistribucionRatings().map(
                        ({ stars, count, percentage }) => (
                          <div key={stars} className="flex items-center gap-2">
                            <span className="text-sm w-8">{stars}★</span>
                            <Progress value={percentage} className="flex-1" />
                            <span className="text-sm text-muted-foreground w-8">
                              {count}
                            </span>
                          </div>
                        )
                      )}
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
                          <AvatarFallback>
                            {review.usuario
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">
                              {review.usuario}
                            </span>
                            {review.verificado && (
                              <Badge variant="secondary" className="text-xs">
                                Compra verificada
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {review.fecha}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <RatingStars rating={review.rating} size="sm" />
                            <span className="font-medium">
                              {review.titulo}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">
                            {review.comentario}
                          </p>

                          {review.imagenes.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {review.imagenes.map((imagen, index) => (
                                <div
                                  key={index}
                                  className="w-16 h-16 rounded overflow-hidden"
                                >
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
            <Card
              key={relacionado.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/productos/${relacionado.id}`)}
            >
              <CardContent className="p-4">
                <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
                  <ImageWithFallback
                    src={relacionado.image}
                    alt={relacionado.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm line-clamp-2">
                    {relacionado.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    <RatingStars rating={relacionado.rating} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      ({relacionado.reviewCount})
                    </span>
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
