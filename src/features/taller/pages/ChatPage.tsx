import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Phone, 
  Video,
  MoreVertical,
  Clock,
  CheckCheck,
  Package
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { toast } from "sonner@2.0.3";

interface ChatTallerProps {
  taller: any;
  onRegresar: () => void;
}

export function ChatTaller({ taller, onRegresar }: ChatTallerProps) {
  const [mensajes, setMensajes] = useState([
    {
      id: "1",
      remitente: "taller",
      mensaje: "¡Hola! Bienvenido a AutoMaster Quito. ¿En qué podemos ayudarte hoy?",
      fecha: "10:30 AM",
      estado: "entregado"
    },
    {
      id: "2",
      remitente: "usuario",
      mensaje: "Hola, necesito pastillas de freno para un Honda Civic 2018",
      fecha: "10:32 AM",
      estado: "visto"
    },
    {
      id: "3",
      remitente: "taller",
      mensaje: "Perfecto, tenemos esas pastillas en stock. Son de marca Bosch, muy buena calidad.",
      fecha: "10:33 AM",
      estado: "entregado"
    },
    {
      id: "4",
      remitente: "taller",
      mensaje: "El precio es $85 el juego completo. ¿Te gustaría que te enviemos una cotización detallada?",
      fecha: "10:33 AM",
      estado: "entregado"
    }
  ]);
  
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);

  const handleEnviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;
    
    const mensaje = {
      id: Date.now().toString(),
      remitente: "usuario",
      mensaje: nuevoMensaje,
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estado: "enviado"
    };
    
    setMensajes([...mensajes, mensaje]);
    setNuevoMensaje("");
    
    // Simular respuesta del taller
    setEscribiendo(true);
    setTimeout(() => {
      setEscribiendo(false);
      const respuesta = {
        id: (Date.now() + 1).toString(),
        remitente: "taller",
        mensaje: "Perfecto, te envío la cotización en un momento. ¿Necesitas instalación también?",
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estado: "entregado"
      };
      setMensajes(prev => [...prev, respuesta]);
    }, 2000);
  };

  const getIconoEstado = (estado: string) => {
    switch (estado) {
      case "enviado":
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "entregado":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "visto":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onRegresar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      <Card className="h-[600px] flex flex-col">
        {/* Header del chat */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{taller?.nombre?.charAt(0) || "T"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{taller?.nombre || "Taller"}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">En línea</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Package className="h-4 w-4 mr-2" />
                    Solicitar Cotización
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Compartir Ubicación
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Bloquear Taller
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        {/* Área de mensajes */}
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {mensajes.map((mensaje) => (
            <div
              key={mensaje.id}
              className={`flex ${mensaje.remitente === "usuario" ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end gap-2 max-w-xs lg:max-w-md ${
                mensaje.remitente === "usuario" ? 'flex-row-reverse' : 'flex-row'
              }`}>
                {mensaje.remitente === "taller" && (
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">{taller?.nombre?.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`p-3 rounded-lg ${
                    mensaje.remitente === "usuario"
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{mensaje.mensaje}</p>
                  <div className={`flex items-center gap-1 mt-1 ${
                    mensaje.remitente === "usuario" ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className={`text-xs ${
                      mensaje.remitente === "usuario" 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {mensaje.fecha}
                    </span>
                    {mensaje.remitente === "usuario" && getIconoEstado(mensaje.estado)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {escribiendo && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">{taller?.nombre?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg rounded-bl-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input para nuevos mensajes */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Escribe tu mensaje..."
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensaje()}
              className="flex-1"
            />
            <Button onClick={handleEnviarMensaje} disabled={!nuevoMensaje.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}