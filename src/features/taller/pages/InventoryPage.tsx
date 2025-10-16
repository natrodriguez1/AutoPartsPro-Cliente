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
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Edit, 
  Trash2,
  Eye,
  Download,
  Upload,
  Filter,
  BarChart3
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

interface InventarioTallerProps {
  onRegresar: () => void;
  onCambiarVista: (vista: string) => void;
}

// Mock data para inventario
const inventarioItems = [
  {
    id: "inv_001",
    codigo: "BRK-001",
    nombre: "Pastillas de Freno Cerámicas Bosch",
    categoria: "frenos",
    marca: "Bosch",
    stockActual: 5,
    stockMinimo: 10,
    stockMaximo: 50,
    precioCompra: 65,
    precioVenta: 89,
    ubicacion: "A-1-01",
    proveedor: "Distribuidora AutoParts",
    ultimaEntrada: "2024-01-15",
    ultimaSalida: "2024-01-20",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    estado: "bajo_stock"
  },
  {
    id: "inv_002",
    codigo: "ENG-002",
    nombre: "Filtro de Aire K&N Performance",
    categoria: "motor",
    marca: "K&N",
    stockActual: 25,
    stockMinimo: 15,
    stockMaximo: 60,
    precioCompra: 32,
    precioVenta: 45,
    ubicacion: "B-2-03",
    proveedor: "Repuestos Premium",
    ultimaEntrada: "2024-01-18",
    ultimaSalida: "2024-01-22",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop",
    estado: "normal"
  },
  {
    id: "inv_003",
    codigo: "TIR-003",
    nombre: "Neumático Bridgestone 205/55R16",
    categoria: "neumaticos",
    marca: "Bridgestone",
    stockActual: 8,
    stockMinimo: 12,
    stockMaximo: 30,
    precioCompra: 220,
    precioVenta: 285,
    ubicacion: "C-1-05",
    proveedor: "LlantaCenter",
    ultimaEntrada: "2024-01-10",
    ultimaSalida: "2024-01-19",
    image: "https://images.unsplash.com/photo-1449667585940-75d7cfeae11b?w=200&h=200&fit=crop",
    estado: "bajo_stock"
  },
  {
    id: "inv_004",
    codigo: "BAT-004",
    nombre: "Batería Bosch S4 12V 60Ah",
    categoria: "electrico",
    marca: "Bosch",
    stockActual: 3,
    stockMinimo: 5,
    stockMaximo: 20,
    precioCompra: 95,
    precioVenta: 120,
    ubicacion: "D-1-02",
    proveedor: "Distribuidora AutoParts",
    ultimaEntrada: "2024-01-12",
    ultimaSalida: "2024-01-21",
    image: "https://images.unsplash.com/photo-1620064723069-5e2b2bd2102f?w=200&h=200&fit=crop",
    estado: "critico"
  },
  {
    id: "inv_005",
    codigo: "SUS-005",
    nombre: "Amortiguadores Monroe (Par)",
    categoria: "suspension",
    marca: "Monroe",
    stockActual: 12,
    stockMinimo: 8,
    stockMaximo: 25,
    precioCompra: 140,
    precioVenta: 180,
    ubicacion: "E-2-01",
    proveedor: "SuspensionPro",
    ultimaEntrada: "2024-01-16",
    ultimaSalida: "2024-01-20",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop",
    estado: "normal"
  },
  {
    id: "inv_006",
    codigo: "OIL-006",
    nombre: "Aceite Mobil 1 Sintético 5W-30",
    categoria: "motor",
    marca: "Mobil 1",
    stockActual: 0,
    stockMinimo: 20,
    stockMaximo: 100,
    precioCompra: 25,
    precioVenta: 35,
    ubicacion: "F-1-03",
    proveedor: "Lubricantes Premium",
    ultimaEntrada: "2024-01-05",
    ultimaSalida: "2024-01-23",
    image: "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=200&h=200&fit=crop",
    estado: "agotado"
  }
];

const movimientosInventario = [
  {
    id: "mov_001",
    fecha: "2024-01-23",
    tipo: "salida",
    producto: "Aceite Mobil 1 Sintético 5W-30",
    cantidad: 5,
    motivo: "Venta",
    usuario: "Juan Pérez",
    referencia: "VTA-2024-001"
  },
  {
    id: "mov_002",
    fecha: "2024-01-22",
    tipo: "salida",
    producto: "Filtro de Aire K&N Performance",
    cantidad: 2,
    motivo: "Venta",
    usuario: "María González",
    referencia: "VTA-2024-002"
  },
  {
    id: "mov_003",
    fecha: "2024-01-21",
    tipo: "salida",
    producto: "Batería Bosch S4 12V 60Ah",
    cantidad: 1,
    motivo: "Instalación",
    usuario: "Carlos López",
    referencia: "SRV-2024-015"
  },
  {
    id: "mov_004",
    fecha: "2024-01-20",
    tipo: "entrada",
    producto: "Pastillas de Freno Cerámicas Bosch",
    cantidad: 10,
    motivo: "Compra",
    usuario: "Sistema",
    referencia: "CMP-2024-008"
  }
];

export function InventarioTaller({ onRegresar, onCambiarVista }: InventarioTallerProps) {
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");
  const [mostrarDialogoAjuste, setMostrarDialogoAjuste] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState<any>(null);
  const [ajusteStock, setAjusteStock] = useState({
    tipo: "entrada",
    cantidad: "",
    motivo: ""
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "agotado":
        return <Badge variant="destructive">Agotado</Badge>;
      case "critico":
        return <Badge className="bg-orange-500 text-white">Crítico</Badge>;
      case "bajo_stock":
        return <Badge className="bg-yellow-500 text-white">Bajo Stock</Badge>;
      case "normal":
        return <Badge className="bg-green-500 text-white">Normal</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getTipoMovimientoIcon = (tipo: string) => {
    return tipo === "entrada" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const handleAjusteStock = () => {
    if (!itemSeleccionado || !ajusteStock.cantidad || !ajusteStock.motivo) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    toast.success(`Stock de ${itemSeleccionado.nombre} ajustado correctamente`);
    setMostrarDialogoAjuste(false);
    setAjusteStock({ tipo: "entrada", cantidad: "", motivo: "" });
    setItemSeleccionado(null);
  };

  const itemsFiltrados = inventarioItems.filter(item => {
    const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            item.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            item.marca.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideCategoria = filtroCategoria === "todos" || item.categoria === filtroCategoria;
    const coincideEstado = filtroEstado === "todos" || item.estado === filtroEstado;
    
    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  const alertasStock = inventarioItems.filter(item => 
    item.estado === "agotado" || item.estado === "critico" || item.estado === "bajo_stock"
  );

  const valorTotalInventario = inventarioItems.reduce((total, item) => 
    total + (item.stockActual * item.precioCompra), 0
  );

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
              <Package className="h-6 w-6" />
              Gestión de Inventario
            </h1>
            <p className="text-muted-foreground">Controla tu stock y movimientos de productos</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onCambiarVista("registro-productos")}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{inventarioItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Alertas de Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{alertasStock.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">${valorTotalInventario.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sin Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {inventarioItems.filter(item => item.estado === "agotado").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Stock */}
      {alertasStock.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Stock ({alertasStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alertasStock.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.nombre}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.nombre}</p>
                    <p className="text-xs text-muted-foreground">Stock: {item.stockActual} / Min: {item.stockMinimo}</p>
                  </div>
                  {getEstadoBadge(item.estado)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="inventario" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="inventario">
          {/* Filtros y búsqueda */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre, código o marca..."
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
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bajo_stock">Bajo Stock</SelectItem>
                    <SelectItem value="critico">Crítico</SelectItem>
                    <SelectItem value="agotado">Agotado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de inventario */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsFiltrados.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.nombre}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.nombre}</p>
                            <p className="text-sm text-muted-foreground">{item.marca}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{item.codigo}</TableCell>
                      <TableCell className="capitalize">{item.categoria}</TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-bold">{item.stockActual}</p>
                          <p className="text-xs text-muted-foreground">
                            Min: {item.stockMinimo} | Max: {item.stockMaximo}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{item.ubicacion}</TableCell>
                      <TableCell>
                        <div>
                          <p>Compra: ${item.precioCompra}</p>
                          <p>Venta: ${item.precioVenta}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoBadge(item.estado)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setItemSeleccionado(item);
                              setMostrarDialogoAjuste(true);
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

        <TabsContent value="movimientos">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Referencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientosInventario.map((movimiento) => (
                    <TableRow key={movimiento.id}>
                      <TableCell>{movimiento.fecha}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTipoMovimientoIcon(movimiento.tipo)}
                          <span className="capitalize">{movimiento.tipo}</span>
                        </div>
                      </TableCell>
                      <TableCell>{movimiento.producto}</TableCell>
                      <TableCell>{movimiento.cantidad}</TableCell>
                      <TableCell>{movimiento.motivo}</TableCell>
                      <TableCell>{movimiento.usuario}</TableCell>
                      <TableCell className="font-mono">{movimiento.referencia}</TableCell>
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
                <CardTitle>Productos Más Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Reportes de productos más vendidos próximamente...</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Análisis detallado de rotación de inventario próximamente...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para ajuste de stock */}
      <Dialog open={mostrarDialogoAjuste} onOpenChange={setMostrarDialogoAjuste}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Stock</DialogTitle>
            <DialogDescription>
              {itemSeleccionado?.nombre} - Stock actual: {itemSeleccionado?.stockActual}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo de movimiento</Label>
              <Select value={ajusteStock.tipo} onValueChange={(value) => setAjusteStock(prev => ({...prev, tipo: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada (Agregar stock)</SelectItem>
                  <SelectItem value="salida">Salida (Reducir stock)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cantidad</Label>
              <Input
                type="number"
                value={ajusteStock.cantidad}
                onChange={(e) => setAjusteStock(prev => ({...prev, cantidad: e.target.value}))}
                placeholder="Ingresa la cantidad"
              />
            </div>
            <div>
              <Label>Motivo</Label>
              <Input
                value={ajusteStock.motivo}
                onChange={(e) => setAjusteStock(prev => ({...prev, motivo: e.target.value}))}
                placeholder="Motivo del ajuste"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMostrarDialogoAjuste(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAjusteStock}>
                Confirmar Ajuste
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}