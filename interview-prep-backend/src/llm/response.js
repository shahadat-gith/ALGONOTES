import { env } from "../config/env.js";
import { llm } from "./llm.js"

const TEMPERATURE = 0.2;

const MODEL = env.OPENROUTER_MODEL;

export const generateContent = async ({ system, prompt, json = false }) => {
  const response = await llm.chat.send({
    chatRequest: {
      model: MODEL,
      temperature: TEMPERATURE,
      response_format: json ? { type: "json_object" } : undefined,
      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    },
  });

  return response.choices[0].message.content;
};
