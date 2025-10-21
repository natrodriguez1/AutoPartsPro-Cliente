import { useState, useMemo } from "react";
import { ProductCard } from "../components/ProductCard";
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

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  brand: string;
  compatibility: string[];
  isNew?: boolean;
  isSale?: boolean;
  salePercentage?: number;
  description?: string;
  tallerId?: string;
  tallerNombre?: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  duration: string;
  description?: string;
  tallerId?: string;
  tallerNombre?: string;
  ciudad?: string;
  telefono?: string;
  whatsapp?: string;
  especialidad?: string;
  isPromoted?: boolean;
  isUrgent?: boolean;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  brand: string[];
  compatibility: string[];
}

interface ProductCatalogueProps {
  onVerPerfil?: (taller: any) => void;
  onAgregarCarrito?: (producto: any) => void;
  onToggleWishlist?: (producto: any) => void;
  onVerProducto?: (producto: any) => void;
  onVerServicio?: (servicio: any) => void;
  onIniciarChat?: (taller: any) => void;
  wishlistItems?: any[];
}

//TODO: llamada a productos
const mockProducts: Product[] = [
  {
    id: "brake_001",
    name: "Pastillas de Freno Cerámicas Premium Bosch",
    price: 89,
    originalPrice: 119,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
    category: "frenos",
    brand: "bosch",
    compatibility: ["honda", "toyota", "nissan"],
    isSale: true,
    salePercentage: 25,
    description: "Pastillas de freno cerámicas de alto rendimiento, menos ruido y mayor durabilidad",
    tallerId: "1",
    tallerNombre: "AutoMaster Quito"
  },
  {
    id: "engine_001",
    name: "Filtro de Aire K&N Performance",
    price: 45,
    originalPrice: 65,
    rating: 4.6,
    reviewCount: 298,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=500&fit=crop",
    category: "motor",
    brand: "k&n",
    compatibility: ["universal"],
    isSale: true,
    salePercentage: 30,
    description: "Filtro de aire de alto flujo, lavable y reutilizable",
    tallerId: "1",
    tallerNombre: "AutoMaster Quito"
  },
  {
    id: "tire_001",
    name: "Neumáticos Urbanos Bridgestone 205/55R16",
    price: 285,
    originalPrice: 320,
    rating: 4.6,
    reviewCount: 223,
    image: "https://images.unsplash.com/photo-1449667585940-75d7cfeae11b?w=400&h=500&fit=crop",
    category: "neumaticos",
    brand: "bridgestone",
    compatibility: ["universal"],
    isSale: true,
    salePercentage: 11,
    description: "Neumáticos para ciudad con excelente durabilidad y confort",
    tallerId: "2",
    tallerNombre: "TallerPro Guayaquil"
  },
  {
    id: "elec_001",
    name: "Batería Bosch S4 12V 60Ah",
    price: 120,
    rating: 4.6,
    reviewCount: 289,
    image: "https://images.unsplash.com/photo-1620064723069-5e2b2bd2102f?w=400&h=500&fit=crop",
    category: "electrico",
    brand: "bosch",
    compatibility: ["universal"],
    description: "Batería libre de mantenimiento con 3 años de garantía",
    tallerId: "1",
    tallerNombre: "AutoMaster Quito"
  },
  {
    id: "susp_001",
    name: "Amortiguadores Monroe Gas-Matic (Par)",
    price: 180,
    rating: 4.7,
    reviewCount: 167,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop",
    category: "suspension",
    brand: "monroe",
    compatibility: ["toyota", "honda", "nissan"],
    description: "Amortiguadores de gas para mejor control y confort de manejo",
    tallerId: "3",
    tallerNombre: "MecánicaTotal Cuenca"
  },
  {
    id: "engine_002",
    name: "Aceite de Motor Sintético Mobil 1",
    price: 35,
    rating: 4.9,
    reviewCount: 445,
    image: "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=400&h=500&fit=crop",
    category: "motor",
    brand: "mobil1",
    compatibility: ["universal"],
    description: "Aceite sintético premium 5W-30 para máxima protección del motor",
    tallerId: "1",
    tallerNombre: "AutoMaster Quito"
  },
  {
    id: "elec_002",
    name: "Kit de Conversión LED para Faros",
    price: 159,
    rating: 4.5,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=500&fit=crop",
    category: "electrico",
    brand: "philips",
    compatibility: ["universal"],
    isNew: true,
    description: "Luces LED de alta eficiencia para mejor visibilidad nocturna",
    tallerId: "2",
    tallerNombre: "TallerPro Guayaquil"
  },
  {
    id: "trans_001",
    name: "Kit de Embrague Valeo",
    price: 280,
    originalPrice: 350,
    rating: 4.7,
    reviewCount: 123,
    image: "https://images.unsplash.com/photo-1559992290-8b72b62aeca8?w=400&h=500&fit=crop",
    category: "transmision",
    brand: "valeo",
    compatibility: ["ford", "chevrolet", "fiat"],
    isSale: true,
    salePercentage: 20,
    description: "Kit completo de embrague para transmisión manual",
    tallerId: "1",
    tallerNombre: "AutoMaster Quito"
  }
];

// TODO: llamada a servicios
const mockServices: Service[] = [
  {
    id: "service_001",
    name: "Cambio de Aceite y Filtros Premium",
    price: 45,
    originalPrice: 60,
    rating: 4.9,
    reviewCount: 328,
    image: "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=400&h=500&fit=crop",
    category: "mantenimiento",
    duration: "30 min",
    description: "Cambio de aceite sintético premium con filtro de aceite y revisión general de 21 puntos",
    tallerId: "1",
    tallerNombre: "AutoMaster Quito",
    ciudad: "Quito",
    telefono: "+593-2-245-6789",
    whatsapp: "+593-99-123-4567",
    especialidad: "Mantenimiento Preventivo",
    isPromoted: true
  },
  {
    id: "service_002",
    name: "Diagnóstico Computarizado Completo",
    price: 25,
    rating: 4.8,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=500&fit=crop",
    category: "diagnostico",
    duration: "45 min",
    description: "Diagnóstico completo con scanner profesional, revisión de códigos de error y reporte detallado",
    tallerId: "1",
    tallerNombre: "AutoMaster Quito",
    ciudad: "Quito",
    telefono: "+593-2-245-6789",
    whatsapp: "+593-99-123-4567",
    especialidad: "Diagnóstico Electrónico"
  },
  {
    id: "service_003",
    name: "Revisión de Frenos Integral",
    price: 35,
    rating: 4.7,
    reviewCount: 289,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
    category: "frenos",
    duration: "60 min",
    description: "Revisión completa de pastillas, discos, líquido de frenos y calibración del sistema",
    tallerId: "2",
    tallerNombre: "TallerPro Guayaquil",
    ciudad: "Guayaquil",
    telefono: "+593-4-289-3456",
    whatsapp: "+593-98-765-4321",
    especialidad: "Sistema de Frenos"
  },
  {
    id: "service_004",
    name: "Alineación 3D Computarizada",
    price: 25,
    rating: 4.9,
    reviewCount: 198,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop",
    category: "suspension",
    duration: "45 min",
    description: "Alineación de precisión con tecnología 3D, balanceado de llantas incluido",
    tallerId: "3",
    tallerNombre: "MecánicaTotal Cuenca",
    ciudad: "Cuenca",
    telefono: "+593-7-405-7890",
    whatsapp: "+593-96-789-0123",
    especialidad: "Suspensión y Dirección",
    isUrgent: true
  },
  {
    id: "service_005",
    name: "Mantenimiento de Transmisión",
    price: 80,
    originalPrice: 100,
    rating: 4.6,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1559992290-8b72b62aeca8?w=400&h=500&fit=crop",
    category: "transmision",
    duration: "90 min",
    description: "Cambio de aceite de transmisión, revisión de embrague y ajustes necesarios",
    tallerId: "4",
    tallerNombre: "ExpressAuto Ambato",
    ciudad: "Ambato",
    telefono: "+593-3-242-1890",
    whatsapp: "+593-97-456-7890",
    especialidad: "Transmisión Manual y Automática"
  },
  {
    id: "service_006",
    name: "Revisión Pre-ITV Completa",
    price: 40,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1632823469652-6ac2ce2e7351?w=400&h=500&fit=crop",
    category: "revision",
    duration: "75 min",
    description: "Revisión integral preparatoria para la Inspección Técnica Vehicular",
    tallerId: "5",
    tallerNombre: "AutoTech Manta",
    ciudad: "Manta",
    telefono: "+593-5-262-3456",
    whatsapp: "+593-95-234-5678",
    especialidad: "Inspección Vehicular",
    isPromoted: true
  },
  {
    id: "service_007",
    name: "Servicio de A/C y Climatización",
    price: 55,
    rating: 4.7,
    reviewCount: 145,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=500&fit=crop",
    category: "climatizacion",
    duration: "60 min",
    description: "Revisión, recarga y mantenimiento completo del sistema de aire acondicionado",
    tallerId: "6",
    tallerNombre: "ClimaCar Loja",
    ciudad: "Loja",
    telefono: "+593-7-257-4567",
    whatsapp: "+593-94-567-8901",
    especialidad: "Aire Acondicionado"
  }
];

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

export function HomePage({ 
  onVerPerfil, 
  onAgregarCarrito, 
  onToggleWishlist, 
  onVerProducto,
  onVerServicio,
  onIniciarChat,
  wishlistItems = [] 
}: ProductCatalogueProps) {
  const { usuario } = useAuth();
  const [tabActiva, setTabActiva] = useState<"productos" | "servicios">("productos");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 500],
    minRating: 0,
    brand: [],
    compatibility: [],
  });
  
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Carros del usuario para compatibilidad
  const carrosUsuario = usuario?.carros || [];

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...mockProducts];

    // Apply filters
    if (filters.categories.length > 0) {
      result = result.filter(product => filters.categories.includes(product.category));
    }

    if (filters.brand.length > 0) {
      result = result.filter(product => filters.brand.includes(product.brand));
    }

    if (filters.compatibility.length > 0) {
      result = result.filter(product => 
        filters.compatibility.some(compat => product.compatibility.includes(compat))
      );
    }

    result = result.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    if (filters.minRating > 0) {
      result = result.filter(product => product.rating >= filters.minRating);
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
  }, [filters, sortBy, carrosUsuario]);

  // Filter and sort services
  const filteredAndSortedServices = useMemo(() => {
    let result = [...mockServices];
    
    // Apply basic filtering for services
    if (filters.categories.length > 0) {
      result = result.filter(service => filters.categories.includes(service.category));
    }
    
    result = result.filter(service => 
      service.price >= filters.priceRange[0] && service.price <= filters.priceRange[1]
    );

    if (filters.minRating > 0) {
      result = result.filter(service => service.rating >= filters.minRating);
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
  }, [filters, sortBy]);

  const handleAddToCart = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product && onAgregarCarrito) {
      onAgregarCarrito(product);
      toast.success(`${product.name} agregado al carrito!`);
    }
  };

  const handleWishlistToggle = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product && onToggleWishlist) {
      onToggleWishlist(product);
      const isInWishlist = wishlistItems.some(item => item.id === productId);
      toast.success(isInWishlist ? 
        `${product.name} eliminado de favoritos` : 
        `${product.name} agregado a favoritos`
      );
    }
  };

  const handleVerProducto = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product && onVerProducto) {
      onVerProducto(product);
    }
  };

  const handleVerServicio = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    if (service && onVerServicio) {
      onVerServicio(service);
    }
  };

  const handleIniciarChat = (taller: any) => {
    if (onIniciarChat) {
      onIniciarChat(taller);
      toast.success(`Iniciando chat con ${taller.nombre}...`);
    } else {
      // Fallback al contacto por WhatsApp si no hay función de chat
      if (taller.whatsapp) {
        const mensaje = encodeURIComponent(`Hola ${taller.nombre}, estoy interesado en sus servicios de ${taller.especialidad}. ¿Podrían ayudarme?`);
        window.open(`https://wa.me/${taller.whatsapp.replace(/[^0-9]/g, '')}?text=${mensaje}`, '_blank');
        toast.success(`Abriendo WhatsApp para contactar ${taller.nombre}`);
      }
    }
  };

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
                  <Button size="sm" variant="outline" onClick={() => onVerPerfil?.(taller)}>
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
                filters={filters}
                onFiltersChange={setFilters}
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
                          filters={filters}
                          onFiltersChange={setFilters}
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
                  <Button variant="outline" onClick={() => setFilters({
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
                filters={filters}
                onFiltersChange={setFilters}
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
                          filters={filters}
                          onFiltersChange={setFilters}
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
                  <Button variant="outline" onClick={() => setFilters({
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