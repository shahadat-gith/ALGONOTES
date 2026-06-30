import { PDFParse } from "pdf-parse";

export const extractResumeText = async (buffer) => {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.text.trim();
  } finally {
    await parser.destroy();
  }
};

export const parseJson = (content) => {
  try {
    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch {
    console.error(content);
    throw new Error("Invalid JSON returned by AI.");
  }
};