import Note from '../models/note.model.js';
import Theory from '../models/theory.model.js';
import TempPromptJob from '../models/temp.model.js';

/**
 * Updates the database status to failed when a DSA note task encounters a severe problem.
 */
export const handleNoteGenerationFailure = async (noteId, reason) => {
  const note = await Note.findById(noteId);
  if (!note) return;

  note.status = 'failed';
  note.updatedAt = new Date();
  await note.save();
  console.error(`[Worker Exception] Note job ${noteId} marked as failed. Reason: ${reason}`);
};

/**
 * Updates the database status to failed when an academic theory generation process breaks down.
 */
export const handleTheoryGenerationFailure = async (theoryId, reason) => {
  const theory = await Theory.findById(theoryId);
  if (!theory) return;

  theory.status = 'failed';
  theory.updatedAt = new Date();
  await theory.save();
  console.error(`[Worker Exception] Theory job ${theoryId} marked as failed. Reason: ${reason}`);
};

/**
 * Handles terminal prompt optimization exceptions.
 * Deletes the temporary tracking record instantly to keep database footprint clean.
 */
export const handlePromptOptimizationFailure = async (jobId, reason) => {
  const job = await TempPromptJob.findById(jobId);
  if (!job) return;

  await TempPromptJob.findByIdAndDelete(jobId);
  console.error(`[Worker Exception] Ephemeral prompt job ${jobId} deleted on failure. Reason: ${reason}`);
};