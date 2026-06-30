import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { env } from "../config/env.js";
import { Application } from "../application/model.js";
import { processApplication } from "../application/service.js";

export const applicationWorker = new Worker("application", async (job) => {
    const { applicationId } = job.data;

    try {
      await processApplication(applicationId);
    } catch (error) {
      await Application.findByIdAndUpdate(applicationId, {
        status: "failed",
        failureReason: error.message,
      });

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
    `Application ${job?.data?.applicationId} failed.`,
    error.message,
  );
});
