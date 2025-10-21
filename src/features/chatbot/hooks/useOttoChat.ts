// chatbot/hooks/useOttoChat.ts
import { useState, useCallback } from 'react';
import { aiAgentService, ChatResponse } from '../services/ottoApi';

interface Mensaje {
  id: string;
  tipo: "usuario" | "bot";
  contenido: string;
  timestamp: Date;
}

export function useOttoChat() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: "1",
      tipo: "bot",
      contenido: "¡Hola! Soy Otto, tu Asistente Automotriz de AutoParts Pro 🚗\n\n¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    }
  ]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();

  const enviarMensaje = useCallback(async (contenido: string) => {
    if (!contenido.trim()) return;

    // Agregar mensaje del usuario
    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      tipo: "usuario",
      contenido,
      timestamp: new Date()
    };
    
    setMensajes(prev => [...prev, mensajeUsuario]);

    // Simular escritura del bot
    setEscribiendo(true);

    try {
      // Llamar a la API del agente IA
      const response: ChatResponse = await aiAgentService.sendMessage(
        contenido,
        conversationId
      );

      console.log('Respuesta completa del backend:', response);

      // Guardar session_id si es nuevo 
      if (response.session_id && !conversationId) {
        setConversationId(response.session_id);
      }

      
      const mensajeBot: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: "bot",
        contenido: response.message || response.response || "No se recibió respuesta",
        timestamp: new Date()
      };

      console.log('Mensaje del bot a mostrar:', mensajeBot.contenido);

      setMensajes(prev => [...prev, mensajeBot]);
      
    } catch (error) {
      console.error('Error en chat:', error);
      
      
      const mensajeError: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: "bot",
        contenido: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.",
        timestamp: new Date()
      };
      
      setMensajes(prev => [...prev, mensajeError]);
    } finally {
      setEscribiendo(false);
    }
  }, [conversationId]);

  return {
    mensajes,
    escribiendo,
    enviarMensaje,
  };
}