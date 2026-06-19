// src/sqs/router.js

import { 
  executeNoteGeneration, 
  executeTheoryGeneration, 
  executePromptOptimization 
} from './worker.js';

import { 
  handleNoteGenerationFailure, 
  handleTheoryGenerationFailure,
  handlePromptOptimizationFailure
} from './failures.js';

/**
 * Parses and routes incoming background SQS messages to processing executors.
 * Triggers a complete database document cleanup on failure states.
 */
export const routeIncomingAiJob = async (message) => {
  const jobType = message.type || 'dsa';

  try {
    if (jobType === 'theory') {
      await executeTheoryGeneration(message);
    } else if (jobType === 'optimize_prompt') {
      await executePromptOptimization(message);
    } else {
      await executeNoteGeneration(message);
    }
  } catch (error) {
    console.error(`[SQS Router Catch] Handling job crash for type ${jobType}: ${error.message}`);

    // Centralized structural database purge routes
    if (jobType === 'optimize_prompt') {
      await handlePromptOptimizationFailure(message.job_id, error.message);
    } else if (jobType === 'theory') {
      await handleTheoryGenerationFailure(message.theory_id, error.message);
    } else {
      await handleNoteGenerationFailure(message.note_id, error.message);
    }

    // Rethrow error to let SQS handle backoffs and DLQ transitions natively
    throw error;
  }
};