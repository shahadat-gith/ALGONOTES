import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

const applicationQueue = new Queue("application", {
  connection: redis,
});

export const enqueueApplicationJob = async (applicationId) => {
  await applicationQueue.add(
    "process-application",
    { applicationId },
    {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
};