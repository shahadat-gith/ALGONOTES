import { OpenRouter } from "@openrouter/sdk";
import { env } from "../config/env.js";

export const llm = new OpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

