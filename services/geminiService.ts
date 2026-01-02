
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client using the environment variable as required.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePropertyDescription = async (details: {
  title: string;
  beds: number;
  baths: number;
  location: string;
}) => {
  try {
    // Generate content using the recommended model for basic text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a compelling 3-sentence real estate listing description for a ${details.beds} bed, ${details.baths} bath property titled "${details.title}" located in ${details.location}. Highlight luxury and comfort.`,
    });
    // Extract the generated text output using the .text property.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Beautifully maintained property ready for its new owners. Features spacious living areas and modern amenities in a prime location.";
  }
};
