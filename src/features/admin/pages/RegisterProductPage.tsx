import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Checkbox } from "@/shared/ui/checkbox";
import { Separator } from "@/shared/ui/separator";
import { Badge } from "@/shared/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  Upload,
  Package,
  Tag,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

interface RegistroProductosProps {
  onRegresar: () => void;
  onCambiarVista: (vista: string) => void;
}

export function RegisterProductPage({ onRegresar, onCambiarVista }: RegistroProductosProps) {
  const [producto, setProducto] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
    marca: "",
    descripcion: "",
    precioCompra: "",
    precioVenta: "",
    stockInicial: "",
    stockMinimo: "",
    stockMaximo: "",
    ubicacion: "",
    proveedor: "",
    compatibility: [] as string[],
    images: [] as string[],
    isNew: false,
    isSale: false,
    salePercentage: ""
  });

  const [nuevaCompatibilidad, setNuevaCompatibilidad] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState("");

  const categorias = [
    { value: "frenos", label: "Frenos y Sistema de Frenado" },
    { value: "motor", label: "Motor y Componentes" },
    { value: "neumaticos", label: "Neumáticos y Llantas" },
    { value: "suspension", label: "Suspensión y Dirección" },
    { value: "electrico", label: "Sistema Eléctrico" },
    { value: "transmision", label: "Transmisión y Embrague" },
    { value: "accesorios", label: "Accesorios y Confort" },
    { value: "herramientas", label: "Herramientas y Equipos" }
  ];

  const marcas = [
    "Bosch", "Brembo", "Castrol", "K&N", "Mobil 1", "NGK", "Gates", 
    "Michelin", "Bridgestone", "Monroe", "Eibach", "Philips", "Valeo", 
    "WeatherTech", "Anker", "Truper", "Stanley"
  ];

  const proveedores = [
    "Distribuidora AutoParts",
    "Repuestos Premium", 
    "SuspensionPro",
    "LlantaCenter",
    "Lubricantes Premium"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!producto.nombre || !producto.codigo || !producto.categoria || !producto.marca) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    toast.success(`Producto "${producto.nombre}" registrado exitosamente`);
    onRegresar();
  };

  const agregarCompatibilidad = () => {
    if (nuevaCompatibilidad && !producto.compatibility.includes(nuevaCompatibilidad)) {
      setProducto(prev => ({
        ...prev,
        compatibility: [...prev.compatibility, nuevaCompatibilidad]
      }));
      setNuevaCompatibilidad("");
    }
  };

  const eliminarCompatibilidad = (item: string) => {
    setProducto(prev => ({
      ...prev,
      compatibility: prev.compatibility.filter(c => c !== item)
    }));
  };

  const agregarImagen = () => {
    if (nuevaImagen && !producto.images.includes(nuevaImagen)) {
      setProducto(prev => ({
        ...prev,
        images: [...prev.images, nuevaImagen]
      }));
      setNuevaImagen("");
    }
  };

  const eliminarImagen = (url: string) => {
    setProducto(prev => ({
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
          Volver al Inventario
        </Button>
        <div>
          <h1 className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Registrar Nuevo Producto
          </h1>
          <p className="text-muted-foreground">Agrega un nuevo producto al inventario</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información básica */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Información del Producto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del producto *</Label>
                    <Input
                      id="nombre"
                      value={producto.nombre}
                      onChange={(e) => setProducto(prev => ({...prev, nombre: e.target.value}))}
                      placeholder="Ej: Pastillas de freno cerámicas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="codigo">Código interno *</Label>
                    <Input
                      id="codigo"
                      value={producto.codigo}
                      onChange={(e) => setProducto(prev => ({...prev, codigo: e.target.value}))}
                      placeholder="Ej: BRK-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoria">Categoría *</Label>
                    <Select value={producto.categoria} onValueChange={(value: any) => setProducto(prev => ({...prev, categoria: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="marca">Marca *</Label>
                    <Select value={producto.marca} onValueChange={(value: any) => setProducto(prev => ({...prev, marca: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {marcas.map((marca) => (
                          <SelectItem key={marca} value={marca.toLowerCase()}>
                            {marca}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={producto.descripcion}
                    onChange={(e) => setProducto(prev => ({...prev, descripcion: e.target.value}))}
                    placeholder="Descripción detallada del producto..."
                    rows={3}
                  />
                </div>

                <Separator />

                {/* Precios e inventario */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="precio-compra">Precio de compra</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="precio-compra"
                        type="number"
                        value={producto.precioCompra}
                        onChange={(e) => setProducto(prev => ({...prev, precioCompra: e.target.value}))}
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="precio-venta">Precio de venta</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="precio-venta"
                        type="number"
                        value={producto.precioVenta}
                        onChange={(e) => setProducto(prev => ({...prev, precioVenta: e.target.value}))}
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <Input
                      id="ubicacion"
                      value={producto.ubicacion}
                      onChange={(e) => setProducto(prev => ({...prev, ubicacion: e.target.value}))}
                      placeholder="Ej: A-1-01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stock-inicial">Stock inicial</Label>
                    <Input
                      id="stock-inicial"
                      type="number"
                      value={producto.stockInicial}
                      onChange={(e) => setProducto(prev => ({...prev, stockInicial: e.target.value}))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock-minimo">Stock mínimo</Label>
                    <Input
                      id="stock-minimo"
                      type="number"
                      value={producto.stockMinimo}
                      onChange={(e) => setProducto(prev => ({...prev, stockMinimo: e.target.value}))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock-maximo">Stock máximo</Label>
                    <Input
                      id="stock-maximo"
                      type="number"
                      value={producto.stockMaximo}
                      onChange={(e) => setProducto(prev => ({...prev, stockMaximo: e.target.value}))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="proveedor">Proveedor</Label>
                  <Select value={producto.proveedor} onValueChange={(value: any) => setProducto(prev => ({...prev, proveedor: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {proveedores.map((proveedor) => (
                        <SelectItem key={proveedor} value={proveedor}>
                          {proveedor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Compatibilidad */}
            <Card>
              <CardHeader>
                <CardTitle>Compatibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={nuevaCompatibilidad}
                      onChange={(e) => setNuevaCompatibilidad(e.target.value)}
                      placeholder="Ej: Honda, Toyota..."
                      className="flex-1"
                    />
                    <Button type="button" size="sm" onClick={agregarCompatibilidad}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {producto.compatibility.map((item) => (
                      <Badge key={item} variant="outline" className="flex items-center gap-1">
                        {item}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => eliminarCompatibilidad(item)}
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
                    {producto.images.map((url, index) => (
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
                    id="is-new"
                    checked={producto.isNew}
                    onCheckedChange={(checked: any) => setProducto(prev => ({...prev, isNew: checked as boolean}))}
                  />
                  <Label htmlFor="is-new">Producto nuevo</Label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-sale"
                      checked={producto.isSale}
                      onCheckedChange={(checked: any) => setProducto(prev => ({...prev, isSale: checked as boolean}))}
                    />
                    <Label htmlFor="is-sale">En oferta</Label>
                  </div>
                  {producto.isSale && (
                    <Input
                      type="number"
                      value={producto.salePercentage}
                      onChange={(e) => setProducto(prev => ({...prev, salePercentage: e.target.value}))}
                      placeholder="% de descuento"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Guardar Producto
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