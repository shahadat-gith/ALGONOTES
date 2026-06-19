// src/sqs/config.js

import { SQSClient } from "@aws-sdk/client-sqs";


const sqsClient = new SQSClient({
  region: "ap-south-1",
});

const QUEUE_URL = process.env.AI_GENERATION_QUEUE_URL;

export { sqsClient, QUEUE_URL };