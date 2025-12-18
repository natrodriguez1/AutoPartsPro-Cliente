import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
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
  BarChart3,
} from "lucide-react";
import { ImageWithFallback } from "@/shared/components/ImageWithFallback";
import { toast } from "sonner";
import type { InventoryStatus, InventoryItem, InventoryMovement} from "../types/inventory";

// TODO: reemplazar estos mocks por llamada al backend
const inventoryItems: InventoryItem[] = [
  {
    id: "inv_001",
    code: "BRK-001",
    name: "Pastillas de Freno Cerámicas Bosch",
    category: "frenos",
    brand: "Bosch",
    currentStock: 5,
    minStock: 10,
    maxStock: 50,
    purchasePrice: 65,
    price: 89,
    location: "A-1-01",
    supplier: "Distribuidora AutoParts",
    lastInboundDate: "2024-01-15",
    lastOutboundDate: "2024-01-20",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    status: "bajo_stock",
  },
  {
    id: "inv_002",
    code: "ENG-002",
    name: "Filtro de Aire K&N Performance",
    category: "motor",
    brand: "K&N",
    currentStock: 25,
    minStock: 15,
    maxStock: 60,
    purchasePrice: 32,
    price: 45,
    location: "B-2-03",
    supplier: "Repuestos Premium",
    lastInboundDate: "2024-01-18",
    lastOutboundDate: "2024-01-22",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop",
    status: "normal",
  },
  {
    id: "inv_003",
    code: "TIR-003",
    name: "Neumático Bridgestone 205/55R16",
    category: "neumaticos",
    brand: "Bridgestone",
    currentStock: 8,
    minStock: 12,
    maxStock: 30,
    purchasePrice: 220,
    price: 285,
    location: "C-1-05",
    supplier: "LlantaCenter",
    lastInboundDate: "2024-01-10",
    lastOutboundDate: "2024-01-19",
    image:
      "https://images.unsplash.com/photo-1449667585940-75d7cfeae11b?w=200&h=200&fit=crop",
    status: "bajo_stock",
  },
  {
    id: "inv_004",
    code: "BAT-004",
    name: "Batería Bosch S4 12V 60Ah",
    category: "electrico",
    brand: "Bosch",
    currentStock: 3,
    minStock: 5,
    maxStock: 20,
    purchasePrice: 95,
    price: 120,
    location: "D-1-02",
    supplier: "Distribuidora AutoParts",
    lastInboundDate: "2024-01-12",
    lastOutboundDate: "2024-01-21",
    image:
      "https://images.unsplash.com/photo-1620064723069-5e2b2bd2102f?w=200&h=200&fit=crop",
    status: "critico",
  },
  {
    id: "inv_005",
    code: "SUS-005",
    name: "Amortiguadores Monroe (Par)",
    category: "suspension",
    brand: "Monroe",
    currentStock: 12,
    minStock: 8,
    maxStock: 25,
    purchasePrice: 140,
    price: 180,
    location: "E-2-01",
    supplier: "SuspensionPro",
    lastInboundDate: "2024-01-16",
    lastOutboundDate: "2024-01-20",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop",
    status: "normal",
  },
  {
    id: "inv_006",
    code: "OIL-006",
    name: "Aceite Mobil 1 Sintético 5W-30",
    category: "motor",
    brand: "Mobil 1",
    currentStock: 0,
    minStock: 20,
    maxStock: 100,
    purchasePrice: 25,
    price: 35,
    location: "F-1-03",
    supplier: "Lubricantes Premium",
    lastInboundDate: "2024-01-05",
    lastOutboundDate: "2024-01-23",
    image:
      "https://images.unsplash.com/photo-1609878146559-bee1e55e0e99?w=200&h=200&fit=crop",
    status: "agotado",
  },
];

const inventoryMovements: InventoryMovement[] = [
  {
    id: "mov_001",
    date: "2024-01-23",
    type: "salida",
    product: "Aceite Mobil 1 Sintético 5W-30",
    quantity: 5,
    reason: "Venta",
    user: "Juan Pérez",
    reference: "VTA-2024-001",
  },
  {
    id: "mov_002",
    date: "2024-01-22",
    type: "salida",
    product: "Filtro de Aire K&N Performance",
    quantity: 2,
    reason: "Venta",
    user: "María González",
    reference: "VTA-2024-002",
  },
  {
    id: "mov_003",
    date: "2024-01-21",
    type: "salida",
    product: "Batería Bosch S4 12V 60Ah",
    quantity: 1,
    reason: "Instalación",
    user: "Carlos López",
    reference: "SRV-2024-015",
  },
  {
    id: "mov_004",
    date: "2024-01-20",
    type: "entrada",
    product: "Pastillas de Freno Cerámicas Bosch",
    quantity: 10,
    reason: "Compra",
    user: "Sistema",
    reference: "CMP-2024-008",
  },
];

// === Page de ruta: ya NO recibe props
export function InventoryPage() {
  const navigate = useNavigate();

  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");
  const [mostrarDialogoAjuste, setMostrarDialogoAjuste] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState<InventoryItem | null>(
    null
  );
  const [ajusteStock, setAjusteStock] = useState({
    tipo: "entrada",
    cantidad: "",
    motivo: "",
  });

  const handleRegresar = () => {
    navigate("/taller");
  };

  const handleIrNuevoProducto = () => {
    navigate("/taller/registro-productos");
  };

  const getEstadoBadge = (estado: InventoryStatus) => {
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

  const getTipoMovimientoIcon = (type: InventoryMovement["type"]) =>
    type === "entrada" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );

  const handleAjusteStock = () => {
    if (!itemSeleccionado || !ajusteStock.cantidad || !ajusteStock.motivo) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    // TODO: aquí iría la llamada al backend para registrar el ajuste
    toast.success(`Stock de ${itemSeleccionado.name} ajustado correctamente`);
    setMostrarDialogoAjuste(false);
    setAjusteStock({ tipo: "entrada", cantidad: "", motivo: "" });
    setItemSeleccionado(null);
  };

  const itemsFiltrados = inventoryItems.filter((item) => {
    const coincideBusqueda =
      item.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.code.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.brand.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      filtroCategoria === "todos" || item.category === filtroCategoria;
    const coincideEstado =
      filtroEstado === "todos" || item.status === filtroEstado;

    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  const alertasStock = inventoryItems.filter(
    (item) =>
      item.status === "agotado" ||
      item.status === "critico" ||
      item.status === "bajo_stock"
  );

  const valorTotalInventario = inventoryItems.reduce(
    (total, item) => total + item.currentStock * item.purchasePrice,
    0
  );

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
              <Package className="h-6 w-6" />
              Gestión de Inventario
            </h1>
            <p className="text-muted-foreground">
              Controla tu stock y movimientos de productos
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleIrNuevoProducto}>
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
                <p className="text-2xl font-bold">{inventoryItems.length}</p>
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
                <p className="text-2xl font-bold text-yellow-600">
                  {alertasStock.length}
                </p>
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
                <p className="text-2xl font-bold">
                  ${valorTotalInventario.toLocaleString()}
                </p>
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
                  {inventoryItems.filter((item) => item.status === "agotado")
                    .length}
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
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {item.currentStock} / Min: {item.minStock}
                    </p>
                  </div>
                  {getEstadoBadge(item.status)}
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
                <Select
                  value={filtroCategoria}
                  onValueChange={setFiltroCategoria}
                >
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
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.brand}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{item.code}</TableCell>
                      <TableCell className="capitalize">
                        {item.category}
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-bold">{item.currentStock}</p>
                          <p className="text-xs text-muted-foreground">
                            Min: {item.minStock} | Max: {item.maxStock}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <div>
                          <p>Compra: ${item.purchasePrice}</p>
                          <p>Venta: ${item.price}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoBadge(item.status)}</TableCell>
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
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500"
                          >
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
                  {inventoryMovements.map((movimiento) => (
                    <TableRow key={movimiento.id}>
                      <TableCell>{movimiento.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTipoMovimientoIcon(movimiento.type)}
                          <span className="capitalize">{movimiento.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{movimiento.product}</TableCell>
                      <TableCell>{movimiento.quantity}</TableCell>
                      <TableCell>{movimiento.reason}</TableCell>
                      <TableCell>{movimiento.user}</TableCell>
                      <TableCell className="font-mono">
                        {movimiento.reference}
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
                <CardTitle>Productos Más Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Reportes de productos más vendidos próximamente...
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Análisis detallado de rotación de inventario próximamente...
                </p>
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
              {itemSeleccionado
                ? `${itemSeleccionado.name} - Stock actual: ${itemSeleccionado.currentStock}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo de movimiento</Label>
              <Select
                value={ajusteStock.tipo}
                onValueChange={(value: "entrada" | "salida") =>
                  setAjusteStock((prev) => ({ ...prev, tipo: value }))
                }
              >
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
                onChange={(e) =>
                  setAjusteStock((prev) => ({
                    ...prev,
                    cantidad: e.target.value,
                  }))
                }
                placeholder="Ingresa la cantidad"
              />
            </div>
            <div>
              <Label>Motivo</Label>
              <Input
                value={ajusteStock.motivo}
                onChange={(e) =>
                  setAjusteStock((prev) => ({
                    ...prev,
                    motivo: e.target.value,
                  }))
                }
                placeholder="Motivo del ajuste"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMostrarDialogoAjuste(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAjusteStock}>Confirmar Ajuste</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
