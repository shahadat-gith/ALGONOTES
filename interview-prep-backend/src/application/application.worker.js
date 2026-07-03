import { Worker } from "bullmq";
import { generateContent } from "../llm/response.js";
import { parseJson } from "../utils/helpers.js";

import { redis } from "../config/redis.js";

import { SYSTEM_PROMPT, buildPrompt } from "../prompts/application.js";

import { Application } from "./model.js";
import { Topic } from "../topic/topic.model.js";

export const applicationWorker = new Worker("application", async (job) => {
    const { applicationId } = job.data;

    try {
      const application = await Application.findById(applicationId);

      if (!application) {
        throw new Error("Application not found.");
      }

      const { company, role, processingData } = application;

      if (!processingData?.resumeText || !processingData?.jobDescriptionText) {
        throw new Error("Application processing data is missing.");
      }

      const response = await generateContent({
        system: SYSTEM_PROMPT,
        prompt: buildPrompt({
          company,
          role,
          resumeText: processingData.resumeText,
          jobDescriptionText: processingData.jobDescriptionText,
        }),
        json: true,
      });

      const result = parseJson(response);

      const analysis = result.analysis;
      const rawTopics = result.topics || [];

      application.analysis = analysis;
      application.status = "completed";
      application.processingData = undefined;

      await application.save();

      if (rawTopics.length > 0) {
        await Topic.insertMany(
          rawTopics.map((topic, index) => ({
            application: application._id,
            order: topic.order ?? index + 1,
            title: topic.title,
            priority: topic.priority,
            reason: topic.reason,
          })),
        );
      }
    } catch (error) {
      await Application.findByIdAndUpdate(applicationId, {
        status: "failed",
        failureReason: error.message,
      },
      {
        upsert:true,
        returnDocument: "after",
      }
    );

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

applicationWorker.on("completed", (job) => {
  console.log(`✅ Application ${job.data.applicationId} processed.`);
});

applicationWorker.on("failed", (job, error) => {
  console.error(
    `❌ Application ${job?.data?.applicationId} failed:`,
    error.message,
  );
});
