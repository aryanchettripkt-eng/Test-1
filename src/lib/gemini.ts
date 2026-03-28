import { GoogleGenAI, Type } from "@google/genai";

export const getAI = () => {
  // Priority:
  // 1. VITE_GEMINI_API_KEY — set this in Vercel project settings as an Environment Variable
  // 2. LocalStorage — user-provided at runtime via the in-app settings (gear icon)
  // 3. GEMINI_API_KEY — legacy AI Studio injected env var (build-time baked via vite define)
  
  const viteEnvKey = import.meta.env.VITE_GEMINI_API_KEY;
  const localStorageKey = typeof window !== 'undefined' ? localStorage.getItem('REMINIQ_GEMINI_API_KEY') : null;

  // Safely access process.env.GEMINI_API_KEY which may be baked in at build time by Vite's define
  let processEnvKey: string | undefined;
  try {
    processEnvKey = process.env.GEMINI_API_KEY;
  } catch (e) {
    // process is not defined in browser
  }

  const cleanKey = (key: any): string | null => {
    if (!key || key === "undefined" || key === "null" || key === "MY_GEMINI_API_KEY") return null;
    return String(key);
  };

  const apiKey = cleanKey(viteEnvKey) || cleanKey(localStorageKey) || cleanKey(processEnvKey);

  if (!apiKey) {
    console.error("Gemini API Key is missing. Sources checked:", {
      viteEnv: !!cleanKey(viteEnvKey),
      localStorage: !!cleanKey(localStorageKey),
      processEnv: !!cleanKey(processEnvKey),
    });
    throw new Error(
      "Gemini API Key is missing.\n\n" +
      "On Vercel: add VITE_GEMINI_API_KEY to your project's Environment Variables.\n" +
      "Locally: add VITE_GEMINI_API_KEY=\"your-key\" to a .env file.\n" +
      "Or set it at runtime via the gear icon in the app."
    );
  }

  return new GoogleGenAI({ apiKey });
};

export interface Memory {
  id: string;
  type: 'photo' | 'voice' | 'text' | 'music';
  title: string;
  desc: string;
  mood: string;
  location?: string;
  date: string;
  photoUrl?: string;
  audioUrl?: string;
  musicUrl?: string;
  transcript?: string;
  emotion?: string;
  music?: {
    song: string;
    artist: string;
    albumArt?: string;
  };
}

export interface DayReaction {
  date: string;
  emoji: string;
}

export interface Album {
  id: string;
  title: string;
  memoryIds: string[];
  journalText?: string;
  linkedMemoryIds?: string[];
  voiceNoteUrl?: string;
}

export async function sortMemoriesIntoAlbums(memories: Memory[]): Promise<Album[]> {
  if (memories.length === 0) return [];

  const ai = getAI();

  // Helper to convert image URL to base64 for Gemini
  const getBase64 = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  };

  const memoryParts = await Promise.all(memories.map(async (m) => {
    const parts: any[] = [{
      text: `Memory ID: ${m.id}\nTitle: ${m.title}\nDescription: ${m.desc}\nLocation: ${m.location || 'Unknown'}\nDate: ${m.date}\nMood: ${m.mood}`
    }];

    if (m.photoUrl) {
      const base64 = await getBase64(m.photoUrl);
      if (base64) {
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: base64
          }
        });
      }
    }
    return parts;
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Stable public model — works outside AI Studio
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a sophisticated, nostalgic curator with deep visual intuition. Group these memories into meaningful albums. 
              
              STRICT PRIORITY FOR GROUPING:
              1. VISUAL ELEMENTS: Group by similar colors, lighting, textures, or objects found in the images (e.g., "Golden Hour Glow", "Blue & Moody", "Floral Patterns").
              2. LOCATION: Within visual themes, group by similar or nearby locations.
              3. TIME: Finally, order them chronologically within those groups.
              
              Use the provided images as the PRIMARY source of truth for grouping. Look for subtle visual connections that a human would notice.
              
              For each album, provide:
              1. A "title": A cozy, small, poetic title that reflects the visual or emotional essence.
              2. "memoryIds": An array of IDs belonging to this album.
              
              Return an array of album objects. Every memory must belong to exactly one album.`
            },
            ...memoryParts.flat()
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              memoryIds: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "memoryIds"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini. This might be due to safety filters or an invalid API key.");
    }

    const albumsData = JSON.parse(response.text);
    return albumsData.map((a: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      ...a
    }));
  } catch (error: any) {
    console.error("Gemini sorting error:", error);
    // Always rethrow so the real error message reaches the UI
    const message = error.message || "Unknown error during AI sorting";
    throw new Error(`AI sorting failed: ${message}`);
  }
}

export async function searchMemories(query: string, memories: Memory[]) {
  if (memories.length === 0) return null;

  const ai = getAI();
  const memoryContext = memories.map(m => ({
    id: m.id,
    title: m.title,
    desc: m.desc,
    type: m.type,
    mood: m.mood,
    location: m.location
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Stable public model — works outside AI Studio
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are the librarian of "Reminiq". 
              A user is searching for a memory with the query: "${query}".
              
              Here are the memories in their vault:
              ${JSON.stringify(memoryContext)}
              
              Find the most relevant memory. If you find one, return a JSON object with:
              1. "intro": A poetic, nostalgic one-sentence introduction to the memory (e.g., "I found a golden afternoon from last autumn...").
              2. "memoryId": The ID of the matching memory.
              
              If no memory matches well, return a JSON object with "intro": "I couldn't find that specific moment, but your vault is still full of stories." and "memoryId": null.`
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intro: { type: Type.STRING },
            memoryId: { type: Type.STRING, nullable: true }
          },
          required: ["intro"]
        }
      }
    });

    if (!response.text) return null;
    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini search error:", error);
    const message = error.message || "Unknown error during search";
    if (message.includes("API_KEY") || message.includes("permission") || message.includes("key") || message.includes("not found")) {
      throw new Error(`Gemini API Error: ${message}`);
    }
    return null;
  }
}
