import serverlessExpress from "@codegenie/serverless-express";
import app from "./app.js";
import { connectWithDatabase } from "./config/db.js";
import { processSQSRecord } from "./sqs/workers/dispatcher.js";

let serverlessExpressInstance;

export const handler = async (event, context) => {
  await connectWithDatabase();

  if (event.Records?.[0]?.eventSource === "aws:sqs") {
    for (const record of event.Records) {
      console.log(`📦 Processing SQS message ${record.messageId}`);
      await processSQSRecord(record);
      console.log(`✅ Successfully processed ${record.messageId}`);
    }

    return;
  }

  if (!serverlessExpressInstance) {
    serverlessExpressInstance = serverlessExpress({ app });
  }

  return serverlessExpressInstance(event, context);
};