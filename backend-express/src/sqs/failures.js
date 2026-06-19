// src/sqs/failures.js

import Note from '../models/note.model.js';
import Theory from '../models/theory.model.js';
import TempPromptJob from '../models/temp.model.js';

/**
 * Permanently deletes a failed DSA note document from MongoDB.
 */
export const handleNoteGenerationFailure = async (noteId, reason) => {
  try {
    console.log(`[Failure Handler] Purging failed DSA Note doc: ${noteId}. Reason: ${reason}`);
    await Note.findByIdAndDelete(noteId);
  } catch (err) {
    console.error(`[Failure Handler Error] Failed to delete Note doc ${noteId}: ${err.message}`);
  }
};

/**
 * Permanently deletes a failed Theory note document from MongoDB.
 */
export const handleTheoryGenerationFailure = async (theoryId, reason) => {
  try {
    console.log(`[Failure Handler] Purging failed Theory doc: ${theoryId}. Reason: ${reason}`);
    await Theory.findByIdAndDelete(theoryId);
  } catch (err) {
    console.error(`[Failure Handler Error] Failed to delete Theory doc ${theoryId}: ${err.message}`);
  }
};

/**
 * Handles terminal prompt optimization exceptions by deleting the transient tracker.
 */
export const handlePromptOptimizationFailure = async (jobId, reason) => {
  try {
    console.log(`[Failure Handler] Purging transient Prompt Job doc: ${jobId}. Reason: ${reason}`);
    await TempPromptJob.findByIdAndDelete(jobId);
  } catch (err) {
    console.error(`[Failure Handler Error] Failed to delete Prompt Job doc ${jobId}: ${err.message}`);
  }
};