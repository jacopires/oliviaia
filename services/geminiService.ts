
import { GoogleGenAI } from "@google/genai";

export const sendMessageToGemini = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  try {
    // Inicialização correta conforme diretrizes
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Preparação do conteúdo mesclando histórico e prompt atual
    const contents = [...history, { role: 'user', parts: [{ text: prompt }] }];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, tive um problema técnico ao processar sua resposta. Tente novamente em instantes.";
  }
};
