// src/sqs/dispatchers

import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqsClient, QUEUE_URL } from './config.js';

export const enqueueNoteGeneration = async ({
  note_id,
  user_id,
  problem_link,
  user_code,
  language,
  user_notes = ''
}) => {
  const payload = {
    type: 'dsa',
    note_id: note_id.toString(),
    user_id: user_id.toString(),
    problemLink: problem_link,
    userCode: user_code,
    language: language,
    userNotes: user_notes
  };

  const command = new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(payload)
  });

  await sqsClient.send(command);
  console.log(`[SQS] Enqueued dsa note generation for Note ID: ${note_id}`);
};

export const enqueueTheoryGeneration = async ({
  theory_id,
  user_id,
  topic,
  code_language = 'C++',
  instructions = null
}) => {
  const payload = {
    type: 'theory',
    theory_id: theory_id.toString(),
    user_id: user_id.toString(),
    topic: topic,
    code_language: code_language && code_language.trim() ? code_language.trim() : 'C++',
    instructions: instructions
  };

  const command = new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(payload)
  });

  await sqsClient.send(command);
  console.log(`[SQS] Enqueued theory generation for Theory ID: ${theory_id} (Language: ${payload.code_language})`);
};

export const enqueuePromptOptimization = async ({
  job_id,
  user_id,
  topic,
  code_language,
  instructions = ''
}) => {
  const payload = {
    type: 'optimize_prompt',
    job_id: job_id.toString(),
    user_id: user_id.toString(),
    topic: topic,
    code_language: code_language,
    instructions: instructions
  };

  const command = new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(payload)
  });

  await sqsClient.send(command);
  console.log(`[SQS] Enqueued prompt optimization task for Job ID: ${job_id}`);
};