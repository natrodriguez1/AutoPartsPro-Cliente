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
  async sendMessage(message: string, conversationId?: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: conversationId, 
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Datos recibidos del backend:', data);
      
      return data;
    } catch (error) {
      console.error('Error al comunicarse con el agente IA:', error);
      throw error;
    }
  },
};