import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  FileText, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit,
  Eye,
  Download,
  Filter,
  Calendar,
  DollarSign
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface OrdenesProps {
  onRegresar: () => void;
  onCambiarVista: (vista: string) => void;
}

// Mock data para órdenes de clientes
const ordenesClientes = [
  {
    id: "ord_001",
    numero: "ORD-2024-001",
    cliente: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    telefono: "+593-2-234-5678",
    vehiculo: "Toyota Corolla 2020",
    fecha: "2024-01-20",
    fechaEntregaEstimada: "2024-01-25",
    estado: "pendiente",
    total: 450.00,
    items: [
      { codigo: "BRK-001", nombre: "Pastillas de Freno Cerámicas Bosch", cantidad: 1, precio: 120, subtotal: 120 },
      { codigo: "OIL-001", nombre: "Cambio de Aceite Mobil 1", cantidad: 1, precio: 65, subtotal: 65 },
      { codigo: "SRV-001", nombre: "Revisión General", cantidad: 1, precio: 80, subtotal: 80 },
      { codigo: "MO-001", nombre: "Mano de Obra", cantidad: 3, precio: 55, subtotal: 165 }
    ],
    direccion: "Av. 12 de Octubre y Patria, Quito",
    observaciones: "Servicio urgente, vehículo para viaje"
  },
  {
    id: "ord_002",
    numero: "ORD-2024-002",
    cliente: "María González",
    email: "maria.gonzalez@email.com",
    telefono: "+593-4-567-8901",
    vehiculo: "Honda Civic 2019",
    fecha: "2024-01-18",
    fechaEntregaEstimada: "2024-01-22",
    estado: "en_proceso",
    total: 890.00,
    items: [
      { codigo: "TIR-003", nombre: "Neumático Bridgestone 205/55R16", cantidad: 4, precio: 180, subtotal: 720 },
      { codigo: "SRV-002", nombre: "Balanceado y Alineación", cantidad: 1, precio: 45, subtotal: 45 },
      { codigo: "MO-002", nombre: "Instalación", cantidad: 2.5, precio: 50, subtotal: 125 }
    ],
    direccion: "Cdla. Kennedy Norte, Guayaquil",
    observaciones: "Cliente prefiere neumáticos marca original"
  },
  {
    id: "ord_003",
    numero: "ORD-2024-003",
    cliente: "Pedro Silva",
    email: "pedro.silva@email.com",
    telefono: "+593-7-890-1234",
    vehiculo: "Chevrolet Sail 2021",
    fecha: "2024-01-15",
    fechaEntregaEstimada: "2024-01-20",
    estado: "completada",
    total: 320.00,
    items: [
      { codigo: "SUS-005", nombre: "Revisión de Suspensión", cantidad: 1, precio: 120, subtotal: 120 },
      { codigo: "BAT-004", nombre: "Batería Bosch S4 12V 60Ah", cantidad: 1, precio: 120, subtotal: 120 },
      { codigo: "MO-003", nombre: "Diagnóstico", cantidad: 1.6, precio: 50, subtotal: 80 }
    ],
    direccion: "Sector El Batán, Cuenca",
    observaciones: "Servicio completado satisfactoriamente"
  },
  {
    id: "ord_004",
    numero: "ORD-2024-004",
    cliente: "Ana López",
    email: "ana.lopez@email.com",
    telefono: "+593-5-345-6789",
    vehiculo: "Ford Focus 2018",
    fecha: "2024-01-22",
    fechaEntregaEstimada: "2024-01-28",
    estado: "cancelada",
    total: 560.00,
    items: [
      { codigo: "ENG-002", nombre: "Reparación de Motor", cantidad: 1, precio: 450, subtotal: 450 },
      { codigo: "MO-004", nombre: "Mano de Obra Especializada", cantidad: 2.2, precio: 50, subtotal: 110 }
    ],
    direccion: "Av. De las Américas, Ambato",
    observaciones: "Cancelada por cliente - problemas económicos"
  },
  {
    id: "ord_005",
    numero: "ORD-2024-005",
    cliente: "Roberto Vargas",
    email: "roberto.vargas@email.com",
    telefono: "+593-3-456-7890",
    vehiculo: "Nissan Sentra 2020",
    fecha: "2024-01-24",
    fechaEntregaEstimada: "2024-01-26",
    estado: "pendiente",
    total: 280.00,
    items: [
      { codigo: "ELE-001", nombre: "Diagnóstico Eléctrico", cantidad: 1, precio: 80, subtotal: 80 },
      { codigo: "REP-001", nombre: "Reparación Sistema Eléctrico", cantidad: 1, precio: 150, subtotal: 150 },
      { codigo: "MO-005", nombre: "Mano de Obra", cantidad: 1, precio: 50, subtotal: 50 }
    ],
    direccion: "Sector Norte, Riobamba",
    observaciones: "Problema con luces y sistema de arranque"
  }
];

// Estadísticas de clientes frecuentes
const clientesFrecuentes = [
  { id: "cli_001", nombre: "Carlos Mendoza", email: "carlos.mendoza@email.com", telefono: "+593-2-234-5678", ordenes: 8, ultimaVisita: "2024-01-20" },
  { id: "cli_002", nombre: "María González", email: "maria.gonzalez@email.com", telefono: "+593-4-567-8901", ordenes: 6, ultimaVisita: "2024-01-18" },
  { id: "cli_003", nombre: "Pedro Silva", email: "pedro.silva@email.com", telefono: "+593-7-890-1234", ordenes: 4, ultimaVisita: "2024-01-15" },
  { id: "cli_004", nombre: "Ana López", email: "ana.lopez@email.com", telefono: "+593-5-345-6789", ordenes: 3, ultimaVisita: "2024-01-10" },
  { id: "cli_005", nombre: "Roberto Vargas", email: "roberto.vargas@email.com", telefono: "+593-3-456-7890", ordenes: 5, ultimaVisita: "2024-01-24" }
];

export function OrdenesCompra({ onRegresar, onCambiarVista }: OrdenesProps) {
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroCliente, setFiltroCliente] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<any>(null);
  const [mostrarDetalleOrden, setMostrarDetalleOrden] = useState(false);
  const [mostrarDialogoEdicion, setMostrarDialogoEdicion] = useState(false);
  const [ordenEditando, setOrdenEditando] = useState<any>(null);
  


  const [edicionOrden, setEdicionOrden] = useState({
    estado: "",
    fechaEntregaEstimada: "",
    observaciones: "",
    motivoCambio: ""
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge className="bg-yellow-500 text-white"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case "en_proceso":
        return <Badge className="bg-blue-500 text-white"><Truck className="h-3 w-3 mr-1" />En Proceso</Badge>;
      case "completada":
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Completada</Badge>;
      case "cancelada":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Cancelada</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };



  const handleEditarOrden = () => {
    if (!edicionOrden.estado) {
      toast.error("Por favor selecciona un estado");
      return;
    }

    if (!edicionOrden.motivoCambio.trim()) {
      toast.error("Por favor describe el motivo del cambio");
      return;
    }

    // En una implementación real, aquí se actualizaría la orden en la base de datos
    const estadoAnterior = getEstadoTexto(ordenEditando?.estado);
    const nuevoEstado = getEstadoTexto(edicionOrden.estado);
    
    toast.success(`Orden ${ordenEditando?.numero} actualizada: ${estadoAnterior} → ${nuevoEstado}`);
    setMostrarDialogoEdicion(false);
    setEdicionOrden({ estado: "", fechaEntregaEstimada: "", observaciones: "", motivoCambio: "" });
    setOrdenEditando(null);
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "pendiente": return "Pendiente";
      case "en_proceso": return "En Proceso";
      case "completada": return "Completada";
      case "cancelada": return "Cancelada";
      default: return estado;
    }
  };

  const abrirDialogoEdicion = (orden: any) => {
    setOrdenEditando(orden);
    setEdicionOrden({
      estado: orden.estado,
      fechaEntregaEstimada: orden.fechaEntregaEstimada,
      observaciones: orden.observaciones || "",
      motivoCambio: ""
    });
    setMostrarDialogoEdicion(true);
  };

  const ordenesFiltradas = ordenesClientes.filter(orden => {
    const coincideBusqueda = orden.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
                            orden.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
                            orden.vehiculo.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideEstado = filtroEstado === "todos" || orden.estado === filtroEstado;
    const coincideCliente = filtroCliente === "todos" || orden.cliente === filtroCliente;
    
    return coincideBusqueda && coincideEstado && coincideCliente;
  });

  const totalOrdenes = ordenesClientes.length;
  const ordenesPendientes = ordenesClientes.filter(o => o.estado === "pendiente").length;
  const ordenesEnProceso = ordenesClientes.filter(o => o.estado === "en_proceso").length;
  const ordenesCompletadas = ordenesClientes.filter(o => o.estado === "completada").length;
  const valorTotalOrdenes = ordenesClientes
    .filter(o => o.estado !== "cancelada")
    .reduce((total, orden) => total + orden.total, 0);

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
              <FileText className="h-6 w-6" />
              Órdenes
            </h1>
            <p className="text-muted-foreground">Gestiona los pedidos de tus clientes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Órdenes</p>
                <p className="text-2xl font-bold">{totalOrdenes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{ordenesPendientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Truck className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">En Proceso</p>
                <p className="text-2xl font-bold text-blue-600">{ordenesEnProceso}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{ordenesCompletadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">${valorTotalOrdenes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ordenes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="ordenes">
          {/* Filtros y búsqueda */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por número, cliente o vehículo..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_proceso">En Proceso</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroCliente} onValueChange={setFiltroCliente}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los clientes</SelectItem>
                    {clientesFrecuentes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.nombre}>
                        {cliente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de órdenes */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordenesFiltradas.map((orden) => (
                    <TableRow key={orden.id}>
                      <TableCell className="font-mono">{orden.numero}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{orden.cliente}</p>
                          <p className="text-sm text-muted-foreground">{orden.telefono}</p>
                        </div>
                      </TableCell>
                      <TableCell>{orden.vehiculo}</TableCell>
                      <TableCell>{orden.fecha}</TableCell>
                      <TableCell>{getEstadoBadge(orden.estado)}</TableCell>
                      <TableCell className="font-bold">${orden.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setOrdenSeleccionada(orden);
                              setMostrarDetalleOrden(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => abrirDialogoEdicion(orden)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
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

        <TabsContent value="clientes">
          <Card>
            <CardHeader>
              <CardTitle>Clientes Frecuentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Órdenes</TableHead>
                    <TableHead>Última Visita</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFrecuentes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nombre}</TableCell>
                      <TableCell>{cliente.email}</TableCell>
                      <TableCell>{cliente.telefono}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{cliente.ordenes} órdenes</Badge>
                      </TableCell>
                      <TableCell>{cliente.ultimaVisita}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="reportes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Órdenes por Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Análisis de órdenes por cliente próximamente...</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tendencias de Servicio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Gráficos de tendencias de servicios próximamente...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>



      {/* Dialog para detalle de orden */}
      <Dialog open={mostrarDetalleOrden} onOpenChange={setMostrarDetalleOrden}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Detalle de Orden - {ordenSeleccionada?.numero}</DialogTitle>
            <DialogDescription>
              Información completa de la orden de compra y sus productos
            </DialogDescription>
          </DialogHeader>
          {ordenSeleccionada && (
            <div className="space-y-6 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Información General</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Cliente:</strong> {ordenSeleccionada.cliente}</p>
                    <p><strong>Vehículo:</strong> {ordenSeleccionada.vehiculo}</p>
                    <p><strong>Fecha:</strong> {ordenSeleccionada.fecha}</p>
                    <p><strong>Entrega estimada:</strong> {ordenSeleccionada.fechaEntregaEstimada}</p>
                    <p><strong>Estado:</strong> {getEstadoBadge(ordenSeleccionada.estado)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contacto</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Email:</strong> {ordenSeleccionada.email}</p>
                    <p><strong>Teléfono:</strong> {ordenSeleccionada.telefono}</p>
                    <p><strong>Dirección:</strong> {ordenSeleccionada.direccion}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Productos y Servicios</h4>
                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Código</TableHead>
                        <TableHead className="min-w-[200px]">Producto</TableHead>
                        <TableHead className="min-w-[80px]">Cantidad</TableHead>
                        <TableHead className="min-w-[100px]">Precio Unit.</TableHead>
                        <TableHead className="min-w-[100px]">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ordenSeleccionada.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs">{item.codigo}</TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="truncate" title={item.nombre}>
                              {item.nombre}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.cantidad}</TableCell>
                          <TableCell className="text-right">${item.precio}</TableCell>
                          <TableCell className="text-right font-medium">${item.subtotal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="text-right mt-4 pt-2 border-t">
                  <p className="text-lg font-bold">Total: ${ordenSeleccionada.total.toLocaleString()}</p>
                </div>
              </div>
              
              {ordenSeleccionada.observaciones && (
                <div>
                  <h4 className="font-medium mb-2">Observaciones</h4>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{ordenSeleccionada.observaciones}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para edición de orden */}
      <Dialog open={mostrarDialogoEdicion} onOpenChange={setMostrarDialogoEdicion}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Orden - {ordenEditando?.numero}</DialogTitle>
            <DialogDescription>
              Modifica el estado y detalles de la orden de compra
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Estado de la orden *</Label>
              <Select value={edicionOrden.estado} onValueChange={(value) => setEdicionOrden(prev => ({...prev, estado: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona nuevo estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      Pendiente
                    </div>
                  </SelectItem>
                  <SelectItem value="en_transito">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-500" />
                      En Tránsito
                    </div>
                  </SelectItem>
                  <SelectItem value="entregada">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Entregada
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelada">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Cancelada
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Nueva fecha de entrega estimada</Label>
              <Input
                type="date"
                value={edicionOrden.fechaEntregaEstimada}
                onChange={(e) => setEdicionOrden(prev => ({...prev, fechaEntregaEstimada: e.target.value}))}
              />
            </div>

            <div>
              <Label>Observaciones</Label>
              <Textarea
                value={edicionOrden.observaciones}
                onChange={(e) => setEdicionOrden(prev => ({...prev, observaciones: e.target.value}))}
                placeholder="Observaciones sobre la orden..."
                rows={2}
              />
            </div>

            <div>
              <Label>Motivo del cambio *</Label>
              <Textarea
                value={edicionOrden.motivoCambio}
                onChange={(e) => setEdicionOrden(prev => ({...prev, motivoCambio: e.target.value}))}
                placeholder="Describe el motivo del cambio de estado..."
                rows={2}
                required
              />
            </div>

            {ordenEditando && (
              <div className="bg-muted p-3 rounded-lg">
                <h5 className="font-medium text-sm mb-2">Estado Actual</h5>
                <div className="flex items-center gap-2">
                  {getEstadoBadge(ordenEditando.estado)}
                  <span className="text-sm text-muted-foreground">
                    desde {ordenEditando.fecha}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setMostrarDialogoEdicion(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditarOrden}>
                Actualizar Orden
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}