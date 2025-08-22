import { GoogleGenAI } from "@google/genai";
import type { TravelGuide, HotelPreference, TravelMode, GroundingChunk } from '../types';

const getAiClient = () => {
    // Securely retrieve the API key from environment variables when a function is called.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        // This error will be caught by the UI and displayed to the user.
        throw new Error("API_KEY environment variable not set. Please ensure it is configured in your environment.");
    }
    return new GoogleGenAI({ apiKey });
};

/**
 * Extracts a JSON object from a string that might contain other text,
 * such as markdown code blocks.
 * @param text The string to extract JSON from.
 * @returns The parsed JSON object.
 * @throws {SyntaxError} if no valid JSON is found.
 */
const extractJsonFromText = (text: string): any => {
    // Look for a JSON block within ```json ... ``` or a raw JSON object.
    const match = text.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);
    if (match) {
        // The first capture group is for the markdown block, the second for a raw object.
        const jsonString = match[1] || match[2];
        if (jsonString) {
            try {
                return JSON.parse(jsonString);
            } catch (e) {
                console.error("Failed to parse extracted JSON string:", jsonString, e);
                // Fall through to the final error if parsing fails
            }
        }
    }
    // Throw an error if no valid JSON could be parsed.
    throw new SyntaxError("Could not find a valid JSON object in the model's response.");
};


export const generateTravelGuide = async (destination: string, origin: string, hotelPreference: HotelPreference, travelMode: TravelMode): Promise<{ guide: TravelGuide, sources: GroundingChunk[] | undefined }> => {
  try {
    const ai = getAiClient();
    const prompt = `Act as an expert travel guide. Your primary goal is to generate a comprehensive travel guide for a tourist from ${origin} traveling to ${destination} by ${travelMode}.

**CRITICAL INSTRUCTIONS:**
1.  **You MUST use your Google Search tool** to find the current, most accurate price for a **round-trip** ticket for one person traveling by ${travelMode} from ${origin} to ${destination}. The accuracy of this travel cost is the most important part of your task.
2.  The entire 'budget' section of your response, specifically the travel cost fields, MUST be based on the real-time data you find from your web search.
3.  Your entire response **MUST** be a single, valid JSON object. There should be no text, explanations, or markdown formatting (like \`\`\`json) before or after the JSON object.

**JSON STRUCTURE:**
The JSON object must have these top-level keys: "destination", "themeColorHex", "popularPlaces", "restaurants", "cafes", "hotels", "transport", "safety", "culture", "budget".
-   Each item in arrays like "popularPlaces", "restaurants", etc., must be an object with "name" (string), "description" (string), and optional "location" (string), "rating" (a number between 1.0 and 5.0), and "websiteUrl" (string).
-   Provide 3-5 hotels matching the user's preference of '${hotelPreference}'.
-   "transport.gettingAround": A helpful string with tips on local transport.
-   "culture": An object with "localLanguage" (string) and "usefulPhrases" (an array of objects with "phrase" and "translation").
-   "budget": A JSON object with the following exact keys and value types. All numerical costs must be simple numbers without currency symbols or commas.
    -   "estimatedDailyCost": string (A formatted string showing costs in both currencies, e.g., "€140 / $150")
    -   "costPerPersonLocal": number (e.g., 140)
    -   "localCurrencyCode": string (The 3-letter currency code for the destination, e.g., "EUR")
    -   "costPerPersonOrigin": number (e.g., 150)
    -   "originCurrencyCode": string (The 3-letter currency code for the origin, e.g., "USD")
    -   "estimatedTravelCost": string (A formatted string showing costs in both currencies, e.g., "€460 / $500")
    -   "travelCostPerPersonLocal": number (The round-trip travel cost converted to the destination's currency. This MUST be based on your web search. e.g., 460)
    -   "travelCostPerPersonOrigin": number (The round-trip travel cost in the origin's currency. This MUST be based on your web search. e.g., 500)`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.2, // Lower temperature for more predictable JSON output
      },
    });

    const text = response.text.trim();
    const parsedJson = extractJsonFromText(text);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    return { guide: parsedJson as TravelGuide, sources: groundingChunks };
  } catch (error) {
    console.error("Error generating travel guide:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to process the travel guide. The AI returned an unexpected format. Please try again.");
    }
    // Re-throw other errors (like the missing API key error) to be displayed in the UI.
    throw error;
  }
};

export const generateDestinationImage = async (destination: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `A vibrant, picturesque travel photograph of the iconic scenery of ${destination}. Breathtaking landscape, high resolution, travel magazine style, ultra realistic. No text or logos.`;
        
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return '';
    } catch (error) {
        console.error("Error generating destination image:", error);
        // Don't throw, just return empty so the app doesn't crash
        return '';
    }
};