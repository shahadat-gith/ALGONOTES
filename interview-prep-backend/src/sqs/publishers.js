import { env } from "../config/env.js";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { client } from "./config.js";

export const publishMessage = async (message, delaySeconds = 0) => {
  const command = new SendMessageCommand({
    QueueUrl: env.SQS_QUEUE_URL,
    MessageBody: JSON.stringify(message),
    DelaySeconds: delaySeconds,
  });

  const response = await client.send(command);

  return {
    messageId: response.MessageId,
    success: true,
  };
};