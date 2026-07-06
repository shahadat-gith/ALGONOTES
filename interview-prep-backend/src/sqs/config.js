import { SQSClient } from "@aws-sdk/client-sqs";

export const client = new SQSClient({ region: "ap-south-1" });
