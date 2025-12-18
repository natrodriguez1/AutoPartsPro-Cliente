import { useEffect, useState } from "react";
import type { Carro, Usuario } from "@/app/types/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { Textarea } from "@/shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  LogOut,
  Shield,
  Package,
  Heart,
  Car,
  Plus,
  Edit,
  Trash2,
  Star,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/shared/ui/switch";
import { ImageWithFallback } from "@/shared/components/ImageWithFallback";
import { updateUser } from "@/features/auth/services/auth.service";
import { useAuth } from "@/app/providers/AuthContext";

type PerfilTab = "personal" | "carros" | "pedidos" | "direcciones" | "configuracion";

interface ProfileTabsProps {
  usuario: Usuario;
  tabActiva: PerfilTab;
  onTabChange: (tab: string) => void;
  onRegresar: () => void;
  onCerrarSesion: () => void;
  actualizarCarros?: (carros: Carro[]) => void;
}

// Mocks (pueden vivir aquí por ahora)
const carrosUsuario: Carro[] = [
  {
    id: "1",
    marca: "Honda",
    modelo: "Civic",
    año: 2020,
    motor: "1.8L",
    combustible: "Gasolina",
    kilometraje: 45000,
    vin: "1HGBH41JXMN109186",
    color: "Negro",
    fechaCompra: "2020-03-15",
  },
  {
    id: "2",
    marca: "Toyota",
    modelo: "Corolla",
    año: 2018,
    motor: "1.6L",
    combustible: "Gasolina",
    kilometraje: 78000,
    vin: "JTDBL40E0790123456",
    color: "Blanco",
    fechaCompra: "2018-07-22",
  },
];

const historialPedidos = [
  {
    id: "PED-001",
    fecha: "2024-11-15",
    estado: "Entregado",
    total: 189.5,
    items: [
      {
        id: "brake_001",
        nombre: "Pastillas de Freno Cerámicas Premium Bosch",
        precio: 89,
        cantidad: 2,
        imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
        taller: "TallerPro Guayaquil",
        reseñaProducto: null as null | { rating: number; comentario: string },
        reseñaTaller: null as null | { rating: number; comentario: string },
      },
    ],
    direccionEnvio: "Av. Amazonas N24-03 y Colón, Quito",
    metodoPago: "Tarjeta **** 4242",
    seguimiento: "Entregado el 18 Nov 2024",
  },
  {
    id: "PED-002",
    fecha: "2024-10-28",
    estado: "Entregado",
    total: 245.0,
    items: [
      {
        id: "engine_001",
        nombre: "Filtro de Aire K&N Performance",
        precio: 45,
        cantidad: 1,
        imagen: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=500&fit=crop",
        taller: "AutoMaster Quito",
        reseñaProducto: { rating: 5, comentario: "Excelente filtro, mejoró notablemente el rendimiento" },
        reseñaTaller: { rating: 5, comentario: "Instalación perfecta y servicio profesional" },
      },
      {
        id: "trans_001",
        nombre: "Kit de Embrague Valeo",
        precio: 200,
        cantidad: 1,
        imagen: "https://images.unsplash.com/photo-1559992290-8b72b62aeca8?w=400&h=500&fit=crop",
        taller: "AutoMaster Quito",
        reseñaProducto: null,
        reseñaTaller: null,
      },
    ],
    direccionEnvio: "Av. Amazonas N24-03 y Colón, Quito",
    metodoPago: "Transferencia Bancaria",
    seguimiento: "Entregado el 30 Oct 2024",
  },
  {
    id: "PED-003",
    fecha: "2024-09-12",
    estado: "Entregado",
    total: 320.0,
    items: [
      {
        id: "tire_001",
        nombre: "Neumáticos Urbanos Bridgestone 205/55R16",
        precio: 285,
        cantidad: 1,
        imagen: "https://images.unsplash.com/photo-1449667585940-75d7cfeae11b?w=400&h=500&fit=crop",
        taller: "TallerPro Guayaquil",
        reseñaProducto: { rating: 4, comentario: "Buenos neumáticos, duran bastante" },
        reseñaTaller: { rating: 4, comentario: "Buen servicio aunque tardaron un poco más de lo esperado" },
      },
    ],
    direccionEnvio: "Av. Francisco de Orellana, Guayaquil",
    metodoPago: "Efectivo",
    seguimiento: "Entregado el 15 Sep 2024",
  },
];

export function ProfileTabs({
  usuario,
  tabActiva,
  onTabChange,
  onRegresar,
  onCerrarSesion,
  actualizarCarros,
}: ProfileTabsProps) {
  // Perfil
  const [editando, setEditando] = useState(false);
  const [nombres, setNombres] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("Av. Amazonas N24-03 y Colón, Quito");

  const { iniciarSesion } = useAuth();
  const [saving, setSaving] = useState(false);

  // Carros
  const [carros, setCarros] = useState<Carro[]>(usuario.carros ?? carrosUsuario);
  const [mostrarDialogoAgregarCarro, setMostrarDialogoAgregarCarro] = useState(false);
  const [, setCarroEditando] = useState<any>(null);

  const [nuevoCarro, setNuevoCarro] = useState<Omit<Carro, "id">>({
    marca: "",
    modelo: "",
    año: new Date().getFullYear(),
    motor: "",
    combustible: "Gasolina",
    kilometraje: 0,
    vin: "",
    color: "",
    fechaCompra: "",
  });

  // Reseñas
  const [mostrarDialogoReseña, setMostrarDialogoReseña] = useState(false);
  const [reseñaActual, setReseñaActual] = useState<any>(null);
  const [nuevaReseña, setNuevaReseña] = useState({
    rating: 5,
    comentario: "",
    tipo: "producto" as "producto" | "taller",
  });

  // Config
  const [notificacionesEmail, setNotificacionesEmail] = useState(true);
  const [notificacionesPush, setNotificacionesPush] = useState(true);
  const [newsletterMarketing, setNewsletterMarketing] = useState(false);

  // Inicializar campos desde usuario (cuando cambia)
  useEffect(() => {
    const nom = usuario.tipo === "usuario" ? (usuario.nombres ?? "") : (usuario.nombre ?? "");
    setNombres(nom);
    setEmail(usuario.email ?? "");
    setTelefono(usuario.tipo === "usuario" ? (usuario.telefono ?? "") : "");
    setCarros(usuario.carros ?? carrosUsuario);
  }, [usuario]);

  const handleGuardarCambios = async () => {
    const idNum = Number(usuario.id);
    if (!Number.isFinite(idNum)) {
      toast.error("No se pudo actualizar: id inválido.");
      return;
    }

    const roleId = usuario.tipo === "admin" ? 1 : usuario.tipo === "taller" ? 3 : 2;

    setSaving(true);
    try {
      const updated = await updateUser(idNum, {
        name: nombres,
        email,
        phone: telefono,
        role_id: roleId, // opcional si tu backend lo deja opcional
      });

      // Actualiza el usuario en sesión (reutiliza lo que ya tienes)
      iniciarSesion(updated, { remember: true });

      toast.success("Perfil actualizado correctamente");
      setEditando(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleAgregarCarro = () => {
    if (!nuevoCarro.marca || !nuevoCarro.modelo || !nuevoCarro.año) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    const carro: Carro = { id: Date.now().toString(), ...nuevoCarro };
    const nuevosCarros = [...carros, carro];
    setCarros(nuevosCarros);
    actualizarCarros?.(nuevosCarros);

    setNuevoCarro({
      marca: "",
      modelo: "",
      año: new Date().getFullYear(),
      motor: "",
      combustible: "Gasolina",
      kilometraje: 0,
      vin: "",
      color: "",
      fechaCompra: "",
    });

    setMostrarDialogoAgregarCarro(false);
    toast.success("Vehículo agregado exitosamente");
  };

  const handleEliminarCarro = (id: string) => {
    const nuevosCarros = carros.filter((c) => c.id !== id);
    setCarros(nuevosCarros);
    actualizarCarros?.(nuevosCarros);
    toast.success("Vehículo eliminado");
  };

  const handleAbrirReseña = (pedidoId: string, itemId: string, tipo: "producto" | "taller") => {
    const pedido = historialPedidos.find((p) => p.id === pedidoId);
    const item = pedido?.items.find((i) => i.id === itemId);

    if (item) {
      const reseñaExistente = tipo === "producto" ? item.reseñaProducto : item.reseñaTaller;
      if (reseñaExistente) {
        toast.info("Ya has reseñado este " + tipo);
        return;
      }

      setReseñaActual({ pedidoId, itemId, item, tipo });
      setNuevaReseña({ rating: 5, comentario: "", tipo });
      setMostrarDialogoReseña(true);
    }
  };

  const handleGuardarReseña = () => {
    if (!nuevaReseña.comentario.trim()) {
      toast.error("Por favor escribe un comentario");
      return;
    }
    toast.success(`Reseña de ${nuevaReseña.tipo} guardada exitosamente`);
    setMostrarDialogoReseña(false);
    setReseñaActual(null);
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, idx) => {
        const i = idx + 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => interactive && onChange?.(i)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            disabled={!interactive}
          >
            <Star className={`h-4 w-4 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
          </button>
        );
      })}
    </div>
  );

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Entregado":
        return <Badge className="bg-green-100 text-green-800">Entregado</Badge>;
      case "En tránsito":
        return <Badge className="bg-blue-100 text-blue-800">En tránsito</Badge>;
      case "Procesando":
        return <Badge className="bg-yellow-100 text-yellow-800">Procesando</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onRegresar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1>Mi Perfil</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          <Tabs value={tabActiva} onValueChange={onTabChange} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="carros">Mis Carros</TabsTrigger>
              <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
              <TabsTrigger value="direcciones">Direcciones</TabsTrigger>
              <TabsTrigger value="configuracion">Config</TabsTrigger>
            </TabsList>

            {/* PERSONAL */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Información Personal</CardTitle>
                      <CardDescription>Administra tu información personal y de contacto</CardDescription>
                    </div>
                    <Button
                      variant={editando ? "default" : "outline"}
                      disabled={saving}
                      onClick={() => (editando ? handleGuardarCambios() : setEditando(true))}
                    >
                      {editando ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? "Guardando..." : "Guardar"}
                        </>
                      ) : (
                        "Editar"
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombres">Nombres completos</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="nombres"
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        disabled={!editando}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!editando}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        disabled={!editando}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección principal</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="direccion"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        disabled={!editando}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CARROS */}
            <TabsContent value="carros">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        Mis Vehículos
                      </CardTitle>
                      <CardDescription>Administra tus vehículos para recomendaciones personalizadas</CardDescription>
                    </div>
                    <Button onClick={() => setMostrarDialogoAgregarCarro(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Carro
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {carros.length === 0 ? (
                    <div className="text-center py-8">
                      <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-medium mb-2">No tienes vehículos registrados</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Agrega tus vehículos para recibir recomendaciones personalizadas
                      </p>
                      <Button onClick={() => setMostrarDialogoAgregarCarro(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar mi primer carro
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {carros.map((carro) => (
                        <div key={carro.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                              <div>
                                <p className="text-sm text-muted-foreground">Vehículo</p>
                                <p className="font-medium">{carro.marca} {carro.modelo}</p>
                                <p className="text-sm text-muted-foreground">{carro.año}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Motor</p>
                                <p className="font-medium">{carro.motor}</p>
                                <p className="text-sm text-muted-foreground">{carro.combustible}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Kilometraje</p>
                                <p className="font-medium">{carro.kilometraje?.toLocaleString() || 0} km</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Color</p>
                                <p className="font-medium">{carro.color}</p>
                              </div>
                            </div>

                            <div className="flex gap-2 ml-4">
                              <Button variant="ghost" size="sm" onClick={() => setCarroEditando(carro)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleEliminarCarro(carro.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* PEDIDOS */}
            <TabsContent value="pedidos">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Historial de Pedidos (Últimos 3 meses)
                  </CardTitle>
                  <CardDescription>Revisa tus compras recientes y deja reseñas</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {historialPedidos.map((pedido) => (
                    <div key={pedido.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">Pedido #{pedido.id}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {new Date(pedido.fecha).toLocaleDateString("es-EC", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                            {getEstadoBadge(pedido.estado)}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg">${pedido.total}</p>
                          <p className="text-sm text-muted-foreground">{pedido.metodoPago}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {pedido.items.map((item) => (
                          <div key={item.id} className="flex gap-4 p-3 bg-muted/50 rounded">
                            <div className="w-16 h-16 flex-shrink-0">
                              <ImageWithFallback src={item.imagen} alt={item.nombre} className="w-full h-full object-cover rounded" />
                            </div>

                            <div className="flex-1">
                              <h5 className="font-medium line-clamp-2">{item.nombre}</h5>
                              <p className="text-sm text-muted-foreground">Vendido por: {item.taller}</p>
                              <p className="text-sm text-muted-foreground">
                                Cantidad: {item.cantidad} × ${item.precio} = ${(item.cantidad * item.precio).toFixed(2)}
                              </p>
                            </div>

                            <div className="flex flex-col gap-2">
                              {item.reseñaProducto ? (
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">Producto reseñado</p>
                                  {renderStars(item.reseñaProducto.rating)}
                                </div>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => handleAbrirReseña(pedido.id, item.id, "producto")}>
                                  <Star className="h-3 w-3 mr-1" />
                                  Reseñar Producto
                                </Button>
                              )}

                              {item.reseñaTaller ? (
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">Taller reseñado</p>
                                  {renderStars(item.reseñaTaller.rating)}
                                </div>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => handleAbrirReseña(pedido.id, item.id, "taller")}>
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Reseñar Taller
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      <div className="text-sm text-muted-foreground">
                        <p><strong>Dirección:</strong> {pedido.direccionEnvio}</p>
                        <p><strong>Seguimiento:</strong> {pedido.seguimiento}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* DIRECCIONES */}
            <TabsContent value="direcciones">
              <Card>
                <CardHeader>
                  <CardTitle>Direcciones de Envío</CardTitle>
                  <CardDescription>Administra tus direcciones para envíos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Casa</p>
                        <p className="text-sm text-muted-foreground">Av. Amazonas N24-03 y Colón</p>
                        <p className="text-sm text-muted-foreground">Quito, Pichincha, Ecuador</p>
                        <p className="text-sm text-muted-foreground">+593 99 123 4567</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">Eliminar</Button>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Agregar Nueva Dirección
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CONFIG */}
            <TabsContent value="configuracion">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración</CardTitle>
                  <CardDescription>Administra tus preferencias y notificaciones</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Notificaciones</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Notificaciones por email</p>
                          <p className="text-sm text-muted-foreground">Confirmaciones de pedidos y ofertas</p>
                        </div>
                        <Switch checked={notificacionesEmail} onCheckedChange={setNotificacionesEmail} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Notificaciones push</p>
                          <p className="text-sm text-muted-foreground">Alertas en tiempo real</p>
                        </div>
                        <Switch checked={notificacionesPush} onCheckedChange={setNotificacionesPush} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Newsletter y promociones</p>
                          <p className="text-sm text-muted-foreground">Ofertas exclusivas y novedades</p>
                        </div>
                        <Switch checked={newsletterMarketing} onCheckedChange={setNewsletterMarketing} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-4">Seguridad</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Cambiar Contraseña
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Autenticación de Dos Factores
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel lateral */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full p-2" />
                <div>
                  <p className="text-sm font-medium">{historialPedidos.length} pedidos</p>
                  <p className="text-xs text-muted-foreground">Últimos 3 meses</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Heart className="h-8 w-8 bg-red-100 text-red-600 rounded-full p-2" />
                <div>
                  <p className="text-sm font-medium">12 favoritos</p>
                  <p className="text-xs text-muted-foreground">Productos guardados</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Car className="h-8 w-8 bg-green-100 text-green-600 rounded-full p-2" />
                <div>
                  <p className="text-sm font-medium">{carros.length} vehículos</p>
                  <p className="text-xs text-muted-foreground">Registrados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => onTabChange("pedidos")}>
                <Package className="h-4 w-4 mr-2" />
                Mis Pedidos
              </Button>

              <Button variant="outline" className="w-full justify-start" onClick={() => onTabChange("carros")}>
                <Car className="h-4 w-4 mr-2" />
                Mis Vehículos
              </Button>

              <Button variant="outline" className="w-full justify-start" onClick={() => onTabChange("direcciones")}>
                <MapPin className="h-4 w-4 mr-2" />
                Direcciones
              </Button>

              <Separator />

              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={onCerrarSesion}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog para agregar carro */}
      <Dialog open={mostrarDialogoAgregarCarro} onOpenChange={setMostrarDialogoAgregarCarro}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar Vehículo</DialogTitle>
            <DialogDescription>Agrega un vehículo para recibir recomendaciones personalizadas</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Marca *</Label>
                <Input
                  value={nuevoCarro.marca}
                  onChange={(e) => setNuevoCarro((p) => ({ ...p, marca: e.target.value }))}
                  placeholder="Honda, Toyota, etc."
                />
              </div>

              <div>
                <Label>Modelo *</Label>
                <Input
                  value={nuevoCarro.modelo}
                  onChange={(e) => setNuevoCarro((p) => ({ ...p, modelo: e.target.value }))}
                  placeholder="Civic, Corolla, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Año *</Label>
                <Input
                  type="number"
                  value={nuevoCarro.año}
                  onChange={(e) => setNuevoCarro((p) => ({ ...p, año: parseInt(e.target.value) }))}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <Label>Motor</Label>
                <Input
                  value={nuevoCarro.motor}
                  onChange={(e) => setNuevoCarro((p) => ({ ...p, motor: e.target.value }))}
                  placeholder="1.8L, 2.0L, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Combustible</Label>
                <Select
                  value={nuevoCarro.combustible}
                  onValueChange={(value: any) => setNuevoCarro((p) => ({ ...p, combustible: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasolina">Gasolina</SelectItem>
                    <SelectItem value="Diésel">Diésel</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                    <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Kilometraje</Label>
                <Input
                  type="number"
                  value={nuevoCarro.kilometraje === 0 ? "" : nuevoCarro.kilometraje}
                  onChange={(e) => {
                    const v = e.target.value;
                    setNuevoCarro((p) => ({ ...p, kilometraje: v === "" ? 0 : parseInt(v) || 0 }));
                  }}
                  placeholder="Ingresa el kilometraje"
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label>Color</Label>
              <Input
                value={nuevoCarro.color}
                onChange={(e) => setNuevoCarro((p) => ({ ...p, color: e.target.value }))}
                placeholder="Negro, Blanco, Rojo, etc."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMostrarDialogoAgregarCarro(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAgregarCarro}>Agregar Vehículo</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para reseñas */}
      <Dialog open={mostrarDialogoReseña} onOpenChange={setMostrarDialogoReseña}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reseñar {nuevaReseña.tipo === "producto" ? "Producto" : "Taller"}</DialogTitle>
            <DialogDescription>
              {reseñaActual && (
                <>
                  {nuevaReseña.tipo === "producto" ? "Producto: " : "Taller: "}
                  {nuevaReseña.tipo === "producto" ? reseñaActual.item?.nombre : reseñaActual.item?.taller}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Calificación</Label>
              <div className="flex items-center gap-2 mt-2">
                {renderStars(nuevaReseña.rating, true, (rating) => setNuevaReseña((p) => ({ ...p, rating })))}
                <span className="text-sm text-muted-foreground ml-2">{nuevaReseña.rating}/5 estrellas</span>
              </div>
            </div>

            <div>
              <Label>Comentario</Label>
              <Textarea
                value={nuevaReseña.comentario}
                onChange={(e) => setNuevaReseña((p) => ({ ...p, comentario: e.target.value }))}
                placeholder={`Cuéntanos sobre tu experiencia con este ${nuevaReseña.tipo}...`}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMostrarDialogoReseña(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarReseña}>Publicar Reseña</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
