import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Enforce configuration safety checks on boot
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Critical System Error: GEMINI_API_KEY is missing in your environment configuration.");
  process.exit(1); 
}

// Initialize the global client wrapper instance
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default ai;