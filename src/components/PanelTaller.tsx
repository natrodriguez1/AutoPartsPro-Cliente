import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  DollarSign, 
  Calendar,
  MessageCircle,
  ArrowUpRight,
  Clock,
  Settings,
  ShoppingCart,
  FileText,
  Wrench,
  Shield
} from "lucide-react";

// Datos mock para el dashboard
const ventasPorMes = [
  { mes: "Ene", ventas: 12000, piezas: 45 },
  { mes: "Feb", ventas: 15000, piezas: 52 },
  { mes: "Mar", ventas: 18000, piezas: 68 },
  { mes: "Abr", ventas: 22000, piezas: 74 },
  { mes: "May", ventas: 19000, piezas: 61 },
  { mes: "Jun", ventas: 25000, piezas: 89 },
];

const categoriasMasVendidas = [
  { categoria: "Frenos", valor: 35, color: "#8884d8" },
  { categoria: "Motor", valor: 25, color: "#82ca9d" },
  { categoria: "Neumáticos", valor: 20, color: "#ffc658" },
  { categoria: "Suspensión", valor: 12, color: "#ff7c7c" },
  { categoria: "Otros", valor: 8, color: "#8dd1e1" },
];

const talleresCercanos = [
  { id: "1", nombre: "AutoMaster", distancia: "2.3 km", rating: 4.8, especialidad: "Motor" },
  { id: "2", nombre: "TallerPro", distancia: "3.1 km", rating: 4.6, especialidad: "Frenos" },
  { id: "3", nombre: "MecánicaTotal", distancia: "4.5 km", rating: 4.7, especialidad: "Suspensión" },
  { id: "4", nombre: "AutoExpress", distancia: "5.2 km", rating: 4.5, especialidad: "Neumáticos" },
];



interface PanelTallerProps {
  onCambiarVista: (vista: string) => void;
  onAgregarCarrito?: (producto: any) => void;
  onVerPerfil?: (taller: any) => void;
  onIniciarChat?: (taller: any) => void;
}

export function PanelTaller({ onCambiarVista, onAgregarCarrito, onVerPerfil, onIniciarChat }: PanelTallerProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1>Panel de Control - Taller</h1>
        <p className="text-muted-foreground">
          Gestiona tu negocio y conecta con otros talleres de la red
        </p>
      </div>

      {/* Accesos rápidos a gestión */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gestión del Taller
          </CardTitle>
          <CardDescription>
            Accesos rápidos a las herramientas de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex flex-col gap-2 p-4"
              onClick={() => onCambiarVista("inventario")}
            >
              <Package className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">Inventario</div>
                <div className="text-xs text-muted-foreground">Productos y stock</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto flex flex-col gap-2 p-4"
              onClick={() => onCambiarVista("ordenes")}
            >
              <ShoppingCart className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">Órdenes</div>
                <div className="text-xs text-muted-foreground">Pedidos de clientes</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto flex flex-col gap-2 p-4"
              onClick={() => onCambiarVista("gestion-usuarios")}
            >
              <Users className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">Usuarios</div>
                <div className="text-xs text-muted-foreground">Roles y permisos</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto flex flex-col gap-2 p-4"
              onClick={() => onCambiarVista("servicios")}
            >
              <Wrench className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">Servicios</div>
                <div className="text-xs text-muted-foreground">Catálogo de servicios</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="red">Red de Talleres</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$25,000</div>
                <p className="text-xs text-muted-foreground">
                  <span className="inline-flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12%
                  </span>
                  vs mes anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Piezas Vendidas</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  <span className="inline-flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8%
                  </span>
                  vs mes anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">
                  <span className="inline-flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15%
                  </span>
                  vs mes anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Servicios Completados</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">
                  <span className="inline-flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18%
                  </span>
                  vs mes anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ventas Mensuales</CardTitle>
                <CardDescription>Evolución de ventas e inventario</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ventasPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ventas" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categorías Más Vendidas</CardTitle>
                <CardDescription>Distribución por tipo de repuesto</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoriasMasVendidas}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valor"
                      label={({ categoria, valor }) => `${categoria} ${valor}%`}
                    >
                      {categoriasMasVendidas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="red" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Talleres Cercanos</CardTitle>
              <CardDescription>
                Conecta con otros talleres de tu zona para intercambiar piezas y servicios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {talleresCercanos.map((taller) => (
                  <div key={taller.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{taller.nombre}</h4>
                        <p className="text-sm text-muted-foreground">
                          {taller.distancia} • Especialidad: {taller.especialidad}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-sm">★ {taller.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onIniciarChat?.(taller)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contactar
                      </Button>
                      <Button size="sm" onClick={() => onVerPerfil?.(taller)}>
                        Ver Perfil
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  );
}