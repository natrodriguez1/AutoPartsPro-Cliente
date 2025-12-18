import { useState, useRef, useEffect } from 'react';
import { aiAgentService } from '../services/ottoApi';

interface Mensaje {
  id: string;
  tipo: 'usuario' | 'asistente';
  contenido: string;
  timestamp: Date;
  imagen?: string; // URL de la imagen si existe
}

export function useOttoChat() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: '1',
      tipo: 'asistente',
      contenido: '¡Hola! Soy Otto, tu asistente automotriz. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviarMensaje = async (contenido: string, imagen?: File | null) => {
    if (!contenido.trim() && !imagen) return;

    // Agregar mensaje del usuario
    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      tipo: 'usuario',
      contenido,
      timestamp: new Date(),
      imagen: imagen ? URL.createObjectURL(imagen) : undefined,
    };

    setMensajes((prev) => [...prev, mensajeUsuario]);
    setEscribiendo(true);

    try {
      // Validar imagen si existe
      if (imagen) {
        const validation = aiAgentService.validateImage(imagen);
        if (!validation.valid) {
          throw new Error(validation.errors.join('\n'));
        }
      }

      // Enviar a la API
      const respuesta = await aiAgentService.sendMessage(
        contenido,
        conversationId,
        imagen || null
      );

      // Guardar conversation_id si es la primera interacción
      if (respuesta.session_id && !conversationId) {
        setConversationId(respuesta.session_id);
      }

      // Agregar respuesta del asistente
      const mensajeAsistente: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: 'asistente',
        contenido: respuesta.response || respuesta.message || 'No pude procesar tu solicitud.',
        timestamp: new Date(),
      };

      setMensajes((prev) => [...prev, mensajeAsistente]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Mensaje de error
      const mensajeError: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: 'asistente',
        contenido: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente.',
        timestamp: new Date(),
      };

      setMensajes((prev) => [...prev, mensajeError]);
    } finally {
      setEscribiendo(false);
    }
  };

  return {
    mensajes,
    escribiendo,
    enviarMensaje,
    conversationId,
  };
}