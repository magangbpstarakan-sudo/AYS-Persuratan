
import { GoogleGenAI } from "@google/genai";

/**
 * Drafts letter content using Gemini 3 Flash Preview.
 * Follows the guidelines by initializing GoogleGenAI inside the function 
 * and using ai.models.generateContent directly.
 */
export const draftLetterContent = async (type: string, details: string) => {
  // Create a new GoogleGenAI instance right before making an API call 
  // to ensure it always uses the most up-to-date API key from the context.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bantu saya membuat isi surat formal untuk jenis "${type}" dengan rincian berikut: ${details}. Gunakan Bahasa Indonesia yang sangat formal, sopan, dan profesional. Kembalikan hanya bagian isi suratnya saja tanpa pembuka "Kepada Yth" atau penutup tanda tangan.`,
      config: {
        temperature: 0.7,
      },
    });
    // Use .text property directly as per guidelines
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat membuat draft otomatis. Mohon isi secara manual.";
  }
};
