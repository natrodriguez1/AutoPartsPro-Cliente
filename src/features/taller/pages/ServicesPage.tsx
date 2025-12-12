import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import type { WorkshopService } from "../types/service";
import type { ServiceHistory } from "../types/service";

//TODO: llamada a items de tipo service
const services: WorkshopService[] = [
  {
    id: "srv_001",
    code: "SRV-FRE-001",
    name: "Cambio de Pastillas de Freno",
    category: "frenos",
    description: "Cambio completo de pastillas de freno delanteras y traseras, incluye inspección del sistema de frenado",
    estimatedDurationMinutes: 90, // en minutos
    price: 120,
    isAvailable: true,
    requiresParts: true,
    specialty: "Mecánica General",
    warranty: "6 meses",
    lastUpdatedAt: "2024-01-20",
    completedServicesCount: 15,
    averageRating: 4.8,
    status: "activo"
  },
  {
    id: "srv_002",
    code: "SRV-MOT-002",
    name: "Cambio de Aceite y Filtros",
    category: "motor",
    description: "Cambio de aceite del motor, filtro de aceite y filtro de aire. Incluye revisión de niveles de fluidos",
    estimatedDurationMinutes: 45,
    price: 65,
    isAvailable: true,
    requiresParts: true,
    specialty: "Mantenimiento",
    warranty: "3 meses",
    lastUpdatedAt: "2024-01-22",
    completedServicesCount: 42,
    averageRating: 4.9,
    status: "activo"
  },
  {
    id: "srv_003",
    code: "SRV-NEU-003",
    name: "Balanceado y Alineación",
    category: "neumaticos",
    description: "Balanceado de neumáticos y alineación de dirección para mejorar el manejo y durabilidad",
    estimatedDurationMinutes: 60,
    price: 45,
    isAvailable: true,
    requiresParts: false,
    specialty: "Neumáticos",
    warranty: "1 mes",
    lastUpdatedAt: "2024-01-19",
    completedServicesCount: 28,
    averageRating: 4.6,
    status: "activo"
  },
  {
    id: "srv_004",
    code: "SRV-ELE-004",
    name: "Diagnóstico Eléctrico",
    category: "electrico",
    description: "Diagnóstico completo del sistema eléctrico del vehículo usando equipos especializados",
    estimatedDurationMinutes: 120,
    price: 80,
    isAvailable: false,
    requiresParts: false,
    specialty: "Electrónica Automotriz",
    warranty: "Sin garantía (diagnóstico)",
    lastUpdatedAt: "2024-01-18",
    completedServicesCount: 8,
    averageRating: 4.7,
    status: "inactivo"
  },
  {
    id: "srv_005",
    code: "SRV-SUS-005",
    name: "Reparación de Suspensión",
    category: "suspension",
    description: "Reparación y reemplazo de componentes de suspensión incluyendo amortiguadores y resortes",
    estimatedDurationMinutes: 180,
    price: 280,
    isAvailable: true,
    requiresParts: true,
    specialty: "Suspensión",
    warranty: "12 meses",
    lastUpdatedAt: "2024-01-21",
    completedServicesCount: 12,
    averageRating: 4.5,
    status: "activo"
  }
];
//TODO: llamada al historial de services vendidos
const serviceHistory: ServiceHistory[] = [
  {
    id: "hist_001",
    date: "2024-01-23",
    service: "Cambio de Aceite y Filtros",
    customer: "Carlos Mendoza",
    vehicle: "Toyota Corolla 2020",
    status: "completado",
    price: 65,
    rating: 5
  },
  {
    id: "hist_002",
    date: "2024-01-22",
    service: "Cambio de Pastillas de Freno",
    customer: "María González",
    vehicle: "Honda Civic 2019",
    status: "en_proceso",
    price: 120,
    rating: null
  },
  {
    id: "hist_003",
    date: "2024-01-21",
    service: "Balanceado y Alineación",
    customer: "Pedro Silva",
    vehicle: "Chevrolet Sail 2021",
    status: "completado",
    price: 45,
    rating: 4
  },
  {
    id: "hist_004",
    date: "2024-01-20",
    service: "Reparación de Suspensión",
    customer: "Ana López",
    vehicle: "Ford Focus 2018",
    status: "pendiente",
    price: 280,
    rating: null
  }
];

export function ServicesPage() {
  const navigate = useNavigate();

  const handleRegresar = () => {
    navigate("/taller");
  };

  const handleNuevoservice = () => {
    navigate("/taller/registro-servicios");
  };

  const [filtrocategory, setFiltrocategory] = useState<string>("todos");
  const [filtrostatus, setFiltrostatus] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");
  const [mostrarDialogoEdicion, setMostrarDialogoEdicion] = useState(false);
  const [serviceSeleccionado, setserviceSeleccionado] = useState<any>(null);
  const [edicionservice, setEdicionservice] = useState({
    price: "",
    isAvailable: true,
    description: ""
  });

  const getstatusBadge = (status: string) => {
    switch (status) {
      case "activo":
        return <Badge className="bg-green-500 text-white">Activo</Badge>;
      case "inactivo":
        return <Badge variant="secondary">Inactivo</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getstatusserviceBadge = (status: string) => {
    switch (status) {
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

  const handleEditarservice = () => {
    if (!serviceSeleccionado || !edicionservice.price) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    toast.success(`service ${serviceSeleccionado.name} actualizado correctamente`);
    setMostrarDialogoEdicion(false);
    setEdicionservice({ price: "", isAvailable: true, description: "" });
    setserviceSeleccionado(null);
  };

  const servicesFiltrados = services.filter(service => {
    const coincideBusqueda = service.name.toLowerCase().includes(busqueda.toLowerCase()) ||
                            service.code.toLowerCase().includes(busqueda.toLowerCase()) ||
                            service.category.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincidecategory = filtrocategory === "todos" || service.category === filtrocategory;
    const coincidestatus = filtrostatus === "todos" || service.status === filtrostatus;
    
    return coincideBusqueda && coincidecategory && coincidestatus;
  });

  const servicesActivos = services.filter(service => service.status === "activo");
  const ingresosTotales = serviceHistory.filter(h => h.status === "completado").reduce((total, h) => total + h.price, 0);
  const servicesCompletados = serviceHistory.filter(h => h.status === "completado").length;
  const averageRating = services.reduce((acc, s) => acc + s.averageRating, 0) / services.length;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleRegresar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Regresar al Panel
          </Button>
          <div>
            <h1 className="flex items-center gap-2">
              <Wrench className="h-6 w-6" />
              Gestión de services
            </h1>
            <p className="text-muted-foreground">Administra tu catálogo de services y seguimiento</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleNuevoservice}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo servicio
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
                <p className="text-sm text-muted-foreground">services Activos</p>
                <p className="text-2xl font-bold">{servicesActivos.length}</p>
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
                <p className="text-2xl font-bold">{servicesCompletados}</p>
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
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Catálogo de services</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          {/* Filtros y búsqueda */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por name, código o categoría..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filtrocategory} onValueChange={setFiltrocategory}>
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
                <Select value={filtrostatus} onValueChange={setFiltrostatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los statuss</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de services */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>service</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>price</TableHead>
                    <TableHead>Realizados</TableHead>
                    <TableHead>status</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicesFiltrados.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.specialty}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{service.code}</TableCell>
                      <TableCell className="capitalize">{service.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {service.estimatedDurationMinutes} min
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">${service.price}</TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-bold">{service.completedServicesCount}</p>
                          <p className="text-xs text-muted-foreground">
                            ★ {service.averageRating}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getstatusBadge(service.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setserviceSeleccionado(service);
                              setEdicionservice({
                                price: service.price.toString(),
                                isAvailable: service.isAvailable,
                                description: service.description
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
              <CardTitle>Historial de services</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>date</TableHead>
                    <TableHead>service</TableHead>
                    <TableHead>customer</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>status</TableHead>
                    <TableHead>price</TableHead>
                    <TableHead>Calificación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceHistory.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell>{registro.date}</TableCell>
                      <TableCell>{registro.service}</TableCell>
                      <TableCell>{registro.customer}</TableCell>
                      <TableCell>{registro.vehicle}</TableCell>
                      <TableCell>{getstatusserviceBadge(registro.status)}</TableCell>
                      <TableCell className="font-bold">${registro.price}</TableCell>
                      <TableCell>
                        {registro.rating ? (
                          <span className="flex items-center gap-1">
                            ★ {registro.rating}
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
                <CardTitle>services Más Solicitados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Reportes de services más solicitados próximamente...</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Rentabilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Análisis detallado de rentabilidad por service próximamente...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para edición de service */}
      <Dialog open={mostrarDialogoEdicion} onOpenChange={setMostrarDialogoEdicion}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar service</DialogTitle>
            <DialogDescription>
              {serviceSeleccionado?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>price</Label>
              <Input
                type="number"
                value={edicionservice.price}
                onChange={(e) => setEdicionservice(prev => ({...prev, price: e.target.value}))}
                placeholder="price del service"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={edicionservice.description}
                onChange={(e) => setEdicionservice(prev => ({...prev, description: e.target.value}))}
                placeholder="Descripción detallada del service"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={edicionservice.isAvailable}
                onChange={(e) => setEdicionservice(prev => ({...prev, isAvailable: e.target.checked}))}
              />
              <Label htmlFor="isAvailable">service isAvailable</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMostrarDialogoEdicion(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditarservice}>
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}