import { config } from "dotenv"

config()

export const env = {
  PORT: process.env.PORT || 5001,
  ENVIRONMENT: process.env.ENVIRONMENT,
  NODE_ENV: process.env.NODE_ENV || process.env.ENVIRONMENT || "development",
  JWT_SECRET: process.env.JWT_SECRET,

  DATABASE_URL: process.env.DATABASE_URL,

  SQS_QUEUE_URL: process.env.SQS_QUEUE_URL,

  HF_TOKEN: process.env.HF_TOKEN,
  HF_MODEL: process.env.HF_MODEL,

  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  QDRANT_API_KEY: process.env.QDRANT_API_KEY,
  QDRANT_URL: process.env.QDRANT_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

