import { 
  executeNoteGeneration, 
  executeTheoryGeneration, 
  executePromptOptimization 
} from './worker.js';

import { 
  handleNoteGenerationFailure, 
  handleTheoryGenerationFailure,
} from './failures.js';

// Using your exact explicit model import path
import TempPromptJob from '../models/temp.model.js';

/**
 * Parses and routes incoming background SQS messages to their 
 * respective heavy AI processing execution pathways.
 * * @param {Object} message - Raw message payload unmarshalled from the SQS event string
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

    // Gracefully handle catastrophic pipeline exceptions based on specific transaction domains
    if (jobType === 'optimize_prompt') {
      try {
        const job = await TempPromptJob.findById(message.job_id);
        if (job) {
          job.status = 'failed';
          // Save error string context into instructions tracking space
          job.optimized_instructions = `Prompt Optimization Stream Fault: ${error.message}`;
          await job.save();
        }
      } catch (dbError) {
        console.error(`[SQS Router Fatal] Failed to flag prompt tracker fallback state: ${dbError.message}`);
      }
    } else if (jobType === 'theory') {
      await handleTheoryGenerationFailure(message.theory_id, error.message);
    } else {
      await handleNoteGenerationFailure(message.note_id, error.message);
    }

    // Rethrow error so SQS message acknowledges the transaction failed and increments retry backoffs
    throw error;
  }
};