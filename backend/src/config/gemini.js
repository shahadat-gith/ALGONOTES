import { GoogleGenAI } from '@google/genai';

const aiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default aiClient;