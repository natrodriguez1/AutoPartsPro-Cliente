import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Progress } from "@/shared/ui/progress";
import { 
  MessageCircle, 
  Send, 
  Search, 
  Filter,
  MapPin,
  Star,
  Package,
  ArrowLeft,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Truck
} from "lucide-react";
import { toast } from "sonner@2.0.3";

const talleresCercanos = [
  {
    id: "1",
    nombre: "AutoMaster Quito",
    distancia: "2.3 km",
    rating: 4.8,
    especialidad: "Motor y Transmisión",
    telefono: "+593 2 245-6789",
    email: "automaster@email.com",
    inventario: ["Pastillas de freno", "Filtros de aceite", "Bujías", "Correas"]
  },
  {
    id: "2",
    nombre: "TallerPro Guayaquil",
    distancia: "3.1 km",
    rating: 4.6,
    especialidad: "Sistema de Frenos",
    telefono: "+593 4 289-3456",
    email: "tallerpro@email.com",
    inventario: ["Discos de freno", "Líquido de frenos", "Mangueras", "Cilindros"]
  },
  {
    id: "3",
    nombre: "MecánicaTotal Cuenca",
    distancia: "4.5 km",
    rating: 4.7,
    especialidad: "Suspensión y Dirección",
    telefono: "+593 7 405-7890",
    email: "mecanicatotal@email.com",
    inventario: ["Amortiguadores", "Resortes", "Rótulas", "Terminales"]
  }
];

const intercambiosEjemplo = [
  {
    id: "1",
    taller: "AutoMaster Quito",
    piezaSolicitada: "Pastillas de freno Honda Civic",
    piezaOfrecida: "Filtro de aceite Mobil 1",
    estado: "pendiente",
    fecha: "Hace 2 horas",
    direccion: "recibe",
    progreso: 25,
    proximoPaso: "Esperando respuesta del taller"
  },
  {
    id: "2",
    taller: "TallerPro Guayaquil",
    piezaSolicitada: "Amortiguador delantero",
    piezaOfrecida: "Kit de pastillas cerámicas",
    estado: "en_proceso",
    fecha: "Hace 1 día",
    direccion: "envia",
    progreso: 60,
    proximoPaso: "Preparando paquete para envío"
  },
  {
    id: "3",
    taller: "MecánicaTotal Cuenca",
    piezaSolicitada: "Bomba de gasolina",
    piezaOfrecida: "Radiador universal",
    estado: "completado",
    fecha: "Hace 3 días",
    direccion: "recibe",
    progreso: 100,
    proximoPaso: "Intercambio completado"
  },
  {
    id: "4",
    taller: "AutoExpress",
    piezaSolicitada: "Batería 12V",
    piezaOfrecida: "Alternador remanufacturado",
    estado: "rechazado",
    fecha: "Hace 5 días",
    direccion: "envia",
    progreso: 0,
    proximoPaso: "Solicitud rechazada"
  }
];

interface IntercambioTalleresProps {
  onRegresar: () => void;
}

export function IntercambioTalleres({ onRegresar }: IntercambioTalleresProps) {
  const [vistaActual, setVistaActual] = useState<"lista" | "crear" | "detalles">("lista");
  const [intercambioSeleccionado, setIntercambioSeleccionado] = useState<any>(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  // Estados para nuevo intercambio
  const [tallerDestino, setTallerDestino] = useState("");
  const [piezaNecesaria, setPiezaNecesaria] = useState("");
  const [piezaOfrecida, setPiezaOfrecida] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const getIconoEstado = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "en_proceso":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "completado":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rechazado":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "en_proceso":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completado":
        return "bg-green-100 text-green-800 border-green-200";
      case "rechazado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getIconoDireccion = (direccion: string) => {
    if (direccion === "envia") {
      return <ArrowRight className="h-4 w-4 text-blue-500" />;
    } else {
      return <ArrowLeft className="h-4 w-4 text-green-500" />;
    }
  };

  const handleCrearIntercambio = () => {
    if (!tallerDestino || !piezaNecesaria || !piezaOfrecida) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }
    
    toast.success("Solicitud de intercambio creada correctamente");
    setVistaActual("lista");
    // Reset form
    setTallerDestino("");
    setPiezaNecesaria("");
    setPiezaOfrecida("");
    setDescripcion("");
  };

  const intercambiosFiltrados = intercambiosEjemplo.filter(intercambio => {
    const coincideBusqueda = intercambio.taller.toLowerCase().includes(busqueda.toLowerCase()) ||
      intercambio.piezaSolicitada.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === "todos" || intercambio.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  if (vistaActual === "crear") {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setVistaActual("lista")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1>Crear Nuevo Intercambio</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Nueva Solicitud de Intercambio
            </CardTitle>
            <CardDescription>
              Solicita un repuesto a cambio de otro que tengas disponible
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="taller-destino">Taller destinatario *</Label>
              <Select value={tallerDestino} onValueChange={setTallerDestino}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un taller" />
                </SelectTrigger>
                <SelectContent>
                  {talleresCercanos.map((taller) => (
                    <SelectItem key={taller.id} value={taller.id}>
                      {taller.nombre} - {taller.especialidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pieza-necesaria">Repuesto que necesitas *</Label>
                <Input
                  id="pieza-necesaria"
                  placeholder="Ej: Pastillas de freno Honda Civic 2018"
                  value={piezaNecesaria}
                  onChange={(e) => setPiezaNecesaria(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pieza-ofrecida">Repuesto que ofreces *</Label>
                <Input
                  id="pieza-ofrecida"
                  placeholder="Ej: Filtro de aceite Mobil 1"
                  value={piezaOfrecida}
                  onChange={(e) => setPiezaOfrecida(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Detalles adicionales</Label>
              <Textarea
                id="descripcion"
                placeholder="Agrega información sobre el estado, marca, compatibilidad, etc."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Vista previa del intercambio:</h4>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <span>{piezaOfrecida || "Tu repuesto"}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-500" />
                  <span>{piezaNecesaria || "Repuesto solicitado"}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCrearIntercambio} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Crear Solicitud
              </Button>
              <Button variant="outline" onClick={() => setVistaActual("lista")}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onRegresar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1>Intercambio de Repuestos</h1>
            <p className="text-muted-foreground">
              Gestiona tus intercambios con otros talleres
            </p>
          </div>
        </div>
        <Button onClick={() => setVistaActual("crear")}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Intercambio
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por taller o repuesto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_proceso">En Proceso</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de intercambios */}
      <div className="space-y-4">
        {intercambiosFiltrados.map((intercambio) => (
          <Card key={intercambio.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      {getIconoEstado(intercambio.estado)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getColorEstado(intercambio.estado)}`}>
                        {intercambio.estado.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getIconoDireccion(intercambio.direccion)}
                      <span>{intercambio.direccion === "envia" ? "Enviando" : "Recibiendo"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Con: {intercambio.taller}</p>
                      <p className="text-sm text-muted-foreground">{intercambio.fecha}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span>Ofreces: {intercambio.piezaOfrecida}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-green-500" />
                        <span>Solicitas: {intercambio.piezaSolicitada}</span>
                      </div>
                    </div>
                  </div>

                  {intercambio.estado !== "rechazado" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso:</span>
                        <span>{intercambio.progreso}%</span>
                      </div>
                      <Progress value={intercambio.progreso} className="h-2" />
                      <p className="text-xs text-muted-foreground">{intercambio.proximoPaso}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {intercambiosFiltrados.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No hay intercambios</h3>
            <p className="text-muted-foreground mb-4">
              {busqueda || (filtroEstado !== "todos")
                ? "No se encontraron intercambios que coincidan con tu búsqueda"
                : "Aún no has creado ningún intercambio"}
            </p>
            <Button onClick={() => setVistaActual("crear")}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Intercambio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}