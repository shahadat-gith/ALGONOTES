import { InferenceClient } from "@huggingface/inference";
import { env } from "./env.js";

export const hf = new InferenceClient(env.HF_TOKEN);

export const generateEmbedding = async (text) => {
  try {
    const embedding = await hf.featureExtraction({
      model: env.EMBEDDING_MODEL,
      inputs: text,
    });

    return Array.isArray(embedding)
      ? embedding.flat()
      : Array.from(embedding).flat();
  } catch (error) {
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
};

export const generateEmbeddings = async (texts) => {
  return Promise.all(texts.map(generateEmbedding));
};
