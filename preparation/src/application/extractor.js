import { generateContent } from "../utils/llm.js";

import { RESUME_SYSTEM_PROMPT, buildResumePrompt } from "../prompts/resume.js";

import { JD_SYSTEM_PROMPT, buildJDPrompt } from "../prompts/jd.js";

import { parseJson } from "../utils/helpers.js";


export const extractResume = async (resumeText) => {
  const response = await generateContent({
    system: RESUME_SYSTEM_PROMPT,
    prompt: buildResumePrompt(resumeText),
    json: true,
  });

  return parseJson(response);
};

export const extractJobDescription = async (jobDescriptionText) => {
  const response = await generateContent({
    system: JD_SYSTEM_PROMPT,
    prompt: buildJDPrompt(jobDescriptionText),
    json: true,
  });

  return parseJson(response);
};
