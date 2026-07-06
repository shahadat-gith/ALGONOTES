import { generateContent } from "../../llm/response.js";
import { parseJson } from "../../utils/helpers.js";
import { SYSTEM_PROMPT, buildPrompt } from "../../prompts/explanation.js";
import { Topic } from "../../topic/topic.model.js";
import { Explanation } from "../../topic/explanation.model.js";

export const processExplanationJob = async (topicId) => {
  try {
    const topic = await Topic.findById(topicId).populate("application").lean();

    if (!topic) {
      throw new Error("Topic not found.");
    }

    const application = topic.application;

    if (!application) {
      throw new Error("Application not found.");
    }

    const existingExplanation = await Explanation.findOne({
      topic: topicId,
    }).lean();

    if (existingExplanation?.status === "completed") {
      return;
    }

    await Explanation.findOneAndUpdate(
      { topic: topicId },
      {
        $set: {
          status: "processing",
          failureReason: "",
        },
      },
      { upsert: true },
    );

    const response = await generateContent({
      system: SYSTEM_PROMPT,
      prompt: buildPrompt({
        role: application.role,
        topic: {
          title: topic.title,
          priority: topic.priority,
          reason: topic.reason,
        },
      }),
      json: true,
    });

    const parsed = parseJson(response);

    if (
      !parsed ||
      !Array.isArray(parsed.tableOfContents) ||
      !Array.isArray(parsed.sections)
    ) {
      throw new Error("Invalid explanation response.");
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

    console.log(`✅ Explanation ${topicId} generated.`);
  } catch (error) {
    await Explanation.findOneAndUpdate(
      { topic: topicId },
      {
        $set: {
          status: "failed",
          failureReason: error.message,
        },
      },
      {
        upsert: true,
      },
    );

    console.error(`❌ Explanation ${topicId} failed:`, error);

    throw error;
  }
};
