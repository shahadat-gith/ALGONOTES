import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

const topicQueue = new Queue("topic", {
  connection: redis,
});

export const enqueueTopicJob = async (topicId) => {
  await topicQueue.add(
    "generate-discussion",
    { topicId },
    {
      attempts: 1,
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
};

export default topicQueue;