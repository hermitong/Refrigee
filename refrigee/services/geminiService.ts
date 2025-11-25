import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIClassificationResult, Recipe, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const classifyItemWithAI = async (itemName: string, lang: Language): Promise<AIClassificationResult> => {
  const prompt = `Classify the food item "${itemName}". 
  Return JSON with:
  - category: One of [Fruit, Vegetable, Meat, Dairy, Grain, Beverage, Snack, Condiment, Other]
  - emoji: A single representative emoji char
  - shelfLifeDays: Estimated average shelf life in a refrigerator in days (integer).
  
  Context: Managing a home refrigerator inventory.`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      category: { type: Type.STRING },
      emoji: { type: Type.STRING },
      shelfLifeDays: { type: Type.INTEGER },
    },
    required: ['category', 'emoji', 'shelfLifeDays'],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIClassificationResult;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("AI Classification Error:", error);
    // Fallback
    return { category: 'Other', emoji: '📦', shelfLifeDays: 7 };
  }
};

export const identifyItemFromImage = async (base64Image: string, lang: Language): Promise<AIClassificationResult & { name: string }> => {
  const langInstruction = lang === 'zh' ? "Respond in Chinese (Simplified)." : "Respond in English.";
  
  const prompt = `Identify the main food item in this image. 
  ${langInstruction}
  Return JSON with:
  - name: The name of the food item (concise).
  - category: One of [Fruit, Vegetable, Meat, Dairy, Grain, Beverage, Snack, Condiment, Other]
  - emoji: A single representative emoji char
  - shelfLifeDays: Estimated average shelf life in a refrigerator in days (integer).`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      category: { type: Type.STRING },
      emoji: { type: Type.STRING },
      shelfLifeDays: { type: Type.INTEGER },
    },
    required: ['name', 'category', 'emoji', 'shelfLifeDays'],
  };

  // Strip prefix if present (e.g. "data:image/jpeg;base64,")
  const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIClassificationResult & { name: string };
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("AI Image ID Error:", error);
    return { name: '', category: 'Other', emoji: '📸', shelfLifeDays: 7 };
  }
};

export const getWhatToEatRecommendation = async (lang: Language): Promise<Recipe | null> => {
  const langInstruction = lang === 'zh' ? "Respond in Chinese (Simplified)." : "Respond in English.";
  
  // Prompt engineered to mimic the famous "what-to-eat" repo database
  const prompt = `Recommend ONE random, delicious Chinese home-style dish (家常菜), similar to those found in the popular 'what-to-eat' (今天吃什么) repository or 'HowToCook'.
  It should be a popular choice for lunch or dinner.
  ${langInstruction}
  
  Return JSON object with:
  - name: Recipe name
  - description: A fun, short description (e.g., "A classic spicy choice!").
  - ingredients: List of ingredients needed
  - instructions: Brief instructions
  - timeMinutes: Total time in minutes
  - matchPercentage: Set to 100 (since this is a random pick).
  - calories: Estimated calories.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
      instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
      timeMinutes: { type: Type.INTEGER },
      matchPercentage: { type: Type.INTEGER },
      calories: { type: Type.INTEGER },
    },
    required: ['name', 'ingredients', 'instructions', 'timeMinutes'],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 1.1, // High temperature for randomness
      },
    });

    if (response.text) {
      const r = JSON.parse(response.text);
      return { ...r, id: `ai-random-${Date.now()}` };
    }
    return null;
  } catch (error) {
    console.error("Random Recipe Error:", error);
    return null;
  }
}

export const generateRecipesWithAI = async (
  ingredients: string[], 
  peopleCount: number, 
  lang: Language
): Promise<Recipe[]> => {
  const ingredientList = ingredients.join(", ");
  const langInstruction = lang === 'zh' ? "Respond in Chinese (Simplified)." : "Respond in English.";
  
  const prompt = `Suggest 3 recipes based on these available ingredients: ${ingredientList}. 
  Cooking for ${peopleCount} people.
  
  Style: Prioritize authentic Chinese home-cooking (similar to 'what-to-eat' repo style) if the ingredients allow, otherwise general global cuisine.
  Prioritize recipes that use the provided ingredients to reduce waste.
  ${langInstruction}
  
  Return a JSON array where each object has:
  - name: Recipe name
  - description: Short appetizing description (1 sentence)
  - ingredients: List of ingredients needed
  - instructions: Step by step instructions
  - timeMinutes: Total time in minutes
  - matchPercentage: Estimate 0-100 how well it matches the provided inventory.
  - calories: Estimated calories per serving.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
        timeMinutes: { type: Type.INTEGER },
        matchPercentage: { type: Type.INTEGER },
        calories: { type: Type.INTEGER },
      },
      required: ['name', 'ingredients', 'instructions', 'timeMinutes', 'matchPercentage'],
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7, 
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.map((r: any, index: number) => ({ ...r, id: `ai-${Date.now()}-${index}` }));
    }
    return [];
  } catch (error) {
    console.error("Recipe Generation Error:", error);
    return [];
  }
};