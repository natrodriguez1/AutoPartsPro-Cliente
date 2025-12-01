import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getServiceByParamId } from "@/features/catalog/services/catalog.local.services";
import { useAuth } from "@/app/providers/AuthContext";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Progress } from "@/shared/ui/progress";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  Award, 
  Users, 
  Wrench,
  Car,
  Shield,
  ThumbsUp
} from "lucide-react";
import { ImageWithFallback } from "@/shared/components/ImageWithFallback";
import { toast } from "sonner";

interface ServiceDetailProps {
  service?: any;
  onRegresar?: () => void;
  onSolicitarServicio?: (servicio: any, datos: any) => void;
  userCars?: Array<{
    id: string;
    marca: string;
    modelo: string;
    año: number;
  }>;
}

// Reviews de servicios
const serviceReviews = [
  {
    id: "1",
    usuario: "Roberto M.",
    rating: 5,
    fecha: "20 Nov 2024",
    titulo: "Servicio excepcional",
    comentario: "Muy profesionales, el diagnóstico fue preciso y el trabajo de calidad. Recomendado al 100%.",
    verificado: true,
    util: 32,
    vehiculo: "Honda Civic 2020"
  },
  {
    id: "2",
    usuario: "Diana L.",
    rating: 5,
    fecha: "15 Nov 2024",
    titulo: "Excelente atención",
    comentario: "Resolvieron el problema rápidamente y a buen precio. El personal muy amable y explicativo.",
    verificado: true,
    util: 28,
    vehiculo: "Toyota Corolla 2019"
  },
  {
    id: "3",
    usuario: "Andrés P.",
    rating: 4,
    fecha: "10 Nov 2024",
    titulo: "Buen trabajo",
    comentario: "Cumplieron con los tiempos acordados. El trabajo quedó bien, aunque el local podría mejorar.",
    verificado: true,
    util: 15,
    vehiculo: "Nissan Sentra 2021"
  }
];

// Servicios relacionados
const serviciosRelacionados = [
  {
    id: "related_service_1",
    name: "Cambio de Aceite Premium",
    price: 45,
    duration: "30 min",
    rating: 4.8,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=300&h=300&fit=crop",
    tallerNombre: "AutoMaster Quito"
  },
  {
    id: "related_service_2", 
    name: "Alineación 3D Computarizada",
    price: 25,
    duration: "45 min",
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=300&fit=crop",
    tallerNombre: "MecánicaTotal Cuenca"
  },
  {
    id: "related_service_3",
    name: "Revisión de Frenos Completa",
    price: 35,
    duration: "60 min",
    rating: 4.7,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    tallerNombre: "TallerPro Guayaquil"
  }
];

export function ServiceDetailPage({ 
  service: serviceProp,
  onRegresar: onRegresarProp,
  onSolicitarServicio: onSolicitarServicioProp,
  userCars: userCarsProp,
}: ServiceDetailProps = {}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();

  const userCars = userCarsProp ?? (usuario?.carros || []);

  const service = useMemo(() => {
    if (serviceProp) return serviceProp;
    if (!id) return null;
    return getServiceByParamId(id);
  }, [serviceProp, id]);

  const onRegresar = onRegresarProp ?? (() => navigate(-1));

  const onSolicitarServicio =
    onSolicitarServicioProp ??
    ((servicio: any, datos: any) => {
      // ✅ fallback temporal (luego lo conectas a endpoint)
      console.log("Solicitud servicio:", { servicio, datos });
    });

  const [tabActiva, setTabActiva] = useState("descripcion");
  const [mostrarDialogoReserva, setMostrarDialogoReserva] = useState(false);
  
  // Estados para la reserva
  const [datosReserva, setDatosReserva] = useState({
    vehiculoId: "",
    fecha: "",
    hora: "",
    comentarios: "",
    tipoContacto: "whatsapp"
  });

  const handleSolicitarServicio = () => {
    if (!datosReserva.vehiculoId || !datosReserva.fecha || !datosReserva.hora) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    onSolicitarServicio(service, datosReserva);
    setMostrarDialogoReserva(false);
    toast.success(`Solicitud de servicio enviada a ${service.tallerNombre}`);
  };

  const handleContactarTaller = () => {
    if (service?.whatsapp) {
      const vehiculo = userCars.find(c => c.id === datosReserva.vehiculoId);
      const vehiculoInfo = vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}` : "mi vehículo";
      const mensaje = encodeURIComponent(
        `Hola ${service.tallerNombre}, estoy interesado en el servicio "${service.name}" para ${vehiculoInfo}. ¿Cuándo tienen disponibilidad?`
      );
      window.open(`https://wa.me/${service.whatsapp.replace(/[^0-9]/g, '')}?text=${mensaje}`, '_blank');
      toast.success(`Abriendo WhatsApp para contactar ${service.tallerNombre}`);
    } else {
      toast.error("No hay información de WhatsApp disponible");
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
    serviceReviews.forEach(review => {
      distribucion[review.rating as keyof typeof distribucion]++;
    });
    
    const total = serviceReviews.length;
    return Object.entries(distribucion).map(([stars, count]) => ({
      stars: parseInt(stars),
      count,
      percentage: (count / total) * 100
    })).reverse();
  };

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button variant="outline" onClick={onRegresar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <p className="mt-4">Servicio no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Button variant="ghost" size="sm" onClick={onRegresar} className="p-0 h-auto">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a servicios
        </Button>
        <span>/</span>
        <span className="capitalize">{service.category || "Servicios"}</span>
        <span>/</span>
        <span>{service.tallerNombre}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Imagen e información del taller */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <ImageWithFallback
              src={service.image || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=600&fit=crop"}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Info del taller */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{service.tallerNombre}</p>
                  <p className="text-sm text-muted-foreground">{service.especialidad}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{service.direccion || service.ciudad}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{service.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Lun-Vie: 8:00AM - 6:00PM</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={handleContactarTaller}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contactar Taller
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Información del servicio */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="capitalize">
                {service.category || "Servicio"}
              </Badge>
              {service.isPromoted && <Badge className="bg-blue-100 text-blue-800">Promocionado</Badge>}
              {service.isUrgent && <Badge variant="destructive">Servicio Express</Badge>}
            </div>
            
            <h1 className="text-2xl font-bold mb-4">{service.name}</h1>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {renderStars(service.rating, "md")}
              </div>
              <span className="font-medium">{service.rating}</span>
              <button className="text-sm text-primary hover:underline">
                ({service.reviewCount} reseñas)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${service.price}</span>
                {service.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${service.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{service.duration || "60 min"}</span>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              {service.description || "Servicio profesional realizado por técnicos especializados con equipos de última generación."}
            </p>

            {/* Características del servicio */}
            <div className="space-y-3">
              <h3 className="font-medium">¿Qué incluye este servicio?</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Diagnóstico computarizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Mano de obra especializada</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Garantía de 30 días</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Revisión post-servicio</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de reserva */}
        <div className="lg:col-span-1 xl:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold mb-1">${service.price}</p>
                <p className="text-sm text-muted-foreground">Duración: {service.duration || "60 min"}</p>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <Shield className="h-4 w-4" />
                  <span>Garantía incluida</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Users className="h-4 w-4" />
                  <span>Técnicos certificados</span>
                </div>
                <div className="flex items-center gap-2 text-orange-600">
                  <Wrench className="h-4 w-4" />
                  <span>Herramientas profesionales</span>
                </div>
              </div>

              <Dialog open={mostrarDialogoReserva} onOpenChange={setMostrarDialogoReserva}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Reservar Cita
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reservar Servicio</DialogTitle>
                    <DialogDescription>
                      {service.name} en {service.tallerNombre}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Selecciona tu vehículo *</Label>
                      <Select 
                        value={datosReserva.vehiculoId}
                        onValueChange={(value: any) => setDatosReserva(prev => ({...prev, vehiculoId: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Elige un vehículo" />
                        </SelectTrigger>
                        <SelectContent>
                          {userCars.map((car) => (
                            <SelectItem key={car.id} value={car.id}>
                              {car.marca} {car.modelo} {car.año}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Fecha preferida *</Label>
                        <Input
                          type="date"
                          value={datosReserva.fecha}
                          onChange={(e) => setDatosReserva(prev => ({...prev, fecha: e.target.value}))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label>Hora preferida *</Label>
                        <Select 
                          value={datosReserva.hora}
                          onValueChange={(value: any) => setDatosReserva(prev => ({...prev, hora: value}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Hora" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="08:00">08:00 AM</SelectItem>
                            <SelectItem value="09:00">09:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="14:00">02:00 PM</SelectItem>
                            <SelectItem value="15:00">03:00 PM</SelectItem>
                            <SelectItem value="16:00">04:00 PM</SelectItem>
                            <SelectItem value="17:00">05:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Comentarios adicionales</Label>
                      <Textarea
                        value={datosReserva.comentarios}
                        onChange={(e) => setDatosReserva(prev => ({...prev, comentarios: e.target.value}))}
                        placeholder="Describe el problema o solicitudes especiales..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setMostrarDialogoReserva(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSolicitarServicio}>
                        Enviar Solicitud
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleContactarTaller}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contactar Directo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs de información detallada */}
      <div className="mt-12">
        <Tabs value={tabActiva} onValueChange={setTabActiva}>
          <TabsList>
            <TabsTrigger value="descripcion">Descripción</TabsTrigger>
            <TabsTrigger value="proceso">Proceso</TabsTrigger>
            <TabsTrigger value="reviews">Reseñas ({serviceReviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="descripcion" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Descripción del servicio</h3>
                <div className="prose prose-sm max-w-none">
                  <p>{service.description || "Servicio profesional realizado por técnicos especializados."}</p>
                  <h4>Detalles del proceso:</h4>
                  <ul>
                    <li>Recepción y diagnóstico inicial del vehículo</li>
                    <li>Evaluación detallada del problema</li>
                    <li>Cotización transparente de costos</li>
                    <li>Ejecución del servicio con herramientas especializadas</li>
                    <li>Pruebas de calidad y entrega</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proceso" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">¿Cómo funciona?</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Reserva tu cita</h4>
                      <p className="text-sm text-muted-foreground">Selecciona fecha, hora y vehículo</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Confirmación</h4>
                      <p className="text-sm text-muted-foreground">El taller confirma tu cita y te contacta</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Servicio</h4>
                      <p className="text-sm text-muted-foreground">Lleva tu vehículo en la fecha acordada</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Entrega</h4>
                      <p className="text-sm text-muted-foreground">Recibe tu vehículo listo con garantía</p>
                    </div>
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
                      <div className="text-4xl font-bold mb-2">{service.rating}</div>
                      <div className="flex justify-center mb-2">
                        {renderStars(service.rating, "md")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Basado en {serviceReviews.length} reseñas
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
                {serviceReviews.map((review) => (
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
                              <Badge variant="secondary" className="text-xs">Servicio verificado</Badge>
                            )}
                            <span className="text-sm text-muted-foreground">{review.fecha}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="font-medium">{review.titulo}</span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">{review.comentario}</p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Car className="h-3 w-3" />
                            <span>Vehículo: {review.vehiculo}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <button className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              Útil ({review.util})
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

      {/* Servicios relacionados */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Servicios relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {serviciosRelacionados.map((relacionado) => (
            <Card key={relacionado.id} className="cursor-pointer hover:shadow-md transition-shadow">
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
                  <div className="flex items-center justify-between">
                    <span className="font-bold">${relacionado.price}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{relacionado.duration}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{relacionado.tallerNombre}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}