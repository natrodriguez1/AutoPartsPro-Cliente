import { useState } from "react";
import { useCart } from "../store/cart.store";
import type { SearchProduct } from "@/features/catalog/types/product";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  Tag,
  Search,
  Heart,
  Undo,
  X
} from "lucide-react";
import { ImageWithFallback } from "@/shared/components/ImageWithFallback";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

// Productos adicionales para búsqueda
const productosDisponibles: SearchProduct[] = [
  {
    id: "new1",
    name: "Filtro de Aire K&N Performance",
    price: 45,
    originalPrice: 65,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=500&fit=crop",
    category: "engine",
    isSale: true,
    salePercentage: 30
  },
  {
    id: "new2", 
    name: "Amortiguadores Monroe Gas-Matic",
    price: 180,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop",
    category: "suspension"
  },
  {
    id: "new3",
    name: "Batería Bosch S4 12V 60Ah",
    price: 120,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
    category: "electrical"
  },
  {
    id: "new4",
    name: "Kit de Embrague Valeo",
    price: 280,
    originalPrice: 350,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=500&fit=crop",
    category: "transmission",
    isSale: true,
    salePercentage: 20
  }
];

export function CartPage() {
  const navigate = useNavigate();

  const items = useCart((s) => s.items);

  const wishlistItems = useCart((s) => s.wishlistItems);
  const itemsEliminados = useCart((s) => s.itemsEliminados);

  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);
  const restore = useCart((s) => s.restore);
  const updateQty = useCart((s) => s.updateQty);
  const toggleWishlist = useCart((s) => s.toggleWishlist);

  const onRegresar = () => navigate(-1);
  const onIrCheckout = () => navigate("/checkout");

  const [codigoDescuento, setCodigoDescuento] = useState("");
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [tabActiva, setTabActiva] = useState("carrito");

  const actualizarCantidad = (id: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      remove(id);
      return;
    }

    updateQty(id, nuevaCantidad);
  };

  const aplicarDescuento = () => {
    if (codigoDescuento.toLowerCase() === "autoparts10") {
      setDescuentoAplicado(10);
      toast.success("¡Descuento del 10% aplicado!");
    } else if (codigoDescuento.toLowerCase() === "taller15") {
      setDescuentoAplicado(15);
      toast.success("¡Descuento del 15% para talleres aplicado!");
    } else if (codigoDescuento.toLowerCase() === "nuevo20") {
      setDescuentoAplicado(20);
      toast.success("¡Descuento del 20% para nuevos usuarios aplicado!");
    } else {
      toast.error("Código de descuento inválido");
    }
  };

  const productosFiltrados = productosDisponibles.filter(producto =>
    producto.name.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  const subtotal = items.reduce((total, item) => total + (item.price * item.cantidad), 0);
  const descuento = (subtotal * descuentoAplicado) / 100;
  const envio = subtotal > 100 ? 0 : 15;
  const total = subtotal - descuento + envio;

  if (items.length === 0 && wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onRegresar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1>Mi Carrito</h1>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
            <p className="text-muted-foreground mb-4">
              Agrega algunos repuestos para continuar
            </p>
            <Button onClick={onRegresar}>
              Continuar Comprando
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onRegresar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continuar Comprando
        </Button>
        <h1>Mi Carrito</h1>
      </div>

      {/* Notificaciones de items eliminados */}
      <AnimatePresence>
        {itemsEliminados.map((item) => (
          <motion.div
            key={`eliminated-${item.id}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="mb-4"
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">
                      <strong>{item.name}</strong> fue eliminado del carrito
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => restore(item.id)}
                    >
                      <Undo className="h-3 w-3 mr-1" />
                      Deshacer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          <Tabs value={tabActiva} onValueChange={setTabActiva}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="carrito">
                Carrito ({items.length})
              </TabsTrigger>
              <TabsTrigger value="wishlist">
                <Heart className="h-4 w-4 mr-2" />
                Favoritos ({wishlistItems.length})
              </TabsTrigger>
              <TabsTrigger value="buscar">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="carrito" className="mt-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 flex-shrink-0">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-2">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold">${item.price}</span>
                              {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                              {item.isSale && (
                                <Badge variant="destructive" className="text-xs">
                                  -{item.salePercentage}%
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.cantidad}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-medium">${(item.price * item.cantidad).toFixed(2)}</p>
                            </div>
                            
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleWishlist(item)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wishlist" className="mt-6">
              <div className="space-y-4">
                {wishlistItems.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-medium mb-2">Tu lista de deseos está vacía</h3>
                      <p className="text-muted-foreground text-sm">
                        Agrega productos a favoritos para verlos aquí
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  wishlistItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 flex-shrink-0">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-2">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold">${item.price}</span>
                              {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                              {item.isSale && (
                                <Badge variant="destructive" className="text-xs">
                                  -{item.salePercentage}%
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              onClick={() => add(item)}
                            >
                              Agregar al Carrito
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleWishlist(item)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="buscar" className="mt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar más productos..."
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-4">
                  {productosFiltrados.map((producto) => (
                    <Card key={producto.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 flex-shrink-0">
                            <ImageWithFallback
                              src={producto.image}
                              alt={producto.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-2">{producto.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold">${producto.price}</span>
                              {producto.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${producto.originalPrice}
                                </span>
                              )}
                              {producto.isSale && (
                                <Badge variant="destructive" className="text-xs">
                                  -{producto.salePercentage}%
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                add(producto);
                                toast.success(`${producto.name} agregado al carrito`);
                              }}
                            >
                              Agregar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleWishlist(producto)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {busquedaProducto && productosFiltrados.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-medium mb-2">No se encontraron productos</h3>
                        <p className="text-muted-foreground text-sm">
                          Intenta con otros términos de búsqueda
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel lateral - Solo visible si hay items */}
        {items.length > 0 && (
          <div className="space-y-4">
            {/* Código de descuento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Código de Descuento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ingresa código"
                    value={codigoDescuento}
                    onChange={(e) => setCodigoDescuento(e.target.value)}
                  />
                  <Button onClick={aplicarDescuento} variant="outline">
                    Aplicar
                  </Button>
                </div>
                {descuentoAplicado > 0 && (
                  <div className="text-sm text-green-600">
                    ✓ Descuento del {descuentoAplicado}% aplicado
                  </div>
                )}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Códigos disponibles:</p>
                  <p>• "autoparts10" - 10% descuento</p>
                  <p>• "taller15" - 15% descuento</p>
                  <p>• "nuevo20" - 20% nuevos usuarios</p>
                </div>
              </CardContent>
            </Card>

            {/* Resumen */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} productos)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {descuentoAplicado > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({descuentoAplicado}%)</span>
                    <span>-${descuento.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>
                    {envio === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      `$${envio.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button onClick={onIrCheckout} className="w-full mt-4">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceder al Pago
                </Button>
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span>Envío gratis en compras +$100</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Garantía en todos los productos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                  <span>Pago seguro y protegido</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}