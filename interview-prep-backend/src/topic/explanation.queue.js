import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

const topicQueue = new Queue("explanation", {connection: redis});

export const enqueueExplanationJob = async (topicId) => {
  await topicQueue.add("generate-explanation",{ topicId },
    {
      attempts: 1,
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};

export default topicQueue;