import { generateContent } from "../utils/llm.js";
import {
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalyzerPrompt,
} from "../prompts/analyzer.js";

import { parseJson } from "../utils/helpers.js";

export const analyzeApplication = async ({ company, role, resume, jd }) => {
  const response = await generateContent({
    system: ANALYSIS_SYSTEM_PROMPT,
    prompt: buildAnalyzerPrompt({
      company,
      role,
      resume,
      jd,
    }),
    json: true,
  });

  return parseJson(response);
};
