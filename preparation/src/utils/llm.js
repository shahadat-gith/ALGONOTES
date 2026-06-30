import { ai, MODEL } from "../config/llm.js";

const TEMPERATURE = 0.2;

export const generateContent = async ({ system, prompt, json = false }) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: system,
      temperature: TEMPERATURE,
      responseMimeType: json ? "application/json" : "text/plain",
    },
  });

  return response.text;
};