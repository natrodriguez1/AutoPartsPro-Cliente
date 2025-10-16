import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X,
  Wrench,
  Clock,
  DollarSign,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface RegistroServiciosProps {
  onRegresar: () => void;
  onCambiarVista: (vista: string) => void;
}

export function RegistroServicios({ onRegresar, onCambiarVista }: RegistroServiciosProps) {
  const [servicio, setServicio] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    precio: "",
    precioOriginal: "",
    duracion: "",
    especialidad: "",
    incluye: [] as string[],
    requisitos: [] as string[],
    images: [] as string[],
    isPromoted: false,
    isUrgent: false,
    garantia: ""
  });

  const [nuevoIncluye, setNuevoIncluye] = useState("");
  const [nuevoRequisito, setNuevoRequisito] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState("");

  const categoriasServicios = [
    { value: "mantenimiento", label: "Mantenimiento Preventivo" },
    { value: "diagnostico", label: "Diagnóstico y Revisión" },
    { value: "frenos", label: "Servicios de Frenos" },
    { value: "suspension", label: "Suspensión y Alineación" },
    { value: "transmision", label: "Transmisión y Embrague" },
    { value: "electrico", label: "Sistema Eléctrico" },
    { value: "revision", label: "Inspección Técnica" },
    { value: "climatizacion", label: "Aire Acondicionado" },
    { value: "emergencia", label: "Servicios de Emergencia" }
  ];

  const especialidades = [
    "Mantenimiento Preventivo",
    "Diagnóstico Electrónico",
    "Sistema de Frenos",
    "Suspensión y Dirección",
    "Transmisión Manual y Automática",
    "Inspección Vehicular",
    "Aire Acondicionado",
    "Sistema Eléctrico"
  ];

  const duracionesComunes = [
    "15 min", "30 min", "45 min", "60 min", "90 min", "120 min", "3 horas", "4 horas", "Todo el día"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!servicio.nombre || !servicio.categoria || !servicio.precio || !servicio.duracion) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    toast.success(`Servicio "${servicio.nombre}" registrado exitosamente`);
    onRegresar();
  };

  const agregarIncluye = () => {
    if (nuevoIncluye && !servicio.incluye.includes(nuevoIncluye)) {
      setServicio(prev => ({
        ...prev,
        incluye: [...prev.incluye, nuevoIncluye]
      }));
      setNuevoIncluye("");
    }
  };

  const eliminarIncluye = (item: string) => {
    setServicio(prev => ({
      ...prev,
      incluye: prev.incluye.filter(i => i !== item)
    }));
  };

  const agregarRequisito = () => {
    if (nuevoRequisito && !servicio.requisitos.includes(nuevoRequisito)) {
      setServicio(prev => ({
        ...prev,
        requisitos: [...prev.requisitos, nuevoRequisito]
      }));
      setNuevoRequisito("");
    }
  };

  const eliminarRequisito = (item: string) => {
    setServicio(prev => ({
      ...prev,
      requisitos: prev.requisitos.filter(r => r !== item)
    }));
  };

  const agregarImagen = () => {
    if (nuevaImagen && !servicio.images.includes(nuevaImagen)) {
      setServicio(prev => ({
        ...prev,
        images: [...prev.images, nuevaImagen]
      }));
      setNuevaImagen("");
    }
  };

  const eliminarImagen = (url: string) => {
    setServicio(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onRegresar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Panel
        </Button>
        <div>
          <h1 className="flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            Registrar Nuevo Servicio
          </h1>
          <p className="text-muted-foreground">Agrega un nuevo servicio a tu catálogo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información básica */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Información del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del servicio *</Label>
                    <Input
                      id="nombre"
                      value={servicio.nombre}
                      onChange={(e) => setServicio(prev => ({...prev, nombre: e.target.value}))}
                      placeholder="Ej: Cambio de aceite premium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoría *</Label>
                    <Select value={servicio.categoria} onValueChange={(value) => setServicio(prev => ({...prev, categoria: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriasServicios.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="especialidad">Especialidad</Label>
                    <Select value={servicio.especialidad} onValueChange={(value) => setServicio(prev => ({...prev, especialidad: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {especialidades.map((esp) => (
                          <SelectItem key={esp} value={esp}>
                            {esp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duracion">Duración estimada *</Label>
                    <Select value={servicio.duracion} onValueChange={(value) => setServicio(prev => ({...prev, duracion: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona duración" />
                      </SelectTrigger>
                      <SelectContent>
                        {duracionesComunes.map((duracion) => (
                          <SelectItem key={duracion} value={duracion}>
                            {duracion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción del servicio</Label>
                  <Textarea
                    id="descripcion"
                    value={servicio.descripcion}
                    onChange={(e) => setServicio(prev => ({...prev, descripcion: e.target.value}))}
                    placeholder="Describe en detalle qué incluye este servicio..."
                    rows={4}
                  />
                </div>

                <Separator />

                {/* Precios y garantía */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="precio">Precio del servicio *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="precio"
                        type="number"
                        value={servicio.precio}
                        onChange={(e) => setServicio(prev => ({...prev, precio: e.target.value}))}
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="precio-original">Precio original (si está en oferta)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="precio-original"
                        type="number"
                        value={servicio.precioOriginal}
                        onChange={(e) => setServicio(prev => ({...prev, precioOriginal: e.target.value}))}
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="garantia">Garantía</Label>
                    <Input
                      id="garantia"
                      value={servicio.garantia}
                      onChange={(e) => setServicio(prev => ({...prev, garantia: e.target.value}))}
                      placeholder="Ej: 30 días, 6 meses..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Lo que incluye */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  ¿Qué incluye?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={nuevoIncluye}
                      onChange={(e) => setNuevoIncluye(e.target.value)}
                      placeholder="Ej: Mano de obra"
                      className="flex-1"
                    />
                    <Button type="button" size="sm" onClick={agregarIncluye}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {servicio.incluye.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span className="flex-1">{item}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarIncluye(item)}
                          className="text-red-500 hover:text-red-700 h-auto p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requisitos */}
            <Card>
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={nuevoRequisito}
                      onChange={(e) => setNuevoRequisito(e.target.value)}
                      placeholder="Ej: Vehículo limpio"
                      className="flex-1"
                    />
                    <Button type="button" size="sm" onClick={agregarRequisito}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {servicio.requisitos.map((item, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {item}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => eliminarRequisito(item)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Imágenes */}
            <Card>
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={nuevaImagen}
                      onChange={(e) => setNuevaImagen(e.target.value)}
                      placeholder="URL de la imagen"
                      className="flex-1"
                    />
                    <Button type="button" size="sm" onClick={agregarImagen}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {servicio.images.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 truncate">Imagen {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarImagen(url)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuraciones especiales */}
            <Card>
              <CardHeader>
                <CardTitle>Configuraciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-promoted"
                    checked={servicio.isPromoted}
                    onCheckedChange={(checked) => setServicio(prev => ({...prev, isPromoted: checked as boolean}))}
                  />
                  <Label htmlFor="is-promoted">Servicio promocionado</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-urgent"
                    checked={servicio.isUrgent}
                    onCheckedChange={(checked) => setServicio(prev => ({...prev, isUrgent: checked as boolean}))}
                  />
                  <Label htmlFor="is-urgent">Servicio express</Label>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Guardar Servicio
              </Button>
              <Button type="button" variant="outline" onClick={onRegresar} className="w-full">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}