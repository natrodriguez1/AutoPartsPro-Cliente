import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Clock, 
  Star, 
  MessageCircle,
  Navigation,
  Calendar,
  Award,
  Package,
  Plus,
  ThumbsUp,
  Filter,
  Send,
  ShoppingCart,
  Search,
  Heart,
  Eye,
  DollarSign
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PerfilTallerProps {
  taller: any;
  onRegresar: () => void;
  onIniciarChat: () => void;
  onAgregarCarrito?: (producto: any) => void;
  onToggleWishlist?: (producto: any) => void;
  onVerProducto?: (producto: any) => void;
  wishlistItems?: any[];
}

// Mock data para productos por taller
const productosPorTaller = {
  "1": [ // AutoMaster Quito
    {
      id: "brake_001",
      nombre: "Pastillas de Freno Cerámicas Premium Bosch",
      precio: 89,
      precioOriginal: 119,
      rating: 4.8,
      reviewCount: 234,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
      categoria: "frenos",
      marca: "Bosch",
      stock: 5,
      disponible: true,
      isSale: true,
      salePercentage: 25,
      descripcion: "Pastillas de freno cerámicas de alto rendimiento",
      compatibility: ["honda", "toyota", "nissan"]
    },
    {
      id: "engine_001",
      nombre: "Filtro de Aire K&N Performance",
      precio: 45,
      precioOriginal: 65,
      rating: 4.6,
      reviewCount: 298,
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=500&fit=crop",
      categoria: "motor",
      marca: "K&N",
      stock: 12,
      disponible: true,
      isSale: true,
      salePercentage: 30,
      descripcion: "Filtro de aire de alto flujo, lavable y reutilizable",
      compatibility: ["universal"]
    },
    {
      id: "engine_002",
      nombre: "Aceite de Motor Sintético Mobil 1",
      precio: 35,
      rating: 4.9,
      reviewCount: 445,
      image: "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=400&h=500&fit=crop",
      categoria: "motor",
      marca: "Mobil 1",
      stock: 20,
      disponible: true,
      descripcion: "Aceite sintético premium 5W-30 para máxima protección",
      compatibility: ["universal"]
    },
    {
      id: "elec_001",
      nombre: "Batería Bosch S4 12V 60Ah",
      precio: 120,
      rating: 4.6,
      reviewCount: 289,
      image: "https://images.unsplash.com/photo-1620064723069-5e2b2bd2102f?w=400&h=500&fit=crop",
      categoria: "electrico",
      marca: "Bosch",
      stock: 3,
      disponible: true,
      descripcion: "Batería libre de mantenimiento con 3 años de garantía",
      compatibility: ["universal"]
    }
  ],
  "2": [ // TallerPro Guayaquil
    {
      id: "brake_002",
      nombre: "Discos de Freno Brembo Ventilados",
      precio: 180,
      precioOriginal: 220,
      rating: 4.7,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
      categoria: "frenos",
      marca: "Brembo",
      stock: 8,
      disponible: true,
      isSale: true,
      salePercentage: 18,
      descripcion: "Discos de freno ventilados para mejor disipación del calor",
      compatibility: ["toyota", "honda"]
    },
    {
      id: "brake_003",
      nombre: "Kit de Pastillas y Discos Brembo",
      precio: 350,
      rating: 4.9,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
      categoria: "frenos",
      marca: "Brembo",
      stock: 4,
      disponible: true,
      isNew: true,
      descripcion: "Kit completo de frenos delanteros para sedanes medianos",
      compatibility: ["toyota", "nissan", "mazda"]
    },
    {
      id: "tire_001",
      nombre: "Neumáticos Urbanos Bridgestone 205/55R16",
      precio: 285,
      precioOriginal: 320,
      rating: 4.6,
      reviewCount: 223,
      image: "https://images.unsplash.com/photo-1449667585940-75d7cfeae11b?w=400&h=500&fit=crop",
      categoria: "neumaticos",
      marca: "Bridgestone",
      stock: 16,
      disponible: true,
      isSale: true,
      salePercentage: 11,
      descripcion: "Neumáticos para ciudad con excelente durabilidad",
      compatibility: ["universal"]
    }
  ],
  "3": [ // MecánicaTotal Cuenca
    {
      id: "susp_001",
      nombre: "Amortiguadores Monroe Gas-Matic (Par)",
      precio: 180,
      rating: 4.7,
      reviewCount: 167,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop",
      categoria: "suspension",
      marca: "Monroe",
      stock: 6,
      disponible: true,
      descripcion: "Amortiguadores de gas para mejor control y confort",
      compatibility: ["toyota", "honda", "nissan"]
    },
    {
      id: "susp_002",
      nombre: "Resortes Eibach Pro-Kit",
      precio: 220,
      precioOriginal: 280,
      rating: 4.8,
      reviewCount: 134,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop",
      categoria: "suspension",
      marca: "Eibach",
      stock: 8,
      disponible: true,
      isSale: true,
      salePercentage: 21,
      descripcion: "Resortes deportivos para mejor manejo y apariencia",
      compatibility: ["honda", "toyota"]
    },
    {
      id: "susp_003",
      nombre: "Kit Completo de Dirección Hidráulica",
      precio: 450,
      rating: 4.5,
      reviewCount: 78,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop",
      categoria: "suspension",
      marca: "TRW",
      stock: 2,
      disponible: true,
      descripcion: "Kit completo incluye bomba, mangueras y filtro",
      compatibility: ["toyota", "nissan"]
    }
  ]
};

// Mock data para reseñas
const resenasEjemplo = [
  {
    id: "1",
    usuario: "Carlos Mendoza",
    avatar: "",
    fecha: "2024-01-20",
    calificacion: 5,
    servicio: "Cambio de aceite",
    titulo: "Excelente servicio y atención",
    comentario: "Muy profesionales, trabajo rápido y limpio. El precio fue justo y me explicaron todo el proceso. Definitivamente regresaré.",
    util: 12,
    respuestaTaller: "¡Muchas gracias por tu confianza Carlos! Nos alegra saber que quedaste satisfecho con nuestro servicio."
  },
  {
    id: "2", 
    usuario: "María González",
    avatar: "",
    fecha: "2024-01-18",
    calificacion: 4,
    servicio: "Diagnóstico computarizado",
    titulo: "Buen diagnóstico, pero tardaron un poco",
    comentario: "El diagnóstico fue acertado y solucionaron el problema. Solo que tardaron más de lo esperado, pero el resultado final fue bueno.",
    util: 8,
    respuestaTaller: null
  },
  {
    id: "3",
    usuario: "Ana Rodríguez", 
    avatar: "",
    fecha: "2024-01-15",
    calificacion: 5,
    servicio: "Reparación de frenos",
    titulo: "Perfectos en todo",
    comentario: "Desde la atención al cliente hasta el trabajo técnico, todo impecable. Los frenos quedaron como nuevos y el precio muy competitivo.",
    util: 15,
    respuestaTaller: "¡Gracias Ana! Tu seguridad es nuestra prioridad. Nos da mucha satisfacción saber que todo salió perfecto."
  },
  {
    id: "4",
    usuario: "Roberto Silva",
    avatar: "",
    fecha: "2024-01-12",
    calificacion: 3,
    servicio: "Alineación",
    titulo: "Regular, podría mejorar",
    comentario: "El servicio estuvo bien pero no me explicaron claramente qué hicieron. El carro quedó mejor pero esperaba más comunicación.",
    util: 5,
    respuestaTaller: "Gracias por tu feedback Roberto. Tomaremos en cuenta tu comentario para mejorar nuestra comunicación con los clientes."
  },
  {
    id: "5",
    usuario: "Diego Vargas",
    avatar: "",
    fecha: "2024-01-10",
    calificacion: 5,
    servicio: "Mantenimiento completo",
    titulo: "Los mejores de Quito",
    comentario: "He probado varios talleres y estos son definitivamente los mejores. Conocimiento técnico excelente y precios justos. 100% recomendado.",
    util: 22,
    respuestaTaller: "¡Wow Diego, muchas gracias! Comentarios como el tuyo nos motivan a seguir mejorando cada día."
  }
];

export function PerfilTaller({ taller, onRegresar, onIniciarChat, onAgregarCarrito, onToggleWishlist, onVerProducto, wishlistItems = [] }: PerfilTallerProps) {
  const [filtroCalificacion, setFiltroCalificacion] = useState<string>("todas");
  const [filtroProductos, setFiltroProductos] = useState<string>("todos");
  const [busquedaProductos, setBusquedaProductos] = useState<string>("");
  const [mostrarFormularioResena, setMostrarFormularioResena] = useState(false);
  const [nuevaResena, setNuevaResena] = useState({
    calificacion: 0,
    titulo: "",
    comentario: "",
    servicio: ""
  });

  // Datos expandidos de talleres ecuatorianos
  const talleresEcuador = {
    "1": {
      nombre: "AutoMaster Quito",
      especialidad: "Motor y Transmisión",
      direccion: "Av. 6 de Diciembre N24-253 y Lizardo García",
      ciudad: "Quito",
      telefono: "+593 2 245-6789",
      email: "info@automaster-quito.ec",
      horarios: "Lun-Vie 8:00-18:00, Sáb 8:00-16:00",
      rating: 4.8,
      reviews: 234,
      coordenadas: { lat: -0.2024, lng: -78.4824 },
      servicios: ["Diagnóstico computarizado", "Reparación de motores", "Cambio de aceite", "Alineación"],
      certificaciones: ["ISO 9001", "Certificado INEN"],
      añosExperiencia: 15,
      tecnicosDisponibles: 8
    },
    "2": {
      nombre: "TallerPro Guayaquil",
      especialidad: "Sistema de Frenos",
      direccion: "Av. Francisco de Orellana, Centro Comercial Mall del Sol",
      ciudad: "Guayaquil",
      telefono: "+593 4 289-3456",
      email: "contacto@tallerpro-gye.ec",
      horarios: "Lun-Vie 7:30-19:00, Sáb 8:00-17:00",
      rating: 4.6,
      reviews: 156,
      coordenadas: { lat: -2.1709, lng: -79.9224 },
      servicios: ["Cambio de pastillas", "Rectificado de discos", "Sistema ABS", "Frenos hidráulicos"],
      certificaciones: ["Bosch Certified", "Bendix Partner"],
      añosExperiencia: 12,
      tecnicosDisponibles: 6
    },
    "3": {
      nombre: "MecánicaTotal Cuenca",
      especialidad: "Suspensión y Dirección",
      direccion: "Av. España 1-23 y Huayna Cápac",
      ciudad: "Cuenca",
      telefono: "+593 7 405-7890",
      email: "servicio@mecanicatotal-cuenca.ec",
      horarios: "Lun-Vie 8:00-17:30, Sáb 8:00-15:00",
      rating: 4.7,
      reviews: 89,
      coordenadas: { lat: -2.9001, lng: -79.0059 },
      servicios: ["Amortiguadores", "Alineación 3D", "Balanceado", "Dirección hidráulica"],
      certificaciones: ["Monroe Expert", "Gabriel Certified"],
      añosExperiencia: 18,
      tecnicosDisponibles: 5
    }
  };

  const datosCompletos = talleresEcuador[taller?.id as keyof typeof talleresEcuador] || taller;
  const productosDelTaller = productosPorTaller[taller?.id as keyof typeof productosPorTaller] || [];

  // Cálculo de estadísticas de reseñas
  const estadisticasResenas = {
    total: resenasEjemplo.length,
    promedio: resenasEjemplo.reduce((acc, resena) => acc + resena.calificacion, 0) / resenasEjemplo.length,
    distribucion: {
      5: resenasEjemplo.filter(r => r.calificacion === 5).length,
      4: resenasEjemplo.filter(r => r.calificacion === 4).length,
      3: resenasEjemplo.filter(r => r.calificacion === 3).length,
      2: resenasEjemplo.filter(r => r.calificacion === 2).length,
      1: resenasEjemplo.filter(r => r.calificacion === 1).length,
    }
  };

  // Filtrado de productos
  const productosFiltrados = productosDelTaller.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busquedaProductos.toLowerCase()) ||
                            producto.marca.toLowerCase().includes(busquedaProductos.toLowerCase());
    const coincideCategoria = filtroProductos === "todos" || producto.categoria === filtroProductos;
    return coincideBusqueda && coincideCategoria;
  });

  const categorias = [...new Set(productosDelTaller.map(p => p.categoria))];

  const renderStars = (rating: number, interactive = false, onStarClick?: (star: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
            i <= rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-muted-foreground"
          }`}
          onClick={interactive && onStarClick ? () => onStarClick(i) : undefined}
        />
      );
    }
    return stars;
  };

  const handleSubmitResena = () => {
    if (!nuevaResena.calificacion || !nuevaResena.titulo || !nuevaResena.comentario) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    toast.success("¡Reseña enviada exitosamente!");
    setMostrarFormularioResena(false);
    setNuevaResena({
      calificacion: 0,
      titulo: "",
      comentario: "",
      servicio: ""
    });
  };

  const handleAgregarCarrito = (producto: any) => {
    if (onAgregarCarrito) {
      onAgregarCarrito(producto);
      toast.success(`${producto.nombre} agregado al carrito!`);
    }
  };

  const handleToggleWishlist = (producto: any) => {
    if (onToggleWishlist) {
      onToggleWishlist(producto);
      const isInWishlist = wishlistItems.some(item => item.id === producto.id);
      toast.success(isInWishlist ? 
        `${producto.nombre} eliminado de favoritos` : 
        `${producto.nombre} agregado a favoritos`
      );
    }
  };

  const resenasFiltradasYOrdenadas = resenasEjemplo
    .filter(resena => {
      if (filtroCalificacion === "todas") return true;
      return resena.calificacion === parseInt(filtroCalificacion);
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onRegresar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1>Perfil del Taller</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{datosCompletos.nombre}</CardTitle>
                  <CardDescription>{datosCompletos.especialidad}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{datosCompletos.rating}</span>
                  <span className="text-sm text-muted-foreground">({datosCompletos.reviews} reseñas)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{datosCompletos.direccion}, {datosCompletos.ciudad}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{datosCompletos.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{datosCompletos.horarios}</span>
              </div>
            </CardContent>
          </Card>

          {/* Mapa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Mapa de {datosCompletos.ciudad}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lat: {datosCompletos.coordenadas?.lat}, Lng: {datosCompletos.coordenadas?.lng}
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Navigation className="h-4 w-4 mr-2" />
                    Cómo llegar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Servicios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Servicios Especializados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {datosCompletos.servicios?.map((servicio: string, index: number) => (
                  <Badge key={index} variant="outline" className="justify-center py-2">
                    {servicio}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Productos Disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos Disponibles ({productosDelTaller.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtros para productos */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos..."
                      value={busquedaProductos}
                      onChange={(e) => setBusquedaProductos(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filtroProductos} onValueChange={setFiltroProductos}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las categorías</SelectItem>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grid de productos */}
              {productosFiltrados.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No hay productos disponibles</h3>
                  <p className="text-sm text-muted-foreground">
                    {busquedaProductos || filtroProductos !== "todos" 
                      ? "No se encontraron productos que coincidan con tu búsqueda"
                      : "Este taller no tiene productos registrados"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {productosFiltrados.map((producto) => (
                    <Card key={producto.id} className="group hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="relative">
                          <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
                            <ImageWithFallback
                              src={producto.image}
                              alt={producto.nombre}
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          </div>
                          
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {producto.isNew && (
                              <Badge className="bg-green-500 text-white text-xs">Nuevo</Badge>
                            )}
                            {producto.isSale && (
                              <Badge variant="destructive" className="text-xs">-{producto.salePercentage}%</Badge>
                            )}
                            {!producto.disponible && (
                              <Badge variant="secondary" className="text-xs">Sin stock</Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-medium leading-tight line-clamp-2 h-10">
                            {producto.nombre}
                          </h3>

                          <div className="flex items-center gap-1">
                            {renderStars(producto.rating)}
                            <span className="text-sm text-muted-foreground ml-1">
                              {producto.rating} ({producto.reviewCount})
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">${producto.precio}</span>
                              {producto.precioOriginal && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${producto.precioOriginal}
                                </span>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Stock: {producto.stock}
                            </Badge>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {producto.descripcion}
                          </p>

                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              disabled={!producto.disponible || producto.stock === 0}
                              onClick={() => handleAgregarCarrito(producto)}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Agregar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleToggleWishlist(producto)}
                              className={wishlistItems.some(item => item.id === producto.id) ? "text-red-500" : ""}
                            >
                              <Heart className={`h-3 w-3 ${wishlistItems.some(item => item.id === producto.id) ? "fill-current" : ""}`} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onVerProducto?.(producto)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sistema de Reseñas */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Reseñas y Calificaciones ({estadisticasResenas.total})
                </CardTitle>
                <Button onClick={() => setMostrarFormularioResena(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Escribir Reseña
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="resenas" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="resenas">Reseñas ({estadisticasResenas.total})</TabsTrigger>
                  <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
                </TabsList>

                <TabsContent value="resenas" className="space-y-4">
                  {/* Filtros */}
                  <div className="flex gap-4 items-center">
                    <Select value={filtroCalificacion} onValueChange={setFiltroCalificacion}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por calificación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas las calificaciones</SelectItem>
                        <SelectItem value="5">5 estrellas</SelectItem>
                        <SelectItem value="4">4 estrellas</SelectItem>
                        <SelectItem value="3">3 estrellas</SelectItem>
                        <SelectItem value="2">2 estrellas</SelectItem>
                        <SelectItem value="1">1 estrella</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="outline">
                      {resenasFiltradasYOrdenadas.length} reseñas
                    </Badge>
                  </div>

                  {/* Lista de reseñas */}
                  <div className="space-y-4">
                    {resenasFiltradasYOrdenadas.map((resena) => (
                      <div key={resena.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={resena.avatar} />
                              <AvatarFallback>
                                {resena.usuario.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{resena.usuario}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatearFecha(resena.fecha)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(resena.calificacion)}
                            <Badge variant="outline" className="ml-2 text-xs">
                              {resena.servicio}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">{resena.titulo}</h4>
                          <p className="text-sm text-muted-foreground">{resena.comentario}</p>
                        </div>

                        {resena.respuestaTaller && (
                          <div className="ml-12 p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                Respuesta del taller
                              </Badge>
                            </div>
                            <p className="text-sm">{resena.respuestaTaller}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Útil ({resena.util})
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="estadisticas" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Distribución de Calificaciones</h4>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((estrella) => (
                          <div key={estrella} className="flex items-center gap-2">
                            <span className="text-sm w-8">{estrella}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Progress 
                              value={(estadisticasResenas.distribucion[estrella as keyof typeof estadisticasResenas.distribucion] / estadisticasResenas.total) * 100} 
                              className="flex-1 h-2" 
                            />
                            <span className="text-sm w-8 text-muted-foreground">
                              {estadisticasResenas.distribucion[estrella as keyof typeof estadisticasResenas.distribucion]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Resumen General</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Calificación promedio:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {estadisticasResenas.promedio.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Total reseñas:</span>
                          <span className="text-sm font-medium">{estadisticasResenas.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Recomendación:</span>
                          <span className="text-sm font-medium text-green-600">
                            {Math.round(((estadisticasResenas.distribucion[5] + estadisticasResenas.distribucion[4]) / estadisticasResenas.total) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle>Contactar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={onIniciarChat} className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Iniciar Chat
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Cita
              </Button>
            </CardContent>
          </Card>

          {/* Resumen de productos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Productos disponibles</p>
                <p className="text-sm text-muted-foreground">{productosDelTaller.length} productos</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium">Categorías</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {categorias.map((categoria) => (
                    <Badge key={categoria} variant="secondary" className="text-xs">
                      {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium">Rango de precios</p>
                <p className="text-sm text-muted-foreground">
                  ${Math.min(...productosDelTaller.map(p => p.precio))} - ${Math.max(...productosDelTaller.map(p => p.precio))}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Información del Taller
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Años de experiencia</p>
                <p className="text-sm text-muted-foreground">{datosCompletos.añosExperiencia} años</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium">Técnicos disponibles</p>
                <p className="text-sm text-muted-foreground">{datosCompletos.tecnicosDisponibles} técnicos certificados</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium">Certificaciones</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {datosCompletos.certificaciones?.map((cert: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado actual */}
          <Card>
            <CardHeader>
              <CardTitle>Estado Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Abierto ahora</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Cierra a las 18:00
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog para escribir nueva reseña */}
      <Dialog open={mostrarFormularioResena} onOpenChange={setMostrarFormularioResena}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Escribir Reseña para {datosCompletos.nombre}</DialogTitle>
            <DialogDescription>
              Comparte tu experiencia para ayudar a otros usuarios
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Calificación general *</Label>
              <div className="flex items-center gap-1 mt-1">
                {renderStars(nuevaResena.calificacion, true, (star) => 
                  setNuevaResena(prev => ({...prev, calificacion: star}))
                )}
                <span className="ml-2 text-sm text-muted-foreground">
                  {nuevaResena.calificacion > 0 ? `${nuevaResena.calificacion} estrella${nuevaResena.calificacion > 1 ? 's' : ''}` : 'Selecciona una calificación'}
                </span>
              </div>
            </div>

            <div>
              <Label>Servicio recibido</Label>
              <Select value={nuevaResena.servicio} onValueChange={(value) => setNuevaResena(prev => ({...prev, servicio: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="¿Qué servicio recibiste?" />
                </SelectTrigger>
                <SelectContent>
                  {datosCompletos.servicios?.map((servicio: string, index: number) => (
                    <SelectItem key={index} value={servicio}>
                      {servicio}
                    </SelectItem>
                  ))}
                  <SelectItem value="otro">Otro servicio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Título de tu reseña *</Label>
              <Input
                value={nuevaResena.titulo}
                onChange={(e) => setNuevaResena(prev => ({...prev, titulo: e.target.value}))}
                placeholder="Resume tu experiencia en pocas palabras"
                maxLength={100}
              />
            </div>

            <div>
              <Label>Tu experiencia *</Label>
              <Textarea
                value={nuevaResena.comentario}
                onChange={(e) => setNuevaResena(prev => ({...prev, comentario: e.target.value}))}
                placeholder="Cuéntanos sobre tu experiencia: calidad del servicio, atención al cliente, precio, tiempo de entrega, etc."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {nuevaResena.comentario.length}/500 caracteres
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMostrarFormularioResena(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitResena}>
                <Send className="h-4 w-4 mr-2" />
                Publicar Reseña
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}