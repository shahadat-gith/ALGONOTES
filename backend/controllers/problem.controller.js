import Problem from "../models/problem.model.js";
import { trackUserActivity } from "../utils/trackUserActivity.js";

/**
 * @desc    Log a newly solved coding problem
 * @route   POST /api/v1/problems
 * @access  Private
 */
export const createProblem = async (req, res, next) => {
  try {
    const { title, platform, problemLink, difficulty, language, topics, userCode } = req.body;

    // 1. Validation check
    if (!title || !language || !userCode) {
      const error = new Error("Please provide problem title, programming language, and your solution code.");
      error.statusCode = 400;
      return next(error);
    }

    // 2. Commit document to MongoDB
    const newProblem = await Problem.create({
      user: req.user._id, // Injected securely by authMiddleware
      title,
      platform,
      problemLink,
      difficulty,
      language,
      topics,
      userCode,
    });

    // 3. Fire-and-forget activity tracker hook
    // We execute this asynchronously without 'await' so user notification speeds don't lag
    trackUserActivity(req.user._id, "problem");

    // 4. Return successful JSON creation response
    res.status(201).json({
      success: true,
      message: "Problem logged successfully.",
      problem: newProblem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all problems logged by the active user
 * @route   GET /api/v1/problems
 * @access  Private
 */
export const getAllProblems = async (req, res, next) => {
  try {
    const problems = await Problem.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get a single problem belonging to the authenticated user
 * @route   GET /api/v1/problems/:id
 * @access  Private
 */
export const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!problem) {
      const error = new Error("Problem not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Update an existing problem logged by the authenticated user
 * @route   PUT /api/v1/problems/:id
 * @access  Private
 */
export const updateProblem = async (req, res, next) => {
  try {
    const {
      title,
      platform,
      problemLink,
      difficulty,
      language,
      topics,
      userCode,
      isBookmarked,
      needsRevision,
    } = req.body;

    const problem = await Problem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!problem) {
      const error = new Error("Problem not found.");
      error.statusCode = 404;
      return next(error);
    }

    if (title !== undefined) problem.title = title;
    if (platform !== undefined) problem.platform = platform;
    if (problemLink !== undefined) problem.problemLink = problemLink;
    if (difficulty !== undefined) problem.difficulty = difficulty;
    if (language !== undefined) problem.language = language;
    if (topics !== undefined) problem.topics = topics;
    if (userCode !== undefined) problem.userCode = userCode;
    if (isBookmarked !== undefined)
      problem.isBookmarked = isBookmarked;
    if (needsRevision !== undefined)
      problem.needsRevision = needsRevision;

    await problem.save();

    res.status(200).json({
      success: true,
      message: "Problem updated successfully.",
      problem,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Delete a problem and its associated note document
 * @route   DELETE /api/v1/problems/:id
 * @access  Private
 */
export const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!problem) {
      const error = new Error("Problem not found.");
      error.statusCode = 404;
      return next(error);
    }

    await Note.findOneAndDelete({
      problem: problem._id,
      user: req.user._id,
    });

    await Problem.findByIdAndDelete(problem._id);

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get dashboard metrics & topic insights for the authenticated user
 * @route   GET /api/v1/problems/stats
 * @access  Private
 */
export const getProblemStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const statsPipeline = await Problem.aggregate([
      // 1. Filter problems matching the current active user
      { $match: { user: userId } },
      
      // 2. Multi-faceted execution to run independent tracking lists concurrently
      {
        $facet: {
          // Track problem counts broken down by difficulty breakdown bands
          byDifficulty: [
            { $group: { _id: "$difficulty", count: { $sum: 1 } } }
          ],
          // Unwind topics array and calculate total frequency count per tag
          byTopic: [
            { $unwind: "$topics" },
            { $group: { _id: "$topics", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 } // Return top 10 most revised/solved problem topics
          ],
          // Track general feature aggregate metrics flags
          metaCounters: [
            {
              $group: {
                _id: null,
                totalSolved: { $sum: 1 },
                bookmarkedCount: { $sum: { $cond: [{ $eq: ["$isBookmarked", true] }, 1, 0] } },
                needsRevisionCount: { $sum: { $cond: [{ $eq: ["$needsRevision", true] }, 1, 0] } }
              }
            }
          ]
        }
      }
    ]);

    // Format the response securely so your frontend charts can read it easily
    const rawData = statsPipeline[0];
    const meta = rawData.metaCounters[0] || { totalSolved: 0, bookmarkedCount: 0, needsRevisionCount: 0 };

    // Format the difficulty counts into a clean key-value object
    const difficultyDistribution = { Easy: 0, Medium: 0, Hard: 0 };
    rawData.byDifficulty.forEach(item => {
      if (item._id in difficultyDistribution) {
        difficultyDistribution[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProblemsLogged: meta.totalSolved,
        bookmarked: meta.bookmarkedCount,
        needsRevision: meta.needsRevisionCount,
        breakdown: difficultyDistribution,
        topTopics: rawData.byTopic.map(t => ({ name: t._id, count: t.count }))
      }
    });
  } catch (error) {
    next(error);
  }
};