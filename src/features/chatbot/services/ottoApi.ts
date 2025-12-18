// chatbot/services/aiAgentService.ts
const API_URL = 'http://localhost:8000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;  
  response?: string; 
  session_id?: string;  
  conversation_id?: string; 
  parts?: any;
  timestamp?: string;
}

export const aiAgentService = {
  async sendMessage(
  message: string, 
  conversationId?: string,
  image?: File | null
): Promise<ChatResponse> {
  try {
    // Convertir imagen a Base64 si existe
    let imageBase64 = null;
    if (image) {
      console.log('Convirtiendo imagen a Base64...', image.name);
      imageBase64 = await this.fileToBase64(image);
      console.log('Imagen convertida. Longitud Base64:', imageBase64.length);
    }

    const payload = {
      message,
      session_id: conversationId || null,
      image: imageBase64,
    };

    console.log('Enviando payload:', {
      message: message.substring(0, 50),
      session_id: conversationId,
      hasImage: !!imageBase64,
      imageLength: imageBase64?.length
    });

    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del servidor:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Datos recibidos:', data);
    
    return data;
  } catch (error) {
    console.error('Error completo:', error);
    throw error;
  }
},

// Asegurate de tener esta funcion
fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remover el prefijo "data:image/...;base64,"
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
},

  // ⬇️ AGREGAR ESTA FUNCIÓN ⬇️
  validateImage(file: File, maxSize: number = 5): { 
    valid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Tipo no permitido. Solo se aceptan imágenes (JPEG, PNG, GIF, WebP).`);
    }

    // Validar tamaño
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSize) {
      errors.push(`La imagen excede el tamaño máximo de ${maxSize}MB.`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};