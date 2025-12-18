import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";
import { Progress } from "@/shared/ui/progress";
import { Separator } from "@/shared/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Settings,
  Search,
  Filter,
  Download,
  Eye,
  UserX,
  Building,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  MapPin
} from "lucide-react";
import { useAuth } from "@/app/providers/AuthContext";
import { toast } from "sonner"

// TODO: llamada a estadisticas del taller (ganancia total, ganancias por mes, usuarios activos, talleres activos, transac totales, transac al mes y crecimiento mensual)
const estadisticasGenerales = {
  gananciasTotal: 458750,
  gananciasMes: 67450,
  usuariosActivos: 2847,
  talleresActivos: 156,
  transaccionesTotales: 12450,
  transaccionesMes: 1890,
  crecimientoMensual: 12.5
};

//TODO: llama a top 5 productos más populares
const productosPopulares = [
  { id: "1", nombre: "Pastillas de Freno Cerámicas", ventas: 245, ingresos: 29400, categoria: "Frenos" },
  { id: "2", nombre: "Aceite Motor Sintético Mobil 1", ventas: 189, ingresos: 8505, categoria: "Lubricantes" },
  { id: "3", nombre: "Batería Bosch S4 12V", ventas: 167, ingresos: 15865, categoria: "Eléctrico" },
  { id: "4", nombre: "Amortiguadores Monroe", ventas: 134, ingresos: 18760, categoria: "Suspensión" },
  { id: "5", nombre: "Neumáticos Bridgestone", ventas: 98, ingresos: 17640, categoria: "Neumáticos" }
];
//TODO: llamada a top 5 servicios más populares
const serviciosPopulares = [
  { id: "1", nombre: "Cambio de Aceite Premium", solicitudes: 567, ingresos: 36855, promedio: 65 },
  { id: "2", nombre: "Diagnóstico Computarizado", solicitudes: 445, ingresos: 15575, promedio: 35 },
  { id: "3", nombre: "Servicio de Frenos", solicitudes: 289, ingresos: 34680, promedio: 120 },
  { id: "4", nombre: "Alineación y Balanceado", solicitudes: 234, ingresos: 12870, promedio: 55 },
  { id: "5", nombre: "Revisión Pre-Viaje", solicitudes: 156, ingresos: 12480, promedio: 80 }
];
//TODO: llamada a top 5 talleres con más ventas
const talleresMasVentas = [
  { 
    id: "1", 
    nombre: "AutoMaster Quito", 
    ventas: 89, 
    ingresos: 125600, 
    rating: 4.8, 
    ubicacion: "Quito", 
    activo: true,
    especialidades: ["Motor", "Transmisión"],
    distancia: "2.5 km del centro"
  },
  { 
    id: "2", 
    nombre: "TallerPro Guayaquil", 
    ventas: 76, 
    ingresos: 98450, 
    rating: 4.6, 
    ubicacion: "Guayaquil", 
    activo: true,
    especialidades: ["Frenos", "Eléctrico"],
    distancia: "1.8 km del centro"
  },
  { 
    id: "3", 
    nombre: "MecánicaTotal Cuenca", 
    ventas: 65, 
    ingresos: 87200, 
    rating: 4.7, 
    ubicacion: "Cuenca", 
    activo: true,
    especialidades: ["Suspensión", "Dirección"],
    distancia: "3.2 km del centro"
  },
  { 
    id: "4", 
    nombre: "AutoExpert Machala", 
    ventas: 54, 
    ingresos: 72100, 
    rating: 4.5, 
    ubicacion: "Machala", 
    activo: true,
    especialidades: ["General"],
    distancia: "0.9 km del centro"
  },
  { 
    id: "5", 
    nombre: "CarService Ambato", 
    ventas: 48, 
    ingresos: 65800, 
    rating: 4.4, 
    ubicacion: "Ambato", 
    activo: false,
    especialidades: ["Electricidad", "Aire Acondicionado"],
    distancia: "4.1 km del centro"
  }
];
//TODO: llamada a usuarios registrados (?)
const usuariosRegistrados = [
  { 
    id: "1", 
    nombre: "Juan Carlos Pérez", 
    email: "juan.perez@email.com", 
    tipo: "usuario", 
    fechaRegistro: "2024-01-15", 
    activo: true, 
    pedidos: 12, 
    gastoTotal: 1450 
  },
  { 
    id: "2", 
    nombre: "María García López", 
    email: "maria.garcia@email.com", 
    tipo: "usuario", 
    fechaRegistro: "2024-02-08", 
    activo: true, 
    pedidos: 8, 
    gastoTotal: 890 
  },
  { 
    id: "3", 
    nombre: "AutoMaster Quito", 
    email: "automaster@taller.com", 
    tipo: "taller", 
    fechaRegistro: "2023-12-05", 
    activo: true, 
    pedidos: 89, 
    gastoTotal: 125600 
  },
  { 
    id: "4", 
    nombre: "Carlos Mendoza", 
    email: "carlos.mendoza@email.com", 
    tipo: "usuario", 
    fechaRegistro: "2024-03-12", 
    activo: false, 
    pedidos: 3, 
    gastoTotal: 340 
  },
  { 
    id: "5", 
    nombre: "TallerPro Guayaquil", 
    email: "tallerpro@taller.com", 
    tipo: "taller", 
    fechaRegistro: "2023-11-20", 
    activo: true, 
    pedidos: 76, 
    gastoTotal: 98450 
  }
];

export function AdminDashboard() {
  
  const { usuario } = useAuth();
  const [tabActiva, setTabActiva] = useState("dashboard");
  const [busquedaUsuarios, setBusquedaUsuarios] = useState("");
  const [filtroTipoUsuario, setFiltroTipoUsuario] = useState("todos");
  const [busquedaTalleres, setBusquedaTalleres] = useState("");
  const [filtroUbicacion, setFiltroUbicacion] = useState("todas");
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("todas");
  const [filtroEstadoTaller, setFiltroEstadoTaller] = useState("todos");
  const [ordenTalleres, setOrdenTalleres] = useState("nombre");
  const [usuarios, setUsuarios] = useState(usuariosRegistrados);
  const [talleres, setTalleres] = useState(talleresMasVentas);

  const filtrarUsuarios = () => {
    return usuarios.filter(user => {
      const coincideNombre = user.nombre.toLowerCase().includes(busquedaUsuarios.toLowerCase()) ||
                            user.email.toLowerCase().includes(busquedaUsuarios.toLowerCase());
      const coincideTipo = filtroTipoUsuario === "todos" || user.tipo === filtroTipoUsuario;
      return coincideNombre && coincideTipo;
    });
  };

  const filtrarTalleres = () => {
    let talleresFiltrados = talleres.filter(taller => {
      const especialidadesTexto = taller.especialidades.join(" ").toLowerCase();
      const coincideNombre = taller.nombre.toLowerCase().includes(busquedaTalleres.toLowerCase()) ||
                            especialidadesTexto.includes(busquedaTalleres.toLowerCase()) ||
                            taller.ubicacion.toLowerCase().includes(busquedaTalleres.toLowerCase());
      const coincideUbicacion = filtroUbicacion === "todas" || taller.ubicacion.toLowerCase().includes(filtroUbicacion.toLowerCase());
      const coincideEspecialidad = filtroEspecialidad === "todas" || 
                                  taller.especialidades.some(esp => esp.toLowerCase().includes(filtroEspecialidad.toLowerCase()));
      const coincideEstado = filtroEstadoTaller === "todos" || 
                           (filtroEstadoTaller === "activo" && taller.activo) ||
                           (filtroEstadoTaller === "inactivo" && !taller.activo);
      return coincideNombre && coincideUbicacion && coincideEspecialidad && coincideEstado;
    });

    // Ordenar resultados
    talleresFiltrados.sort((a, b) => {
      switch (ordenTalleres) {
        case "nombre":
          return a.nombre.localeCompare(b.nombre);
        case "ventas":
          return b.ventas - a.ventas;
        case "ingresos":
          return b.ingresos - a.ingresos;
        case "rating":
          return b.rating - a.rating;
        case "ubicacion":
          return a.ubicacion.localeCompare(b.ubicacion);
        default:
          return 0;
      }
    });

    return talleresFiltrados;
  };

  const toggleUsuarioActivo = (id: string) => {
    setUsuarios(prevUsuarios => 
      prevUsuarios.map(user => 
        user.id === id ? { ...user, activo: !user.activo } : user
      )
    );
    const usuario = usuarios.find(u => u.id === id);
    const mensaje = `Usuario ${usuario?.nombre} ${usuario?.activo ? 'desactivado' : 'activado'} correctamente`;
    toast.success(mensaje);
  };

  const toggleTallerActivo = (id: string) => {
    setTalleres(prevTalleres => 
      prevTalleres.map(taller => 
        taller.id === id ? { ...taller, activo: !taller.activo } : taller
      )
    );
    const taller = talleres.find(t => t.id === id);
    const mensaje = `Taller ${taller?.nombre} ${taller?.activo ? 'desactivado' : 'activado'} correctamente`;
    toast.success(mensaje);
  };

  const exportarDatos = () => {
    toast.success("Datos exportados exitosamente");
  };

  const limpiarFiltrosTalleres = () => {
    setBusquedaTalleres("");
    setFiltroUbicacion("todas");
    setFiltroEspecialidad("todas");
    setFiltroEstadoTaller("todos");
    setOrdenTalleres("nombre");
    toast.success("Filtros limpiados");
  };

  const exportarTalleres = () => {
    const talleresFiltrados = filtrarTalleres();
    const csvHeaders = "Nombre,Ubicacion,Especialidades,Ventas,Ingresos,Rating,Estado";
    const csvRows = talleresFiltrados.map(taller => {
      const especialidades = taller.especialidades.join("; ");
      const estado = taller.activo ? 'Activo' : 'Inactivo';
      return `${taller.nombre},${taller.ubicacion},${especialidades},${taller.ventas},${taller.ingresos},${taller.rating},${estado}`;
    });
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    
    toast.success(`Exportando ${talleresFiltrados.length} talleres`);
    console.log("CSV Content:", csvContent);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">
              Bienvenido {usuario?.nombre} - Gestión integral de AutoParts Pro
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={exportarDatos}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          </div>
        </div>

        <Tabs value={tabActiva} onValueChange={setTabActiva}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="talleres">Talleres</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          </TabsList>

          {/* Dashboard Principal */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ganancias Totales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${estadisticasGenerales.gananciasTotal.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +${estadisticasGenerales.gananciasMes.toLocaleString()} este mes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estadisticasGenerales.usuariosActivos.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {estadisticasGenerales.talleresActivos} talleres registrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estadisticasGenerales.transaccionesTotales.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{estadisticasGenerales.transaccionesMes} este mes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Crecimiento</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{estadisticasGenerales.crecimientoMensual}%</div>
                  <p className="text-xs text-muted-foreground">
                    Comparado con el mes anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos y Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Talleres por Ganancias */}
              <Card>
                <CardHeader>
                  <CardTitle>Talleres con Mayores Ganancias</CardTitle>
                  <CardDescription>Top 5 talleres por ingresos generados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {talleresMasVentas.slice(0, 5).map((taller, index) => (
                      <div key={taller.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{taller.nombre}</p>
                            <p className="text-sm text-muted-foreground">{taller.ubicacion}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${taller.ingresos.toLocaleString()}</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-xs">{taller.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Productos más vendidos */}
              <Card>
                <CardHeader>
                  <CardTitle>Productos Más Vendidos</CardTitle>
                  <CardDescription>Productos con mayor volumen de ventas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productosPopulares.map((producto, index) => (
                      <div key={producto.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-secondary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{producto.nombre}</p>
                            <p className="text-sm text-muted-foreground">{producto.categoria}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{producto.ventas} ventas</p>
                          <p className="text-sm text-muted-foreground">${producto.ingresos.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Servicios Populares */}
            <Card>
              <CardHeader>
                <CardTitle>Servicios Más Solicitados</CardTitle>
                <CardDescription>Servicios con mayor demanda en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {serviciosPopulares.map((servicio) => (
                    <div key={servicio.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{servicio.nombre}</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{servicio.solicitudes} solicitudes</p>
                        <p className="font-medium text-foreground">${servicio.ingresos.toLocaleString()} generados</p>
                        <p>Promedio: ${servicio.promedio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestión de Productos */}
          <TabsContent value="productos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Productos</CardTitle>
                <CardDescription>Estadísticas detalladas de productos y categorías</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Ventas</TableHead>
                      <TableHead>Ingresos</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productosPopulares.map((producto) => (
                      <TableRow key={producto.id}>
                        <TableCell className="font-medium">{producto.nombre}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{producto.categoria}</Badge>
                        </TableCell>
                        <TableCell>{producto.ventas}</TableCell>
                        <TableCell>${producto.ingresos.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activo
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestión de Talleres */}
          <TabsContent value="talleres" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Talleres</CardTitle>
                <CardDescription>Administra talleres registrados y su estado</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtros de talleres */}
                <div className="flex flex-col space-y-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar talleres por nombre, especialidad o ubicación..."
                        value={busquedaTalleres}
                        onChange={(e) => setBusquedaTalleres(e.target.value)}
                        className="pl-10"
                      />
                      {busquedaTalleres && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-6 w-6 p-0"
                          onClick={() => setBusquedaTalleres("")}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                    <Button variant="outline" onClick={limpiarFiltrosTalleres} className="sm:w-auto">
                      <Filter className="h-4 w-4 mr-2" />
                      Limpiar Filtros
                    </Button>
                  </div>
                  
                  {/* Búsquedas rápidas */}
                  {!busquedaTalleres && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground self-center">Búsquedas rápidas:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => setBusquedaTalleres("Quito")}
                      >
                        Talleres en Quito
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => setBusquedaTalleres("Motor")}
                      >
                        Especialistas Motor
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => setFiltroEstadoTaller("inactivo")}
                      >
                        Talleres Inactivos
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => setOrdenTalleres("rating")}
                      >
                        Mejor Calificados
                      </Button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <Select value={filtroUbicacion} onValueChange={setFiltroUbicacion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas las ciudades</SelectItem>
                        <SelectItem value="quito">Quito</SelectItem>
                        <SelectItem value="guayaquil">Guayaquil</SelectItem>
                        <SelectItem value="cuenca">Cuenca</SelectItem>
                        <SelectItem value="machala">Machala</SelectItem>
                        <SelectItem value="ambato">Ambato</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filtroEspecialidad} onValueChange={setFiltroEspecialidad}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas las especialidades</SelectItem>
                        <SelectItem value="motor">Motor y Transmisión</SelectItem>
                        <SelectItem value="frenos">Frenos y Eléctrico</SelectItem>
                        <SelectItem value="suspension">Suspensión y Dirección</SelectItem>
                        <SelectItem value="general">Mecánica General</SelectItem>
                        <SelectItem value="electricidad">Electricidad</SelectItem>
                        <SelectItem value="aire">Aire Acondicionado</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filtroEstadoTaller} onValueChange={setFiltroEstadoTaller}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los estados</SelectItem>
                        <SelectItem value="activo">Activos</SelectItem>
                        <SelectItem value="inactivo">Inactivos</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={ordenTalleres} onValueChange={setOrdenTalleres}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nombre">Nombre A-Z</SelectItem>
                        <SelectItem value="ventas">Más Ventas</SelectItem>
                        <SelectItem value="ingresos">Más Ingresos</SelectItem>
                        <SelectItem value="rating">Mejor Rating</SelectItem>
                        <SelectItem value="ubicacion">Ubicación A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Estadísticas de filtros y acciones */}
                  <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-4">
                      <span>
                        Mostrando <strong>{filtrarTalleres().length}</strong> de <strong>{talleres.length}</strong> talleres
                      </span>
                      {busquedaTalleres && (
                        <Badge variant="secondary" className="text-xs">
                          Búsqueda: {busquedaTalleres}
                        </Badge>
                      )}
                      {filtroUbicacion !== "todas" && (
                        <Badge variant="outline" className="text-xs">
                          Ubicación: {filtroUbicacion}
                        </Badge>
                      )}
                      {filtroEspecialidad !== "todas" && (
                        <Badge variant="outline" className="text-xs">
                          Especialidad: {filtroEspecialidad}
                        </Badge>
                      )}
                      {filtroEstadoTaller !== "todos" && (
                        <Badge variant="outline" className="text-xs">
                          Estado: {filtroEstadoTaller}
                        </Badge>
                      )}
                      {(busquedaTalleres || filtroUbicacion !== "todas" || filtroEspecialidad !== "todas" || filtroEstadoTaller !== "todos") && (
                        <Button variant="ghost" size="sm" onClick={limpiarFiltrosTalleres} className="h-6 text-xs">
                          Limpiar todo
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={exportarTalleres}>
                        <Download className="h-3 w-3 mr-1" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </div>

                {filtrarTalleres().length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No se encontraron talleres</h3>
                    <p className="text-muted-foreground mb-4">
                      {busquedaTalleres 
                        ? `No hay talleres que coincidan con "${busquedaTalleres}"`
                        : "No hay talleres que coincidan con los filtros aplicados"
                      }
                    </p>
                    <Button variant="outline" onClick={limpiarFiltrosTalleres}>
                      <Filter className="h-4 w-4 mr-2" />
                      Limpiar filtros
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Taller</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Ventas</TableHead>
                        <TableHead>Ingresos</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtrarTalleres().map((taller) => (
                      <TableRow key={taller.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{taller.nombre}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {taller.especialidades.map((especialidad, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {especialidad}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="font-medium">{taller.ubicacion}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{taller.distancia}</p>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{taller.ventas}</div>
                          <div className="text-xs text-muted-foreground">ventas este mes</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${taller.ingresos.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">ingresos generados</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            {taller.rating}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={taller.activo ? "default" : "destructive"}>
                            {taller.activo ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Activo
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Inactivo
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={taller.activo}
                              onCheckedChange={() => toggleTallerActivo(taller.id)}
                            />
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestión de Usuarios */}
          <TabsContent value="usuarios" className="space-y-6">
            {/* Filtros de usuarios */}
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra usuarios y talleres registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuarios..."
                      value={busquedaUsuarios}
                      onChange={(e) => setBusquedaUsuarios(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filtroTipoUsuario} onValueChange={setFiltroTipoUsuario}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="usuario">Usuarios</SelectItem>
                      <SelectItem value="taller">Talleres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Pedidos</TableHead>
                      <TableHead>Gasto Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtrarUsuarios().map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {user.tipo === "taller" ? <Building className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.nombre}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.tipo === "taller" ? "default" : "secondary"}>
                            {user.tipo === "taller" ? "Taller" : "Usuario"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.fechaRegistro}</TableCell>
                        <TableCell>{user.pedidos}</TableCell>
                        <TableCell>${user.gastoTotal.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={user.activo ? "default" : "destructive"}>
                            {user.activo ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Activo
                              </>
                            ) : (
                              <>
                                <UserX className="h-3 w-3 mr-1" />
                                Inactivo
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={user.activo}
                              onCheckedChange={() => toggleUsuarioActivo(user.id)}
                            />
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
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
        </Tabs>
      </div>
    </div>
  );
}