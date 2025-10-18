import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Switch } from "@/shared/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Users, 
  Shield, 
  Edit, 
  Trash2,
  Eye,
  UserPlus,
  Lock,
  Unlock,
  Settings,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";

interface GestionUsuariosProps {
  onRegresar: () => void;
  onCambiarVista: (vista: string) => void;
}

// Definición de roles y permisos
const roles = {
  admin: {
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema",
    permisos: [
      "gestion_usuarios",
      "gestion_inventario", 
      "gestion_ordenes",
      "gestion_servicios",
      "gestion_productos",
      "reportes_avanzados",
      "configuracion_sistema"
    ]
  },
  gerente: {
    nombre: "Gerente",
    descripcion: "Gestión operativa y supervisión",
    permisos: [
      "gestion_inventario",
      "gestion_ordenes", 
      "gestion_servicios",
      "gestion_productos",
      "reportes_basicos"
    ]
  },
  mecanico: {
    nombre: "Mecánico",
    descripcion: "Servicios y atención al cliente",
    permisos: [
      "consulta_inventario",
      "gestion_servicios",
      "registro_trabajos"
    ]
  },
  vendedor: {
    nombre: "Vendedor",
    descripcion: "Ventas y atención al cliente",
    permisos: [
      "consulta_inventario",
      "gestion_productos",
      "registro_ventas"
    ]
  }
};

const permisos = {
  gestion_usuarios: "Gestión de Usuarios",
  gestion_inventario: "Gestión de Inventario",
  gestion_ordenes: "Gestión de Órdenes",
  gestion_servicios: "Gestión de Servicios",
  gestion_productos: "Gestión de Productos",
  reportes_avanzados: "Reportes Avanzados",
  reportes_basicos: "Reportes Básicos",
  configuracion_sistema: "Configuración del Sistema",
  consulta_inventario: "Consulta de Inventario",
  registro_trabajos: "Registro de Trabajos",
  registro_ventas: "Registro de Ventas"
};

// TODO: llamada a detalles de usuarios
const usuariosTaller = [
  {
    id: "usr_001",
    nombre: "Juan Carlos Pérez",
    email: "juan.perez@automaster.ec",
    telefono: "+593-99-123-4567",
    rol: "admin",
    estado: "activo",
    fechaCreacion: "2024-01-01",
    ultimoAcceso: "2024-01-23",
    avatar: "",
    departamento: "Administración"
  },
  {
    id: "usr_002", 
    nombre: "María González",
    email: "maria.gonzalez@automaster.ec",
    telefono: "+593-98-765-4321",
    rol: "gerente",
    estado: "activo",
    fechaCreacion: "2024-01-05",
    ultimoAcceso: "2024-01-22",
    avatar: "",
    departamento: "Operaciones"
  },
  {
    id: "usr_003",
    nombre: "Carlos López",
    email: "carlos.lopez@automaster.ec", 
    telefono: "+593-97-456-7890",
    rol: "mecanico",
    estado: "activo",
    fechaCreacion: "2024-01-10",
    ultimoAcceso: "2024-01-23",
    avatar: "",
    departamento: "Taller"
  },
  {
    id: "usr_004",
    nombre: "Ana Rodríguez",
    email: "ana.rodriguez@automaster.ec",
    telefono: "+593-96-789-0123",
    rol: "vendedor",
    estado: "inactivo",
    fechaCreacion: "2024-01-15",
    ultimoAcceso: "2024-01-20",
    avatar: "",
    departamento: "Ventas"
  },
  {
    id: "usr_005",
    nombre: "Roberto Silva",
    email: "roberto.silva@automaster.ec",
    telefono: "+593-95-234-5678",
    rol: "mecanico",
    estado: "activo",
    fechaCreacion: "2024-01-18",
    ultimoAcceso: "2024-01-23",
    avatar: "",
    departamento: "Taller"
  }
];

export function UsersPage({ onRegresar, onCambiarVista }: GestionUsuariosProps) {
  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroRol, setFiltroRol] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [mostrarDialogoNuevoUsuario, setMostrarDialogoNuevoUsuario] = useState(false);
  const [mostrarDialogoPermisos, setMostrarDialogoPermisos] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);
  
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "",
    departamento: "",
    password: "",
    confirmPassword: ""
  });

  const getEstadoBadge = (estado: string) => {
    return estado === "activo" ? (
      <Badge className="bg-green-500 text-white">
        <CheckCircle className="h-3 w-3 mr-1" />
        Activo
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Inactivo
      </Badge>
    );
  };

  const getRolBadge = (rol: string) => {
    const roleInfo = roles[rol as keyof typeof roles];
    const colors = {
      admin: "bg-purple-500 text-white",
      gerente: "bg-blue-500 text-white", 
      mecanico: "bg-orange-500 text-white",
      vendedor: "bg-green-500 text-white"
    };
    
    return (
      <Badge className={colors[rol as keyof typeof colors] || "bg-gray-500 text-white"}>
        <Shield className="h-3 w-3 mr-1" />
        {roleInfo?.nombre || rol}
      </Badge>
    );
  };

  const handleCrearUsuario = () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.rol || !nuevoUsuario.password) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (nuevoUsuario.password !== nuevoUsuario.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    toast.success(`Usuario ${nuevoUsuario.nombre} creado exitosamente`);
    setMostrarDialogoNuevoUsuario(false);
    setNuevoUsuario({
      nombre: "",
      email: "",
      telefono: "",
      rol: "",
      departamento: "",
      password: "",
      confirmPassword: ""
    });
  };

  const handleToggleEstado = (usuarioId: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";
    toast.success(`Usuario ${nuevoEstado === "activo" ? "activado" : "desactivado"} correctamente`);
  };

  const usuariosFiltrados = usuariosTaller.filter(usuario => {
    const coincideBusqueda = usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            usuario.email.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideRol = filtroRol === "todos" || usuario.rol === filtroRol;
    const coincideEstado = filtroEstado === "todos" || usuario.estado === filtroEstado;
    
    return coincideBusqueda && coincideRol && coincideEstado;
  });

  const totalUsuarios = usuariosTaller.length;
  const usuariosActivos = usuariosTaller.filter(u => u.estado === "activo").length;
  const usuariosInactivos = usuariosTaller.filter(u => u.estado === "inactivo").length;

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
              <Users className="h-6 w-6" />
              Gestión de Usuarios
            </h1>
            <p className="text-muted-foreground">Administra usuarios y permisos del taller</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setMostrarDialogoNuevoUsuario(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurar Roles
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Usuarios</p>
                <p className="text-2xl font-bold">{totalUsuarios}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                <p className="text-2xl font-bold text-green-600">{usuariosActivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Usuarios Inactivos</p>
                <p className="text-2xl font-bold text-red-600">{usuariosInactivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Roles Definidos</p>
                <p className="text-2xl font-bold">{Object.keys(roles).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usuarios" className="space-y-6">
        <TabsList>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
          <TabsTrigger value="actividad">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios">
          {/* Filtros y búsqueda */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuarios por nombre o email..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filtroRol} onValueChange={setFiltroRol}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los roles</SelectItem>
                    {Object.entries(roles).map(([key, role]) => (
                      <SelectItem key={key} value={key}>{role.nombre}</SelectItem>
                    ))}
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

          {/* Tabla de usuarios */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuariosFiltrados.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={usuario.avatar} />
                            <AvatarFallback>
                              {usuario.nombre.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{usuario.nombre}</p>
                            <p className="text-sm text-muted-foreground">{usuario.telefono}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{getRolBadge(usuario.rol)}</TableCell>
                      <TableCell>{usuario.departamento}</TableCell>
                      <TableCell>{getEstadoBadge(usuario.estado)}</TableCell>
                      <TableCell>{usuario.ultimoAcceso}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setUsuarioSeleccionado(usuario);
                              setMostrarDialogoPermisos(true);
                            }}
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleToggleEstado(usuario.id, usuario.estado)}
                            className={usuario.estado === "activo" ? "text-red-500" : "text-green-500"}
                          >
                            {usuario.estado === "activo" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
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

        <TabsContent value="roles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(roles).map(([key, role]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {role.nombre}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{role.descripcion}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Permisos incluidos:</h4>
                    <div className="space-y-1">
                      {role.permisos.map((permiso) => (
                        <div key={permiso} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{permisos[permiso as keyof typeof permisos]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="actividad">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Juan Carlos Pérez inició sesión</p>
                    <p className="text-xs text-muted-foreground">Hace 2 minutos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">María González actualizó el inventario</p>
                    <p className="text-xs text-muted-foreground">Hace 15 minutos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Carlos López registró un nuevo servicio</p>
                    <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para nuevo usuario */}
      <Dialog open={mostrarDialogoNuevoUsuario} onOpenChange={setMostrarDialogoNuevoUsuario}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Agrega un nuevo usuario al sistema del taller
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre completo *</Label>
                <Input
                  value={nuevoUsuario.nombre}
                  onChange={(e) => setNuevoUsuario(prev => ({...prev, nombre: e.target.value}))}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={nuevoUsuario.email}
                  onChange={(e) => setNuevoUsuario(prev => ({...prev, email: e.target.value}))}
                  placeholder="usuario@automaster.ec"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Teléfono</Label>
                <Input
                  value={nuevoUsuario.telefono}
                  onChange={(e) => setNuevoUsuario(prev => ({...prev, telefono: e.target.value}))}
                  placeholder="+593-99-123-4567"
                />
              </div>
              <div>
                <Label>Departamento</Label>
                <Select value={nuevoUsuario.departamento} onValueChange={(value: any) => setNuevoUsuario(prev => ({...prev, departamento: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administracion">Administración</SelectItem>
                    <SelectItem value="operaciones">Operaciones</SelectItem>
                    <SelectItem value="taller">Taller</SelectItem>
                    <SelectItem value="ventas">Ventas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Rol *</Label>
              <Select value={nuevoUsuario.rol} onValueChange={(value: any) => setNuevoUsuario(prev => ({...prev, rol: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona rol" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roles).map(([key, role]) => (
                    <SelectItem key={key} value={key}>{role.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contraseña *</Label>
                <Input
                  type="password"
                  value={nuevoUsuario.password}
                  onChange={(e) => setNuevoUsuario(prev => ({...prev, password: e.target.value}))}
                  placeholder="Contraseña segura"
                />
              </div>
              <div>
                <Label>Confirmar contraseña *</Label>
                <Input
                  type="password"
                  value={nuevoUsuario.confirmPassword}
                  onChange={(e) => setNuevoUsuario(prev => ({...prev, confirmPassword: e.target.value}))}
                  placeholder="Confirma la contraseña"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMostrarDialogoNuevoUsuario(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCrearUsuario}>
                Crear Usuario
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para permisos de usuario */}
      <Dialog open={mostrarDialogoPermisos} onOpenChange={setMostrarDialogoPermisos}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Permisos de Usuario</DialogTitle>
            <DialogDescription>
              {usuarioSeleccionado?.nombre} - {usuarioSeleccionado && getRolBadge(usuarioSeleccionado.rol)}
            </DialogDescription>
          </DialogHeader>
          {usuarioSeleccionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(permisos).map(([key, nombre]) => {
                  const tienePermiso = roles[usuarioSeleccionado.rol as keyof typeof roles]?.permisos.includes(key);
                  return (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{nombre}</p>
                        <p className="text-sm text-muted-foreground">Permiso: {key}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {tienePermiso ? (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Permitido
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Denegado
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}