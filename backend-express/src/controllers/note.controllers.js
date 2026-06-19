import Note from '../models/note.model.js';
import { enqueueNoteGeneration } from '../sqs/dispatchers.js';
import { AppException } from '../utils/appException.js';

export const generateAiNote = async (req, res, next) => {
  try {
    const { problemLink, language, userCode, userNotes } = req.body;

    if (!problemLink) {
      throw new AppException('Problem link is required.', 422);
    }

    const newNote = new Note({
      user_id: req.user._id,
      status: 'processing',
      problem: {
        title: "",
        problemLink: problemLink.trim(),
        platform: "",
        difficulty: "",
        description: "",
        constraints: [],
        testCases: [],
        expectedTimeComplexity: "",
        expectedSpaceComplexity: "",
        topics: []
      },
      note: {
        intuition: "",
        edgeCases: [],
        mistakesToAvoid: [],
        dryRun: [],
        bruteForce: null,
        better: null,
        optimalApproach: null
      },
      language: language || "C++",
      userCode: userCode || "",
      userNotes: userNotes || "",
    });

    await newNote.save({ 
      w: 'majority', 
      j: true, 
      wtimeout: 5000 
    });
    
    const noteId = newNote._id.toString();

    try {
      await enqueueNoteGeneration({
        note_id: noteId,
        user_id: req.user._id.toString(),
        problemLink: problemLink,
        userCode: userCode || "",
        language: language || "",
        userNotes: userNotes || ""
      });
    } catch (queueError) {
      console.error(`[API Critical Exception] SQS dispatch failed: ${queueError.message}`);
      if (newNote) await newNote.deleteOne().catch(() => {});
      throw new AppException('Failed to queue AI generation job.', 500);
    }

    res.status(202).json({
      success: true,
      message: 'AI note generation queued.',
      status: 'processing',
      id: noteId
    });
  } catch (error) {
    console.error('[CRITICAL DATABASE SAVE CRASH]:', error);
    next(error);
  }
};

export const checkNoteGenerationStatus = async (req, res, next) => {
  try {
    const { note_id } = req.params;
    
    const note = await Note.findById(note_id);

    if (!note) {
      return res.status(204).json({
        success: false,
        status: 404,
        message: "The note generation session was not found or was rolled back due to an internal failure."
      });
    }

    if (note.user_id.toString() !== req.user._id.toString()) {
      throw new AppException('Unauthorized access.', 403);
    }

    if (note.status === 'failed') {
      return res.status(200).json({
        success: true,
        status: 'failed',
        message: 'AI is currently experiencing high demand. Please try again in a few minutes.',
        id: note._id.toString()
      });
    }

    const structuredStatus = note.status === 'draft' ? 'final' : note.status;

    res.status(200).json({
      success: true,
      status: structuredStatus,
      id: note._id.toString()
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotesByUser = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const size = Math.min(50, Math.max(1, parseInt(req.query.size, 10) || 10));
    const search = req.query.search ? req.query.search.trim() : null;
    const skip = (page - 1) * size;

    const baseFilter = {
      user_id: req.user._id,
      status: { $in: ['draft', 'final'] }
    };

    if (search) {
      baseFilter.$or = [
        { language: { $regex: search, $options: 'i' } },
        { 'problem.title': { $regex: search, $options: 'i' } },
        { 'problem.platform': { $regex: search, $options: 'i' } },
        { 'problem.difficulty': { $regex: search, $options: 'i' } }
      ];
    }

    const totalItems = await Note.countDocuments(baseFilter);
    const notes = await Note.find(baseFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size);

    const totalPages = totalItems ? Math.ceil(totalItems / size) : 1;

    res.status(200).json({
      success: true,
      notes,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: size,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteByNoteId = async (req, res, next) => {
  try {
    const { note_id } = req.params;
    const note = await Note.findById(note_id);

    if (!note || note.user_id.toString() !== req.user._id.toString()) {
      throw new AppException('Note not found.', 404);
    }

    if (note.status === 'processing') {
      return res.status(202).json({
        success: false,
        message: 'Note generation is still processing.'
      });
    }

    res.status(200).json({
      success: true,
      note
    });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { note_id } = req.params;
    const payload = req.body;

    const note = await Note.findById(note_id);

    if (!note || note.user_id.toString() !== req.user._id.toString()) {
      throw new AppException('Note not found.', 404);
    }

    if (payload.status !== undefined) note.status = payload.status;
    if (payload.problem !== undefined) note.problem = { ...note.problem, ...payload.problem };
    if (payload.language !== undefined) note.language = payload.language;
    if (payload.userCode !== undefined) note.userCode = payload.userCode;
    if (payload.userNotes !== undefined) note.userNotes = payload.userNotes;

    if (payload.note !== undefined) {
      note.note = { ...note.note, ...payload.note };
    }

    note.updatedAt = new Date();
    await note.save();

    res.status(200).json({
      success: true,
      message: `Note updated successfully as ${note.status}.`,
      note
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { note_id } = req.params;
    const note = await Note.findById(note_id);

    if (!note || note.user_id.toString() !== req.user._id.toString()) {
      throw new AppException('Note not found.', 404);
    }

    await Note.findByIdAndDelete(note_id);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};