import { 
  executeNoteGeneration, 
  executeTheoryGeneration, 
  executePromptOptimization 
} from './worker.js';


import { 
  handleNoteGenerationFailure, 
  handleTheoryGenerationFailure 
} from './failures.js';


import TempPromptJob from '../models/temp.model.js';


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

    // Gracefully pipe failures based on specific transaction groups
    if (jobType === 'optimize_prompt') {
      const job = await TempPromptJob.findById(message.job_id);
      if (job) {
        job.status = 'failed';
        job.error_message = error.message;
        await job.save();
      }
    } else if (jobType === 'theory') {
      await handleTheoryGenerationFailure(message.theory_id, error.message);
    } else {
      await handleNoteGenerationFailure(message.note_id, error.message);
    }

    throw error;
  }
};