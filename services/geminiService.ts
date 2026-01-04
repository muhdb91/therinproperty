
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client safely.
// Note: process.env.API_KEY must be set in your Vercel Environment Variables.
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key missing. Descriptions will fall back to default text.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePropertyDescription = async (details: {
  title: string;
  beds: number;
  baths: number;
  location: string;
}) => {
  const ai = getClient();
  if (!ai) return "Beautifully maintained property ready for its new owners. Features spacious living areas and modern amenities in a prime location.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a compelling 3-sentence real estate listing description for a ${details.beds} bed, ${details.baths} bath property titled "${details.title}" located in ${details.location}. Highlight luxury and comfort.`,
    });
    return response.text || "Luxury listing with premium finishes.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Beautifully maintained property ready for its new owners. Features spacious living areas and modern amenities in a prime location.";
  }
};
