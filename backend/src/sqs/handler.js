import { connectDB } from '../database/db.js';
import { routeIncomingAiJob } from './router.js';


export const handler = async (event, context) => {
  // Ensure connection instance is running
  await connectDB();
  
  const batchItemFailures = [];

  if (event && Array.isArray(event.Records)) {
    for (const record of event.Records) {
      try {
        const message = JSON.parse(record.body);
        await routeIncomingAiJob(message);
      } catch (error) {
        console.error(
          `[SQS Handler Critical] Failed to completely digest message ID ${record.messageId}: ${error.message}`
        );
        // Track the specific failed item ID so SQS can retry it individually
        batchItemFailures.push({ itemIdentifier: record.messageId });
      }
    }
  }

  return { batchItemFailures };
};