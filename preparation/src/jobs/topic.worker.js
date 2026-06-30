import { Worker } from "bullmq";

import { redis } from "../config/redis.js";

import { Topic } from "../topic/model.js";
import { Application } from "../application/model.js";

import { generateContent } from "../utils/llm.js";

import { TOPIC_SYSTEM_PROMPT, buildTopicPrompt } from "../prompts/topic.js";

export const topicWorker = new Worker("topic", async (job) => {
    const { topicId } = job.data;
    try {
      const topic = await Topic.findById(topicId);

      if (!topic) {
        throw new Error("Topic not found.");
      }

      const application = await Application.findById(topic.application);

      if (!application) {
        throw new Error("Application not found.");
      }

      const discussion = await generateContent({
        system: TOPIC_SYSTEM_PROMPT,
        prompt: buildTopicPrompt({
          company: application.company,
          role: application.role,
          topic: topic.title,
          resume: application.resume,
          jd: application.jd,
        }),
      });

      topic.discussion = {
        content: discussion,
        generatedAt: new Date(),
      };

      topic.discussionStatus = "ready";
      topic.discussionFailureReason = "";

      await topic.save();
    } catch (error) {
      await Topic.findByIdAndUpdate(topicId, {
        discussionStatus: "failed",
        discussionFailureReason: error.message,
      });

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

topicWorker.on("completed", (job) => {
  console.log(`✅ Topic ${job.data.topicId} processed.`);
});

topicWorker.on("failed", (job, error) => {
  console.error(`Topic ${job?.data?.topicId} failed.`, error.message);
});
