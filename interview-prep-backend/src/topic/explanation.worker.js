import { Worker } from "bullmq";

import { redis } from "../config/redis.js";

import { Topic } from "./topic.model.js";
import { Explanation } from "./explanation.model.js";

import { generateContent } from "../llm/response.js";
import { parseJson } from "../utils/helpers.js";

import {
  EXPLANATION_SYSTEM_PROMPT,
  buildExplanationPrompt,
} from "../prompts/explanation.js";

export const explanationWorker = new Worker(
  "explanation",
  async (job) => {
    const { topicId } = job.data;

    try {
      // 1. Fetch topic and parent application
      const topic = await Topic.findById(topicId)
        .populate("application")
        .lean();

      if (!topic) {
        throw new Error("Topic record not found.");
      }

      const application = topic.application;

      if (!application) {
        throw new Error("Associated application record not found.");
      }

      // 2. Skip if explanation already exists
      const existingExplanation = await Explanation.findOne({
        topic: topicId,
      }).lean();

      if (existingExplanation?.status === "completed") {
        return;
      }

      // 3. Mark explanation as processing
      await Explanation.findOneAndUpdate(
        { topic: topicId },
        {
          $set: {
            status: "processing",
            failureReason: "",
          },
        },
        {
          upsert: true,
        },
      );

      // 4. Generate explanation
      const explanationResponse = await generateContent({
        system: EXPLANATION_SYSTEM_PROMPT,
        prompt: buildExplanationPrompt({
          role: application.role,
          topic: {
            title: topic.title,
            priority: topic.priority,
            reason: topic.reason,
          },
        }),
        json: true,
      });

      if (!explanationResponse) {
        throw new Error("LLM returned an empty response.");
      }

      const parsedExplanation = parseJson(explanationResponse);

      if (
        !parsedExplanation ||
        !Array.isArray(parsedExplanation.tableOfContents) ||
        !Array.isArray(parsedExplanation.sections)
      ) {
        throw new Error("LLM returned an invalid explanation structure.");
      }

      // 5. Save generated explanation
      await Explanation.findOneAndUpdate(
        { topic: topicId },
        {
          $set: {
            status: "completed",
            failureReason: "",
            tableOfContents: parsedExplanation.tableOfContents,
            sections: parsedExplanation.sections,
          },
        },
      );
    } catch (error) {
      // 6. Persist failure state
      explanation = await Explanation.findOneAndUpdate(
        { topic: topicId },
        {
          topic: topicId,
          status: "processing",
          failureReason: "",
        },
        {
          upsert: true,
          returnDocument: "after",
        },
      );

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

explanationWorker.on("completed", (job) => {
  console.log(
    `✅ Explanation generated successfully for Topic ${job.data.topicId}`,
  );
});

explanationWorker.on("failed", (job, error) => {
  console.error(
    `❌ Explanation generation failed for Topic ${job?.data?.topicId}:`,
    error.message,
  );
});
