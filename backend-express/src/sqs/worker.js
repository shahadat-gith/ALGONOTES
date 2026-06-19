// src/sqs/worker.js

import aiClient from '../config/gemini.js';
import Note from '../models/note.model.js';
import Theory from '../models/theory.model.js';
import TempPromptJob from '../models/temp.model.js';
import { generateNotePrompt, generateTheoryPrompt } from '../prompts/index.js';

// Helper utility to pause execution for a specific duration
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// DSA NOTES GENERATOR EXECUTOR
// ==========================================
export const executeNoteGeneration = async (message) => {
  const { note_id, user_id, problemLink, userCode, language, userNotes } = message;

  let note = null;

  // Retry loop to handle MongoDB replication/write lag gracefully
  for (let attempt = 1; attempt <= 3; attempt++) {
    note = await Note.findById(note_id);
    if (note) break; // Record found, break early!

    console.log(`[Worker Sync] DSA Note ${note_id} not found yet. Retrying attempt ${attempt}/3...`);
    await sleep(1000); // Back off 1 second before querying again
  }

  if (!note) {
    throw new Error(`Note ${note_id} missing completely from MongoDB after 3 attempts.`);
  }

  if (note.user_id.toString() !== user_id.toString()) {
    throw new Error('User identifier verification mismatch.');
  }

  const prompt = generateNotePrompt(
    problemLink,
    userCode,
    language,
    userNotes || ''
  );

  const response = await aiClient.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  if (!response.text) {
    throw new Error('Gemini engine interface returned an empty text string container.');
  }

  const aiData = JSON.parse(response.text);
  const noteJson = aiData.note || {};

  note.problem = {
    problemLink: aiData.problem?.problemLink || '',
    title: aiData.problem?.title || '',
    platform: aiData.problem?.platform || '',
    difficulty: aiData.problem?.difficulty || '',
  };

  note.note = {
    intuition: noteJson.intuition || '',
    edgeCases: noteJson.edgeCases || [],
    mistakesToAvoid: noteJson.mistakesToAvoid || [],
    dryRun: noteJson.dryRun || [],
    bruteForce: noteJson.bruteForce || null,
    better: noteJson.better || null,
    optimalApproach: noteJson.optimalApproach || null,
  };

  note.userNotes = (aiData.userNotes || '').trim();
  note.status = 'draft';
  note.updatedAt = new Date();

  await note.save();
  console.log(`[Worker Pipeline] DSA Note processed and saved successfully: ${note_id}`);
};

// ==========================================
// THEORY GENERATOR EXECUTOR
// ==========================================
export const executeTheoryGeneration = async (message) => {
  const { theory_id, user_id, topic, code_language, instructions } = message;

  let theory = null;

  // Retry loop to handle MongoDB replication/write lag gracefully
  for (let attempt = 1; attempt <= 3; attempt++) {
    theory = await Theory.findById(theory_id);
    if (theory) break; // Record found, break early!

    console.log(`[Worker Sync] Theory note ${theory_id} not found yet. Retrying attempt ${attempt}/3...`);
    await sleep(1000); // Back off 1 second before querying again
  }

  if (!theory) {
    throw new Error(`Theory record ${theory_id} missing completely from MongoDB after 3 attempts.`);
  }

  if (theory.user_id.toString() !== user_id.toString()) {
    throw new Error('User identifier verification mismatch.');
  }

  const prompt = generateTheoryPrompt(
    topic,
    code_language || 'C++',
    instructions
  );

  const response = await aiClient.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  if (!response.text) {
    throw new Error('Gemini engine interface returned an empty text string container.');
  }

  theory.content = response.text.trim();
  theory.status = 'draft';
  theory.updatedAt = new Date();

  await theory.save();
  console.log(`[Worker Pipeline] Theory note processed and saved successfully: ${theory_id}`);
};

// ==========================================
// PROMPT OPTIMIZATION EXECUTOR
// ==========================================
export const executePromptOptimization = async (message) => {
  const { job_id, topic, code_language, instructions } = message;

  const job = await TempPromptJob.findById(job_id);
  if (!job) {
    throw new Error(`Transient prompt tracker ${job_id} missing or expired.`);
  }

  const systemInstruction = 
    "You are an expert prompt engineer. Take the user's unorganized notes, " +
    "rough requirements, or messy copy-pastes about a topic and convert them into an optimized, " +
    "highly clear markdown list of instructions. Use simple, everyday, accessible language. " +
    "Ensure it tells the AI to explain basics cleanly, show memory layouts using descriptive text configurations, " +
    "and provide working code block traces. Output ONLY the optimized markdown instructions. Do not include introductory text.";

  const userContent = 
    `Topic: ${topic}\n` +
    `Programming Code Language: ${code_language || 'C++'}\n` +
    `Rough Notes/Requirements:\n"""\n${instructions || ''}\n"""`;

  const response = await aiClient.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userContent,
    config: {
      systemInstruction: systemInstruction,
    },
  });

  if (!response.text) {
    throw new Error('Gemini interface engine returned an empty prompt response string context.');
  }

  job.optimized_instructions = response.text.trim();
  job.status = 'final';

  await job.save();
  console.log(`[Worker Pipeline] Prompt optimization complete for transient job: ${job_id}`);
};