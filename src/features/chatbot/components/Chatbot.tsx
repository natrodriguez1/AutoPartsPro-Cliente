import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { 
  Send, 
  X, 
  Minimize2, 
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useOttoChat } from "../hooks/useOttoChat";
import ImageUploadButton from "@/shared/ui/imageUploadButtonComponent";

export function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [minimizado, setMinimizado] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(null);
  
  const { mensajes, escribiendo, enviarMensaje } = useOttoChat();

  const handleEnviar = async () => {
    if (!nuevoMensaje.trim()) return;
    
    const mensaje = nuevoMensaje;
    const imagen = imagenSeleccionada;
    
    setNuevoMensaje(""); // Limpiar input inmediatamente
    setImagenSeleccionada(null); // Limpiar imagen
    
    await enviarMensaje(mensaje, imagen);
  };

  const handleImageSelect = (file: File | null) => {
    setImagenSeleccionada(file);
  };

  return (
    <>
      {/* Botón flotante */}
      <AnimatePresence>
        {!abierto && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setAbierto(true)}
              className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            >
              <Bot className="h-6 w-6" />
            </Button>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ventana del chat */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className={`shadow-2xl ${minimizado ? "h-auto" : "h-[500px]"} flex flex-col`}>
              <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary-foreground text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm text-primary-foreground">Otto - Asistente Automotriz</CardTitle>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-primary-foreground/80">Especialista en línea</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMinimizado(!minimizado)}
                      className="text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAbierto(false)}
                      className="text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!minimizado && (
                <>
                  <CardContent className="flex-1 overflow-y-auto space-y-4 p-4 max-h-80">
                    {mensajes.map((mensaje) => (
                      <div
                        key={mensaje.id}
                        className={`flex ${mensaje.tipo === "usuario" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-xs p-3 rounded-lg ${
                          mensaje.tipo === "usuario"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}>
                          <p className="text-sm whitespace-pre-line">{mensaje.contenido}</p>
                        </div>
                      </div>
                    ))}
                    
                    {escribiendo && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Pregunta sobre tu auto..."
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEnviar()}
                        className="text-sm flex-1"
                      />
                      <ImageUploadButton 
                        onImageSelect={handleImageSelect}
                        size="icon"
                        variant="outline"
                        disabled={escribiendo}
                        showFileName={false}
                      />
                      <Button 
                        onClick={handleEnviar} 
                        disabled={!nuevoMensaje.trim() || escribiendo} 
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Mostrar imagen seleccionada debajo del input */}
                    {imagenSeleccionada && (
                      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                        <span className="truncate">📎 {imagenSeleccionada.name}</span>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      💡 Pregúntame sobre problemas, talleres o mantenimiento
                    </p>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}