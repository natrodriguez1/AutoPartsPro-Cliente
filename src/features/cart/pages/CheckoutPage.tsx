import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Checkbox } from "@/shared/ui/checkbox";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Shield, 
  Truck,
  Check,
  Plus,
  Edit,
  Lock
} from "lucide-react";
import { ImageWithFallback } from "@/shared/components/ImageWithFallback";
import { toast } from "sonner";
import { motion } from "motion/react";

interface CheckoutProps {
  items: any[];
  onRegresar: () => void;
  onCompletado: () => void;
}

const direccionesGuardadas = [
  {
    id: "1",
    tipo: "Casa",
    nombre: "Juan Pérez",
    direccion: "Av. Amazonas N24-03 y Colón",
    ciudad: "Quito",
    provincia: "Pichincha",
    codigoPostal: "170143",
    telefono: "+593 99 123 4567",
    principal: true
  },
  {
    id: "2",
    tipo: "Oficina",
    nombre: "Juan Pérez",
    direccion: "Av. Francisco de Orellana, Centro Comercial Mall del Sol",
    ciudad: "Guayaquil",
    provincia: "Guayas",
    codigoPostal: "090313",
    telefono: "+593 99 876 5432",
    principal: false
  }
];

const tarjetasGuardadas = [
  {
    id: "1",
    tipo: "VISA",
    ultimos4: "4242",
    expiracion: "12/28",
    titular: "JUAN PEREZ",
    principal: true
  },
  {
    id: "2",
    tipo: "MASTERCARD",
    ultimos4: "8888",
    expiracion: "06/27",
    titular: "JUAN PEREZ",
    principal: false
  }
];

export function CheckoutPage({ items, onRegresar, onCompletado }: CheckoutProps) {
  const [pasoActual, setPasoActual] = useState(1);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("1");
  const [metodoEnvio, setMetodoEnvio] = useState("standard");
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState("1");
  const [procesando, setProcesando] = useState(false);
  
  // Estados para nueva tarjeta
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [cvv, setCvv] = useState("");
  const [nombreTitular, setNombreTitular] = useState("");
  const [guardarTarjeta, setGuardarTarjeta] = useState(false);

  const subtotal = items.reduce((total, item) => total + (item.price * item.cantidad), 0);
  const costoEnvio = metodoEnvio === "express" ? 25 : (subtotal > 100 ? 0 : 15);
  const total = subtotal + costoEnvio;

  const direccionActual = direccionesGuardadas.find(d => d.id === direccionSeleccionada);

  const procesarPago = async () => {
    setProcesando(true);
    
    // Simular procesamiento de pago
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success("¡Pago procesado exitosamente!");
      toast.success("Recibirás confirmación por email");
      
      setTimeout(() => {
        onCompletado();
      }, 1000);
      
    } catch (error) {
      toast.error("Error al procesar el pago");
      setProcesando(false);
    }
  };

  const formatearNumeroTarjeta = (numero: string) => {
    const limpio = numero.replace(/\s/g, '');
    const grupos = limpio.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : limpio;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onRegresar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Carrito
        </Button>
        <h1>Finalizar Compra</h1>
      </div>

      {/* Indicador de pasos */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((paso) => (
            <div key={paso} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                paso <= pasoActual
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-muted text-muted-foreground"
              }`}>
                {paso < pasoActual ? <Check className="h-5 w-5" /> : paso}
              </div>
              {paso < 4 && (
                <div className={`w-16 h-0.5 ml-4 ${
                  paso < pasoActual ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Paso 1: Dirección de envío */}
          {pasoActual === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Dirección de Envío
                  </CardTitle>
                  <CardDescription>
                    Selecciona donde quieres recibir tu pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={direccionSeleccionada} onValueChange={setDireccionSeleccionada}>
                    {direccionesGuardadas.map((direccion) => (
                      <div key={direccion.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value={direccion.id} id={direccion.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={direccion.id} className="font-medium">
                              {direccion.tipo}
                            </Label>
                            {direccion.principal && (
                              <Badge variant="secondary" className="text-xs">Principal</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {direccion.nombre}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {direccion.direccion}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {direccion.ciudad}, {direccion.provincia} {direccion.codigoPostal}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {direccion.telefono}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </RadioGroup>

                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Nueva Dirección
                  </Button>

                  <div className="flex justify-end">
                    <Button onClick={() => setPasoActual(2)}>
                      Continuar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 2: Método de envío */}
          {pasoActual === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Método de Envío
                  </CardTitle>
                  <CardDescription>
                    Elige cómo quieres recibir tu pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={metodoEnvio} onValueChange={setMetodoEnvio}>
                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="standard" id="standard" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="standard" className="font-medium">
                          Envío Estándar
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Entrega en 3-5 días hábiles
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {subtotal > 100 ? "GRATIS" : "$15.00"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="express" id="express" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="express" className="font-medium">
                          Envío Express
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Entrega en 1-2 días hábiles
                        </p>
                        <p className="text-sm text-muted-foreground">
                          $25.00
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="pickup" className="font-medium">
                          Recoger en Tienda
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Disponible en 1-2 días hábiles
                        </p>
                        <p className="text-sm text-muted-foreground">
                          GRATIS
                        </p>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setPasoActual(1)}>
                      Atrás
                    </Button>
                    <Button onClick={() => setPasoActual(3)}>
                      Continuar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 3: Método de pago */}
          {pasoActual === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Método de Pago
                  </CardTitle>
                  <CardDescription>
                    Selecciona cómo quieres pagar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={metodoPago} onValueChange={setMetodoPago}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tarjeta">Tarjeta</TabsTrigger>
                      <TabsTrigger value="transferencia">Transferencia</TabsTrigger>
                      <TabsTrigger value="efectivo">Efectivo</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tarjeta" className="space-y-4 mt-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Tarjetas Guardadas</h4>
                        <RadioGroup value={tarjetaSeleccionada} onValueChange={setTarjetaSeleccionada}>
                          {tarjetasGuardadas.map((tarjeta) => (
                            <div key={tarjeta.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                              <RadioGroupItem value={tarjeta.id} id={tarjeta.id} />
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold ${
                                  tarjeta.tipo === "VISA" ? "bg-gradient-to-r from-blue-600 to-blue-800" :
                                  "bg-gradient-to-r from-red-600 to-orange-600"
                                }`}>
                                  {tarjeta.tipo === "VISA" ? "VISA" : "MC"}
                                </div>
                                <div>
                                  <p className="font-medium">**** **** **** {tarjeta.ultimos4}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Expira {tarjeta.expiracion} • {tarjeta.titular}
                                  </p>
                                </div>
                              </div>
                              {tarjeta.principal && (
                                <Badge variant="secondary" className="text-xs">Principal</Badge>
                              )}
                            </div>
                          ))}
                        </RadioGroup>

                        <Separator />

                        <div className="space-y-4">
                          <h4 className="font-medium">Nueva Tarjeta</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label htmlFor="numero">Número de tarjeta</Label>
                              <Input
                                id="numero"
                                placeholder="1234 5678 9012 3456"
                                value={formatearNumeroTarjeta(numeroTarjeta)}
                                onChange={(e) => setNumeroTarjeta(e.target.value.replace(/\s/g, ''))}
                                maxLength={19}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiracion">MM/AA</Label>
                                <Input
                                  id="expiracion"
                                  placeholder="12/28"
                                  value={fechaExpiracion}
                                  onChange={(e) => setFechaExpiracion(e.target.value)}
                                  maxLength={5}
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  id="cvv"
                                  placeholder="123"
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value)}
                                  maxLength={4}
                                  type="password"
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="titular">Nombre del titular</Label>
                              <Input
                                id="titular"
                                placeholder="Como aparece en la tarjeta"
                                value={nombreTitular}
                                onChange={(e) => setNombreTitular(e.target.value)}
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="guardar"
                                checked={guardarTarjeta}
                                onCheckedChange={setGuardarTarjeta}
                              />
                              <Label htmlFor="guardar" className="text-sm">
                                Guardar esta tarjeta para futuras compras
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="transferencia" className="space-y-4 mt-6">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Transferencia Bancaria</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Realiza tu transferencia a la siguiente cuenta:
                        </p>
                        <div className="space-y-2 text-sm">
                          <p><strong>Banco:</strong> Banco Pichincha</p>
                          <p><strong>Cuenta:</strong> 2100123456</p>
                          <p><strong>RUC:</strong> 1792146739001</p>
                          <p><strong>Beneficiario:</strong> AutoParts Pro S.A.</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="efectivo" className="space-y-4 mt-6">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Pago Contraentrega</h4>
                        <p className="text-sm text-muted-foreground">
                          Paga en efectivo cuando recibas tu pedido. 
                          Solo disponible para pedidos menores a $500.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setPasoActual(2)}>
                      Atrás
                    </Button>
                    <Button onClick={() => setPasoActual(4)}>
                      Continuar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Paso 4: Confirmación */}
          {pasoActual === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Confirmar Pedido
                  </CardTitle>
                  <CardDescription>
                    Revisa todos los detalles antes de finalizar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resumen de envío */}
                  <div>
                    <h4 className="font-medium mb-2">Dirección de Envío</h4>
                    <div className="p-3 bg-muted/50 rounded">
                      <p className="font-medium">{direccionActual?.tipo}</p>
                      <p className="text-sm">{direccionActual?.nombre}</p>
                      <p className="text-sm">{direccionActual?.direccion}</p>
                      <p className="text-sm">{direccionActual?.ciudad}, {direccionActual?.provincia}</p>
                    </div>
                  </div>

                  {/* Método de envío */}
                  <div>
                    <h4 className="font-medium mb-2">Método de Envío</h4>
                    <p className="text-sm text-muted-foreground">
                      {metodoEnvio === "standard" && "Envío Estándar (3-5 días)"}
                      {metodoEnvio === "express" && "Envío Express (1-2 días)"}
                      {metodoEnvio === "pickup" && "Recoger en Tienda"}
                    </p>
                  </div>

                  {/* Método de pago */}
                  <div>
                    <h4 className="font-medium mb-2">Método de Pago</h4>
                    {metodoPago === "tarjeta" && (
                      <p className="text-sm text-muted-foreground">
                        Tarjeta terminada en {tarjetasGuardadas.find(t => t.id === tarjetaSeleccionada)?.ultimos4}
                      </p>
                    )}
                    {metodoPago === "transferencia" && (
                      <p className="text-sm text-muted-foreground">Transferencia Bancaria</p>
                    )}
                    {metodoPago === "efectivo" && (
                      <p className="text-sm text-muted-foreground">Pago Contraentrega</p>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setPasoActual(3)}>
                      Atrás
                    </Button>
                    <Button 
                      onClick={procesarPago} 
                      disabled={procesando}
                      className="min-w-[120px]"
                    >
                      {procesando ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Procesando...
                        </div>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Pagar ${total.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Resumen del pedido */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.cantidad} × ${item.price}
                      </p>
                      <p className="text-sm font-medium">${(item.price * item.cantidad).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span>
                    {costoEnvio === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      `$${costoEnvio.toFixed(2)}`
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de seguridad */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Pago 100% seguro</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-blue-600" />
                <span>Datos protegidos con SSL</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-purple-600" />
                <span>Envío con seguro incluido</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}