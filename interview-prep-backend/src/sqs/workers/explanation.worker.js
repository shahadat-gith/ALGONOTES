import { generateContent } from "../../llm/response.js";
import { parseJson } from "../../utils/helpers.js";
import { SYSTEM_PROMPT, buildPrompt } from "../../prompts/explanation.js";
import { Topic } from "../../topic/topic.model.js";
import { Explanation } from "../../topic/explanation.model.js";

export const processExplanationJob = async ({ topicId, codeLanguage }) => {
  try {
    const topic = await Topic.findById(topicId).populate("application").lean();
    if (!topic) {
      throw new Error("Topic not found.");
    }

    const application = topic.application;
    if (!application) {
      throw new Error("Application details not linked to topic.");
    }

    const existingExplanation = await Explanation.findOne({ topic: topicId }).lean();
    if (existingExplanation?.status === "completed") {
      console.log(`ℹ️ Explanation ${topicId} is already completed. Skipping.`);
      return;
    }

    const response = await generateContent({
      system: SYSTEM_PROMPT,
      prompt: buildPrompt({
        company: application.company,
        role: application.role,
        topic: {
          title: topic.title,
          priority: topic.priority,
          reason: topic.reason,
        },
        codeLanguage,
      }),
      json: true,
    });

    const parsed = parseJson(response);
    if (
      !parsed ||
      !Array.isArray(parsed.tableOfContents) ||
      !Array.isArray(parsed.sections)
    ) {
      throw new Error("Invalid schema structure returned from downstream LLM.");
    }

    await Explanation.findOneAndUpdate(
      { topic: topicId },
      {
        $set: {
          status: "completed",
          failureReason: "",
          tableOfContents: parsed.tableOfContents,
          sections: parsed.sections,
        },
      },
    );

    console.log(`✅ Explanation ${topicId} generated successfully.`);
  } catch (error) {
    console.error(`❌ Explanation ${topicId} runtime failure:`, error);

    await Explanation.findOneAndUpdate(
      { topic: topicId },
      {
        $set: {
          status: "failed",
          failureReason: error.message || "Unknown error encountered",
        },
        $setOnInsert: {
          topic: topicId
        }
      },
      { upsert: true },
    );

    throw error;
  }
};