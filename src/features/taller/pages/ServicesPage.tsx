import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Textarea } from "@/shared/ui/textarea";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Wrench, 
  Clock, 
  TrendingUp, 
  Edit, 
  Trash2,
  Eye,
  Download,
  Upload,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ServiciosTallerProps {
  onRegresar: () => void;
  onCambiarVista: (vista: string) => void;
}

// Mock data para servicios
const serviciosItems = [
  {
    id: "srv_001",
    codigo: "SRV-FRE-001",
    nombre: "Cambio de Pastillas de Freno",
    categoria: "frenos",
    descripcion: "Cambio completo de pastillas de freno delanteras y traseras, incluye inspección del sistema de frenado",
    duracionEstimada: 90, // en minutos
    precio: 120,
    disponible: true,
    requiereRepuestos: true,
    especialidad: "Mecánica General",
    garantia: "6 meses",
    ultimaActualizacion: "2024-01-20",
    serviciosRealizados: 15,
    calificacionPromedio: 4.8,
    estado: "activo"
  },
  {
    id: "srv_002",
    codigo: "SRV-MOT-002",
    nombre: "Cambio de Aceite y Filtros",
    categoria: "motor",
    descripcion: "Cambio de aceite del motor, filtro de aceite y filtro de aire. Incluye revisión de niveles de fluidos",
    duracionEstimada: 45,
    precio: 65,
    disponible: true,
    requiereRepuestos: true,
    especialidad: "Mantenimiento",
    garantia: "3 meses",
    ultimaActualizacion: "2024-01-22",
    serviciosRealizados: 42,
    calificacionPromedio: 4.9,
    estado: "activo"
  },
  {
    id: "srv_003",
    codigo: "SRV-NEU-003",
    nombre: "Balanceado y Alineación",
    categoria: "neumaticos",
    descripcion: "Balanceado de neumáticos y alineación de dirección para mejorar el manejo y durabilidad",
    duracionEstimada: 60,
    precio: 45,
    disponible: true,
    requiereRepuestos: false,
    especialidad: "Neumáticos",
    garantia: "1 mes",
    ultimaActualizacion: "2024-01-19",
    serviciosRealizados: 28,
    calificacionPromedio: 4.6,
    estado: "activo"
  },
  {
    id: "srv_004",
    codigo: "SRV-ELE-004",
    nombre: "Diagnóstico Eléctrico",
    categoria: "electrico",
    descripcion: "Diagnóstico completo del sistema eléctrico del vehículo usando equipos especializados",
    duracionEstimada: 120,
    precio: 80,
    disponible: false,
    requiereRepuestos: false,
    especialidad: "Electrónica Automotriz",
    garantia: "Sin garantía (diagnóstico)",
    ultimaActualizacion: "2024-01-18",
    serviciosRealizados: 8,
    calificacionPromedio: 4.7,
    estado: "inactivo"
  },
  {
    id: "srv_005",
    codigo: "SRV-SUS-005",
    nombre: "Reparación de Suspensión",
    categoria: "suspension",
    descripcion: "Reparación y reemplazo de componentes de suspensión incluyendo amortiguadores y resortes",
    duracionEstimada: 180,
    precio: 280,
    disponible: true,
    requiereRepuestos: true,
    especialidad: "Suspensión",
    garantia: "12 meses",
    ultimaActualizacion: "2024-01-21",
    serviciosRealizados: 12,
    calificacionPromedio: 4.5,
    estado: "activo"
  }
];

const historialServicios = [
  {
    id: "hist_001",
    fecha: "2024-01-23",
    servicio: "Cambio de Aceite y Filtros",
    cliente: "Carlos Mendoza",
    vehiculo: "Toyota Corolla 2020",
    estado: "completado",
    precio: 65,
    calificacion: 5
  },
  {
    id: "hist_002",
    fecha: "2024-01-22",
    servicio: "Cambio de Pastillas de Freno",
    cliente: "María González",
    vehiculo: "Honda Civic 2019",
    estado: "en_proceso",
    precio: 120,
    calificacion: null
  },
  {
    id: "hist_003",
    fecha: "2024-01-21",
    servicio: "Balanceado y Alineación",
    cliente: "Pedro Silva",
    vehiculo: "Chevrolet Sail 2021",
    estado: "completado",
    precio: 45,
    calificacion: 4
  },
  {
    id: "hist_004",
    fecha: "2024-01-20",
    servicio: "Reparación de Suspensión",
    cliente: "Ana López",
    vehiculo: "Ford Focus 2018",
    estado: "pendiente",
    precio: 280,
    calificacion: null
  }
];

export function ServiciosTaller({ onRegresar, onCambiarVista }: ServiciosTallerProps) {
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");
  const [mostrarDialogoEdicion, setMostrarDialogoEdicion] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);
  const [edicionServicio, setEdicionServicio] = useState({
    precio: "",
    disponible: true,
    descripcion: ""
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return <Badge className="bg-green-500 text-white">Activo</Badge>;
      case "inactivo":
        return <Badge variant="secondary">Inactivo</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getEstadoServicioBadge = (estado: string) => {
    switch (estado) {
      case "completado":
        return <Badge className="bg-green-500 text-white">Completado</Badge>;
      case "en_proceso":
        return <Badge className="bg-blue-500 text-white">En Proceso</Badge>;
      case "pendiente":
        return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>;
      case "cancelado":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const handleEditarServicio = () => {
    if (!servicioSeleccionado || !edicionServicio.precio) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    toast.success(`Servicio ${servicioSeleccionado.nombre} actualizado correctamente`);
    setMostrarDialogoEdicion(false);
    setEdicionServicio({ precio: "", disponible: true, descripcion: "" });
    setServicioSeleccionado(null);
  };

  const serviciosFiltrados = serviciosItems.filter(servicio => {
    const coincideBusqueda = servicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            servicio.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            servicio.categoria.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideCategoria = filtroCategoria === "todos" || servicio.categoria === filtroCategoria;
    const coincideEstado = filtroEstado === "todos" || servicio.estado === filtroEstado;
    
    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  const serviciosActivos = serviciosItems.filter(servicio => servicio.estado === "activo");
  const ingresosTotales = historialServicios.filter(h => h.estado === "completado").reduce((total, h) => total + h.precio, 0);
  const serviciosCompletados = historialServicios.filter(h => h.estado === "completado").length;
  const calificacionPromedio = serviciosItems.reduce((acc, s) => acc + s.calificacionPromedio, 0) / serviciosItems.length;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onRegresar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Regresar al Panel
          </Button>
          <div>
            <h1 className="flex items-center gap-2">
              <Wrench className="h-6 w-6" />
              Gestión de Servicios
            </h1>
            <p className="text-muted-foreground">Administra tu catálogo de servicios y seguimiento</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onCambiarVista("registro-servicios")}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Wrench className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Servicios Activos</p>
                <p className="text-2xl font-bold">{serviciosActivos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completados (Mes)</p>
                <p className="text-2xl font-bold">{serviciosCompletados}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Ingresos (Mes)</p>
                <p className="text-2xl font-bold">${ingresosTotales.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Calificación Promedio</p>
                <p className="text-2xl font-bold">{calificacionPromedio.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="servicios" className="space-y-6">
        <TabsList>
          <TabsTrigger value="servicios">Catálogo de Servicios</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="servicios">
          {/* Filtros y búsqueda */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre, código o categoría..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las categorías</SelectItem>
                    <SelectItem value="frenos">Frenos</SelectItem>
                    <SelectItem value="motor">Motor</SelectItem>
                    <SelectItem value="neumaticos">Neumáticos</SelectItem>
                    <SelectItem value="electrico">Eléctrico</SelectItem>
                    <SelectItem value="suspension">Suspensión</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de servicios */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Realizados</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviciosFiltrados.map((servicio) => (
                    <TableRow key={servicio.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{servicio.nombre}</p>
                          <p className="text-sm text-muted-foreground">{servicio.especialidad}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{servicio.codigo}</TableCell>
                      <TableCell className="capitalize">{servicio.categoria}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {servicio.duracionEstimada} min
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">${servicio.precio}</TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-bold">{servicio.serviciosRealizados}</p>
                          <p className="text-xs text-muted-foreground">
                            ★ {servicio.calificacionPromedio}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoBadge(servicio.estado)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setServicioSeleccionado(servicio);
                              setEdicionServicio({
                                precio: servicio.precio.toString(),
                                disponible: servicio.disponible,
                                descripcion: servicio.descripcion
                              });
                              setMostrarDialogoEdicion(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Calificación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historialServicios.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell>{registro.fecha}</TableCell>
                      <TableCell>{registro.servicio}</TableCell>
                      <TableCell>{registro.cliente}</TableCell>
                      <TableCell>{registro.vehiculo}</TableCell>
                      <TableCell>{getEstadoServicioBadge(registro.estado)}</TableCell>
                      <TableCell className="font-bold">${registro.precio}</TableCell>
                      <TableCell>
                        {registro.calificacion ? (
                          <span className="flex items-center gap-1">
                            ★ {registro.calificacion}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Sin calificar</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reportes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Servicios Más Solicitados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Reportes de servicios más solicitados próximamente...</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Rentabilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Análisis detallado de rentabilidad por servicio próximamente...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para edición de servicio */}
      <Dialog open={mostrarDialogoEdicion} onOpenChange={setMostrarDialogoEdicion}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
            <DialogDescription>
              {servicioSeleccionado?.nombre}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Precio</Label>
              <Input
                type="number"
                value={edicionServicio.precio}
                onChange={(e) => setEdicionServicio(prev => ({...prev, precio: e.target.value}))}
                placeholder="Precio del servicio"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={edicionServicio.descripcion}
                onChange={(e) => setEdicionServicio(prev => ({...prev, descripcion: e.target.value}))}
                placeholder="Descripción detallada del servicio"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="disponible"
                checked={edicionServicio.disponible}
                onChange={(e) => setEdicionServicio(prev => ({...prev, disponible: e.target.checked}))}
              />
              <Label htmlFor="disponible">Servicio disponible</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMostrarDialogoEdicion(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditarServicio}>
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}