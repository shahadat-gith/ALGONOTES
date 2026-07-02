import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

const applicationQueue = new Queue("application", {
  connection: redis,
});

export const enqueueApplicationJob = async (applicationId) => {
  await applicationQueue.add("process-application",{ applicationId },
    {
      attempts: 5,
      backoff: { 
        type: "exponential",
        delay: 20000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
};