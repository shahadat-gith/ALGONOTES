import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT,
  ENVIRONMENT: process.env.ENVIRONMENT,
  JWT_SECRET: process.env.JWT_SECRET,


  DATABASE_URL: process.env.DATABASE_URL,


  SQS_QUEUE_URL: process.env.SQS_QUEUE_URL,


  HF_TOKEN: process.env.HF_TOKEN,
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL,


  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL:process.env.GEMINI_MODEL,


  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,


  QDRANT_API_KEY: process.env.QUADRANT_API_KEY,
  QDRANT_URL: process.env.QUADARANT_URL,

  REDIS_URL:process.env.REDIS_URL
};

