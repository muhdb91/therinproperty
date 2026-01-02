
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePropertyDescription = async (details: {
  title: string;
  beds: number;
  baths: number;
  location: string;
}) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a compelling 3-sentence real estate listing description for a ${details.beds} bed, ${details.baths} bath property titled "${details.title}" located in ${details.location}. Highlight luxury and comfort.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Beautifully maintained property ready for its new owners. Features spacious living areas and modern amenities in a prime location.";
  }
};
