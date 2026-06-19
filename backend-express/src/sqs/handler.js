// src/sqs/handler


import { connectDB } from '../database/db.js';
import { routeIncomingAiJob } from './router.js';

/**
 * AWS Lambda SQS Event Poller Handler Function
 */
export const handler = async (event, context) => {
  // Turn off background event loop holding behaviors to finish execution frames fast
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Connect to database pool instance before consuming execution buffers
  await connectDB();

  const failedMessageIds = [];

  // Iterate over batch processing sizes (usually configured as batchSize: 1 in serverless.yml)
  for (const record of event.Records) {
    try {
      console.log(`[SQS Poller] Processing message ID: ${record.messageId}`);
      
      const parsedBody = JSON.parse(record.body);
      
      // Process payload through the router pipeline
      await routeIncomingAiJob(parsedBody);
      
    } catch (error) {
      console.error(`[SQS Processing Error] Failed execution frame on item ${record.messageId}: ${error.message}`);
      
      // Track item failure IDs if your framework is configured to handle partial batch tracking
      failedMessageIds.push({ itemIdentifier: record.messageId });
    }
  }

  // Return specific keys so AWS handles failed background instances gracefully
  return { batchItemFailures: failedMessageIds };
};