import Note from "../models/note.model.js";
import Problem from "../models/problem.model.js";
import ai from "../configs/gemini.js";
import { generateNotePrompt } from "../constants/prompts.js";
import { trackUserActivity } from "../utils/trackUserActivity.js";

/**
 * @desc    Trigger Gemini to analyze solution code and return a structured note block
 * @route   POST /api/v1/notes/generate/:problemId
 * @access  Protected
 */
export const generateAiNote = async (req, res, next) => {
  try {
    const { problemId } = req.params;

    // 1. Verify problem context belongs to requesting entity
    const problem = await Problem.findOne({ _id: problemId, user: req.user._id });
    if (!problem) {
      const error = new Error("Problem reference not found.");
      error.statusCode = 404;
      return next(error);
    }

    // 2. Generate the prompt dynamically using our clean utility function
    const prompt = generateNotePrompt(problem);

    // 3. Request structured completion execution from pre-configured AI client
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    // 4. Clean and parse AI block
    const noteData = JSON.parse(response.text);

    // 5. Return the draft representation back to your web application workspace interface
    res.status(200).json({
      success: true,
      message: "Study notes drafted successfully via AI engine.",
      draft: {
        problem: problemId,
        user: req.user._id,
        ...noteData,
        status: "draft"
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save or Update a modified study note document block to database storage clusters
 * @route   POST /api/v1/notes/save
 * @access  Protected
 */
export const saveNote = async (req, res, next) => {
  try {
    const {
      problem,
      bruteForce,
      optimalApproach,
      algorithm,
      dryRun,
      edgeCases,
      status,
    } = req.body;

    if (!problem) {
      const error = new Error("Problem id is missing.");
      error.statusCode = 400;
      return next(error);
    }

    // 1. Check if the note already exists before executing the query
    // This allows us to track whether this operation is a true creation or an update
    const existingNote = await Note.findOne({ problem, user: req.user._id }).select("_id");

    // 2. Atomically upsert (update if exists, insert if new) the user document
    const savedNote = await Note.findOneAndUpdate(
      { problem, user: req.user._id },
      {
        bruteForce,
        optimalApproach,
        algorithm,
        dryRun,
        edgeCases,
        status: status || "draft",
        lastEditedAt: Date.now(),
      },
      { new: true, upsert: true, runValidators: true },
    );

    // 3. Trigger tracking grid logic *only* on true note creation instances
    if (!existingNote) {
      trackUserActivity(req.user._id, "note");
    }

    // 4. Return response
    res.status(200).json({
      success: true,
      message: `Note saved successfully as a ${savedNote.status}.`,
      note: savedNote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch an existing note matching a problem reference
 * @route   GET /api/v1/notes/:problemId
 * @access  Protected
 */
export const getNoteByProblem = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      problem: req.params.problemId,
      user: req.user._id,
    });

    if (!note) {
      return res.status(200).json({
        success: false,
        message: "No saved notes exist yet for this specified execution item.",
        note: null,
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};



/**
 * @desc    Force regenerate and sync AI study notes after modifying user code base
 * @route   POST /api/v1/notes/regenerate/:problemId
 * @access  Protected
 */
export const regenerateAiNote = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    // 1. Confirm the updated problem exists and belongs to the user
    const problem = await Problem.findOne({ _id: problemId, user: userId });
    if (!problem) {
      const error = new Error("Problem entry reference not found.");
      error.statusCode = 404;
      return next(error);
    }

    // 2. Feed the modified codebase through your pre-configured prompt layer generator
    const updatePrompt = generateNotePrompt(problem);

    // 3. Dispatch stream payload request directly to the Gemini execution clusters
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: updatePrompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const refreshedNoteData = JSON.parse(response.text);

    // 4. Update the note directly, retaining its status or updating it automatically
    const updatedNote = await Note.findOneAndUpdate(
      { problem: problemId, user: userId },
      {
        bruteForce: refreshedNoteData.bruteForce,
        optimalApproach: refreshedNoteData.optimalApproach,
        algorithm: refreshedNoteData.algorithm,
        dryRun: refreshedNoteData.dryRun,
        edgeCases: refreshedNoteData.edgeCases,
        lastEditedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      const error = new Error("No existing note record was found to update. Try generating a draft instead.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "AI study block successfully updated and synchronized.",
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get all study notes created by the currently authenticated user
 * @route   GET /api/v1/notes/user
 * @access  Protected
 */
export const getAllNotesByUser = async (req, res) => {
  try {
    // 1. Extract the authenticated user's ID from the request guard middleware
    // req.user.id is typically populated by your JWT auth middleware
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed. Missing user reference token."
      });
    }

    // 2. Query the database for notes matching this user ID
    const userNotes = await Note.find({ user: userId })
      .populate("problem", "title platform difficulty language")
      .sort({ updatedAt: -1 });

    // 3. Return the payload safely to the frontend
    return res.status(200).json({
      success: true,
      count: userNotes.length,
      notes: userNotes
    });

  } catch (error) {
    console.error("Error inside getAllNotesByUser controller:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while retrieving your study notes.",
      error: error.message
    });
  }
};