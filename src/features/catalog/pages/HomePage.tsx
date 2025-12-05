import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "@/features/cart/store/cart.store";
import { ProductCard } from "../components/ProductCard";
import { fetchProducts } from "@/features/catalog/services/products.api";
import { fetchServices } from "../services/services.api";
import { FilterPanel } from "../components/FilterPanel";
import { SortDropdown, SortOption } from "../components/SortDropdown";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Filter, Grid, List, MessageCircle, MapPin, Star, Wrench, Package, Clock, Calendar, TrendingUp, Navigation } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthContext";
import { ImageWithFallback } from "@/shared/components/ImageWithFallback";
import api from "@/shared/lib/axios";
import { useNavigate } from "react-router-dom";
import { Product } from "../types/product";
import { Service } from "../types/service";
import { ProductFilter } from "../types/product";
import { serviceFilter } from "../types/service";

// TODO: llamadas a detalles de talleres 
const talleresDestacados = [
  {
    id: "1",
    nombre: "AutoMaster Quito",
    especialidad: "Motor y Transmisión",
    ciudad: "Quito",
    rating: 4.8,
    distancia: "2.3 km",
    telefono: "+593-2-245-6789",
    whatsapp: "+593-99-123-4567",
    reseñas: ["Excelente diagnóstico computarizado", "Muy profesionales y puntuales"],
    badges: ["closest"] // Más cercano
  },
  {
    id: "2",
    nombre: "TallerPro Guayaquil", 
    especialidad: "Sistema de Frenos y Eléctrico",
    ciudad: "Guayaquil",
    rating: 4.6,
    distancia: "3.1 km",
    telefono: "+593-4-289-3456",
    whatsapp: "+593-98-765-4321",
    reseñas: ["Especialistas en frenos europeos", "Trabajo de calidad garantizado"],
    badges: ["growth"] // Mayor crecimiento
  },
  {
    id: "3",
    nombre: "MecánicaTotal Cuenca",
    especialidad: "Suspensión y Dirección",
    ciudad: "Cuenca",
    rating: 4.7,
    distancia: "4.5 km",
    telefono: "+593-7-405-7890",
    whatsapp: "+593-96-789-0123",
    reseñas: ["Los mejores en alineación 3D", "Personal altamente capacitado"],
    badges: []
  },
  {
    id: "4",
    nombre: "ExpressAuto Ambato",
    especialidad: "Servicio Rápido y Mantenimiento",
    ciudad: "Ambato",
    rating: 4.5,
    distancia: "5.2 km",
    telefono: "+593-3-242-1890",
    whatsapp: "+593-97-456-7890",
    reseñas: ["Servicio express muy eficiente", "Buenos precios y calidad"],
    badges: []
  },
  {
    id: "5",
    nombre: "AutoTech Manta",
    especialidad: "Tecnología Avanzada",
    ciudad: "Manta",
    rating: 4.9,
    distancia: "6.8 km",
    telefono: "+593-5-262-3456",
    whatsapp: "+593-95-234-5678",
    reseñas: ["Equipos de última generación", "Excelente servicio al cliente"],
    badges: []
  },
  {
    id: "6",
    nombre: "ClimaCar Loja",
    especialidad: "Aire Acondicionado y Climatización",
    ciudad: "Loja",
    rating: 4.4,
    distancia: "7.5 km",
    telefono: "+593-7-257-4567",
    whatsapp: "+593-94-567-8901",
    reseñas: ["Especialistas en A/C", "Soluciones efectivas"],
    badges: []
  }
];



  const renderBadges = (badges: string[]) => {
    return badges.map(badge => {
      switch (badge) {
        case "closest":
          return (
            <Badge key={badge} className="bg-blue-100 text-blue-800 text-xs font-medium">
              <Navigation className="h-3 w-3 mr-1" />
              Más Cercano
            </Badge>
          );
        case "growth":
          return (
            <Badge key={badge} className="bg-green-100 text-green-800 text-xs font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              Mayor Crecimiento
            </Badge>
          );
        default:
          return null;
      }
    });
  };

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
  export function HomePage() {
    //TODO: llamada a productos
    const [products, setProducts] = useState<Product[]>([]);
    const isLoadingProducts = products.length === 0;

    useEffect(() => {
      let alive = true;
      fetchProducts().then((data) => {
       if (alive) setProducts(data as unknown as Product[]);
      });
      return () => {alive = false;};
    }, []);

    //TODO: llamada a servicios
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
      fetchServices().then((data) => setServices(data as Service[]));
    }, []);

  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [tabActiva, setTabActiva] = useState<"productos" | "servicios">("productos");
  
  const [productFilters, setProductFilters] = useState<ProductFilter>({
    categories: [],
    priceRange: [0, 500],
    minRating: 0,
    brand: [],
    compatibility: [],
  });

  const [serviceFilters, setServiceFilters] = useState<serviceFilter>({
    categories: [],
    priceRange: [0, 500],
    minRating: 0,
    brand: [],
    compatibility: [],
  });

  const [sortBy, setSortBy] = React.useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Instead of using props, use router navigation:
  const handleVerPerfil = (tallerId: string) => {
    navigate(`/taller/perfil/${tallerId}`);
  };

  const handleVerProducto = (productoId: string) => {
    navigate(`/productos/${productoId}`);
  };

  const handleVerServicio = (servicioId: string) => {
    navigate(`/servicios/${servicioId}`);
  };

  const handleIrCarrito = () => {
    navigate(`/carrito`);
  };

  const handleLogin = () => {
    navigate(`/login`);
  };

  const carrosUsuario = usuario?.carros || [];

  const filteredAndSortedProducts = useMemo(() => {
  let result = [...products];

  if (productFilters.categories.length > 0) {
    result = result.filter(p => productFilters.categories.includes(p.category));
  }

  if (productFilters.brand.length > 0) {
    result = result.filter(p => productFilters.brand.includes(p.brand));
  }

  if (productFilters.compatibility.length > 0) {
    result = result.filter(p => 
      productFilters.compatibility.some(compat => p.compatibility.includes(compat))
    );
  }

  result = result.filter(p => 
    p.price >= productFilters.priceRange[0] && p.price <= productFilters.priceRange[1]
  );

  if (productFilters.minRating > 0) {
    result = result.filter(p => p.rating >= productFilters.minRating);
  }

  // Apply sorting
  switch (sortBy) {
    case "price-low-high":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high-low":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    default:
      // relevance - prioritizar productos compatibles
      result.sort((a, b) => {
        const aCompatible = carrosUsuario.some((car: any) => {
          const carBrand = car.marca.toLowerCase();
          return a.compatibility.some(compat => 
            compat.toLowerCase() !== "universal" && (
              compat.toLowerCase() === carBrand ||
              compat.toLowerCase().includes(carBrand)
            )
          );
        });
        
        const bCompatible = carrosUsuario.some((car: any) => {
          const carBrand = car.marca.toLowerCase();
          return b.compatibility.some(compat => 
            compat.toLowerCase() !== "universal" && (
              compat.toLowerCase() === carBrand ||
              compat.toLowerCase().includes(carBrand)
            )
          );
        });
        
        if (aCompatible && !bCompatible) return -1;
        if (!aCompatible && bCompatible) return 1;
        return 0;
      });
      break;
  }

  return result;
}, [products, productFilters, sortBy, carrosUsuario]);

//   // Filter and sort services
const filteredAndSortedServices = useMemo(() => {
  let result = [...services];
  
  // Apply basic filtering for services
  if (serviceFilters.categories.length > 0) {
    result = result.filter(service => serviceFilters.categories.includes(service.category));
  }
  
  result = result.filter(service => 
    service.price >= serviceFilters.priceRange[0] && service.price <= serviceFilters.priceRange[1]
  );

  if (serviceFilters.minRating > 0) {
    result = result.filter(service => service.rating >= serviceFilters.minRating);
  }

  // Apply sorting
  switch (sortBy) {
    case "price-low-high":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high-low":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // relevance - prioritizar servicios promocionados
      result.sort((a, b) => {
        if (a.isPromoted && !b.isPromoted) return -1;
        if (!a.isPromoted && b.isPromoted) return 1;
        return b.rating - a.rating;
      });
      break;
  }

  return result;
}, [services, serviceFilters, sortBy]);

const wishlistItems = useCart((s) => s.wishlistItems);
const toggleWishlist = useCart((s) => s.toggleWishlist);

const handleWishlistToggle = async (productId: string) => {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const isInWishlist = wishlistItems.some(item => item.id === productId);
  toggleWishlist(product);

  toast.success(
    isInWishlist
      ? `${product.name} eliminado de favoritos`
      : `${product.name} agregado a favoritos`
  );
};

const handleViewProduct = (id: string) => navigate(`/productos/${id}`);

const cartItems = useCart((s) => s.items);
const addToCart = useCart((s) => s.add);

const handleAddToCart = async (productId: string) => {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const isInCart = cartItems.some(item => item.id === productId);

  // si ya está, suma cantidad; si no, lo agrega con cantidad 1
  addToCart(product, 1);

  toast.success(
    isInCart
      ? `Se aumentó la cantidad de ${product.name}`
      : `${product.name} agregado al carrito`
  );
};


const handleIniciarChat = (taller: any) => {
  if (taller.whatsapp) {
    const mensaje = encodeURIComponent(
      `Hola ${taller.nombre}, estoy interesado en sus servicios de ${taller.especialidad}. ¿Podrían ayudarme?`
    );
    window.open(
      `https://wa.me/${taller.whatsapp.replace(/[^0-9]/g, '')}?text=${mensaje}`,
      "_blank"
    );
    toast.success(`Abriendo WhatsApp para contactar ${taller.nombre}`);
  } else {
    toast.error("No se pudo iniciar el chat ni contactar por WhatsApp");
  }
};

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Talleres destacados - expandido */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Red de Talleres Especializados en Ecuador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talleresDestacados.map((taller) => (
              <div key={taller.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{taller.nombre}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {renderBadges(taller.badges)}
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1 ml-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {taller.rating}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2 font-medium">{taller.especialidad}</p>
                <p className="text-sm text-muted-foreground mb-3">
                  📍 {taller.ciudad} • {taller.distancia}
                </p>
                <div className="text-sm text-muted-foreground mb-4">
                  "{taller.reseñas[0]}"
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleVerPerfil(taller.id)}>
                    Ver Perfil
                  </Button>
                  <Button size="sm" onClick={() => handleIniciarChat(taller)}>
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Chat
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Productos y Servicios */}
      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="mb-6">
          <TabsTrigger value="productos" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Repuestos ({filteredAndSortedProducts.length})
          </TabsTrigger>
          <TabsTrigger value="servicios" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Servicios ({filteredAndSortedServices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="productos">
          <div className="flex gap-6">
            {/* Desktop Filter Panel */}
            <div className="hidden lg:block flex-shrink-0">
              <FilterPanel
                filters={productFilters}
                onFiltersChange={setProductFilters}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h1>Repuestos Automotrices ({filteredAndSortedProducts.length})</h1>
                  
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md gap-1.5 px-3 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <div className="p-4">
                        <FilterPanel
                          filters={productFilters}
                          onFiltersChange={setProductFilters}
                          isMobile={true}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sort Dropdown */}
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                </div>
              </div>

              {/* Products Grid */}
              {filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron repuestos que coincidan con tus filtros.</p>
                  <Button variant="outline" onClick={() => setProductFilters({
                    categories: [],
                    brand: [],
                    compatibility: [],
                    priceRange: [0, 500],
                    minRating: 0,
                  })} className="mt-4">
                    Limpiar Filtros
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onWishlistToggle={handleWishlistToggle}
                      onVerProducto={handleVerProducto}
                      isInWishlist={wishlistItems.some(item => item.id === product.id)}
                      viewMode={viewMode}
                      userCars={carrosUsuario}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="servicios">
          <div className="flex gap-6">
            {/* Desktop Filter Panel para servicios */}
            <div className="hidden lg:block flex-shrink-0">
              <FilterPanel
                filters={serviceFilters}
                onFiltersChange={setServiceFilters}
                isServiceMode={true}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h1>Servicios de Taller ({filteredAndSortedServices.length})</h1>
                  
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md gap-1.5 px-3 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <div className="p-4">
                        <FilterPanel
                          filters={serviceFilters}
                          onFiltersChange={setServiceFilters}
                          isMobile={true}
                          isServiceMode={true}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                </div>
              </div>

              {/* Services Grid */}
              {filteredAndSortedServices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron servicios que coincidan con tus filtros.</p>
                  <Button variant="outline" onClick={() => setServiceFilters({
                    categories: [],
                    brand: [],
                    compatibility: [],
                    priceRange: [0, 500],
                    minRating: 0,
                  })} className="mt-4">
                    Limpiar Filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedServices.map((service) => (
                    <Card 
                      key={service.id} 
                      className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm"
                      onClick={() => handleVerServicio(service.id)}
                    >
                      <CardContent className="p-4">
                        <div className="relative">
                          <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
                            <ImageWithFallback
                              src={service.image}
                              alt={service.name}
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          </div>
                          
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {service.isPromoted && (
                              <Badge className="bg-blue-500 text-white text-xs font-medium">
                                Promocionado
                              </Badge>
                            )}
                            {service.isUrgent && (
                              <Badge variant="destructive" className="text-xs font-medium">
                                Express
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-medium leading-tight line-clamp-2 h-10">
                            {service.name}
                          </h3>

                          <div className="flex items-center gap-1">
                            {renderStars(service.rating)}
                            <span className="text-sm text-muted-foreground ml-1">
                              {service.rating} ({service.reviewCount})
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">${service.price}</span>
                              {service.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${service.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{service.duration}</span>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Wrench className="h-3 w-3" />
                            <span>Por {service.tallerNombre}</span>
                          </div>

                          <Button 
                            className="w-full mt-2"
                            size="sm"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Ver Detalle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}