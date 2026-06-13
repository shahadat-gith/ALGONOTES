import User from "../models/user.model.js";
import Problem from "../models/problem.model.js"
import Note from "../models/note.model.js"
import Activity from "../models/activity.model.js";
import uploadImageToCloudinary from "../services/cloudinary.service.js";
import cloudinary from "../configs/cloudinary.js";

/**
 * @desc    Get currently logged-in user details
 * @route   GET /api/v1/users/me
 * @access  Private (Requires authentication middleware passing req.user)
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    // Because authMiddleware already loaded the user object safely onto req.user,
    // we can return it instantly without making a redundant database query trip.
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile data (Text details + avatar image swap)
 * @route   PUT /api/v1/users/profile
 * @access  Private (Requires authentication middleware passing req.user)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, username } = req.body;
    const userId = req.user._id;

    // 1. Fetch user document
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User account not found.");
      error.statusCode = 404;
      return next(error);
    }

    // 2. Handle Username Updates Safely
    if (username) {
      const cleanUsername = username.trim().toLowerCase();

      // Ensure username isn't stolen by another active user record
      const existingUsername = await User.findOne({
        username: cleanUsername,
        _id: { $ne: userId },
      });

      if (existingUsername) {
        const error = new Error(
          "Username is already taken by another profile.",
        );
        error.statusCode = 409; // Conflict status code
        return next(error);
      }

      user.username = cleanUsername;
    }

    // 3. Handle Name Updates
    if (name) {
      user.name = name.trim();
    }

    // 4. Handle Avatar File Upload Switch streams
    if (req.file) {
      // Clean up old media resources hosted on Cloudinary bucket if they exist
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      // Stream the image directly using our verified buffer service
      const result = await uploadImageToCloudinary(req.file, "algonotes/users");

      user.avatar = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // 5. Commit mutations to MongoDB
    await user.save();

    // 6. Fetch sanitized user object excluding explicit fields
    // This provides consistency with your authentication check route formats
    const sanitizedUser = await User.findById(userId).select(
      "-password -verificationOptions.otp -verificationOptions.otpExpiry -forgotPasswordOptions"
    );

    // 7. Return standard structured sanitized response dictionary
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: sanitizedUser, // Sends the fully populated user model safely sans secrets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Completely erase user profile accounts from the system
 * @route   DELETE /api/v1/users/account
 * @access  Private (Requires authentication middleware passing req.user)
 */
export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Fetch user to locate active image attachments for manual bucket storage wipeout
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User account not found.");
      error.statusCode = 404;
      return next(error);
    }

    // 2. Clear old profile pictures out of Cloudinary storage nodes safely before pulling account entry
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // 3. Atomically remove the profile row entry from database clusters. Cascade delete user data clusters out of MongoDB storage
    await Problem.deleteMany({ user: userId });
    await Note.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message:
        "Your profile account has been permanently deactivated and erased.",
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Search user-specific problems and notes exclusively
 * @route   GET /api/v1/users/search
 * @access  Private (Requires authentication middleware passing req.user)
 */

export const searchWorkspace = async (req, res, next) => {
  try {
    const { q } = req.query;
    const userId = req.user._id;

    if (!q) {
      return res.status(200).json({ success: true, results: [] });
    }

    const searchRegex = new RegExp(q, "i");

    // Query both collections in parallel with deep text parsing
    const [problems, notes] = await Promise.all([
      // 1. Standard Problem Matching (Title Search)
      Problem.find({ 
        user: userId, 
        title: searchRegex 
      })
      .limit(5)
      .select("title difficulty"),

      // 2. Note Matching: Search by Parent Problem Title OR check nested content blocks
      Note.find({ user: userId })
        .populate({
          path: "problem",
          select: "title difficulty",
        })
        .find({
          $or: [
            // Look for matching text strings inside the nested bruteForce and optimalApproach arrays
            { "bruteForce.text": searchRegex },
            { "bruteForce.code": searchRegex },
            { "optimalApproach.text": searchRegex },
            { "optimalApproach.code": searchRegex },
            // Look for matches inside your custom algorithm step fields
            { "algorithm.title": searchRegex },
            { "algorithm.description": searchRegex },
            // Look for matches inside edge case definitions
            { "edgeCases.case": searchRegex },
            { "edgeCases.explanation": searchRegex }
          ]
        })
        .limit(5)
    ]);

    // Format Problem Outputs
    const problemResults = problems.map(p => ({
      name: p.title,
      path: `/problems/${p._id}`,
      type: "problem",
      desc: `${p.difficulty || "Unknown"} Difficulty`
    }));

    // Format Note Outputs (Safely filter out any notes with a broken/missing problem ref)
    const noteResults = notes
      .filter(n => n.problem) 
      .map(n => {
        // Find the first nested text match to generate a smart dynamic contextual snippet description
        const snippet = 
          n.optimalApproach.find(b => b.text)?.text || 
          n.bruteForce.find(b => b.text)?.text || 
          n.algorithm[0]?.description || 
          "View AI Study Blocks";

        return {
          name: `${n.problem.title} Notes`, // Pull the populated parent problem title dynamically
          path: `/notes/${n._id}`,
          type: "note",
          desc: snippet.length > 55 ? `${snippet.substring(0, 55)}...` : snippet
        };
      });

    res.status(200).json({
      success: true,
      results: [...problemResults, ...noteResults]
    });
  } catch (error) {
    next(error);
  }
};




/**
 * @desc    Fetch comprehensive workspace compilation metrics for User Control Deck
 * @route   GET /api/v1/users/dashboard-metrics
 * @access  Private
 */
export const getDashboardMetrics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Establish 365-day boundary for the contribution heat-map
    const lookbackDate = new Date();
    lookbackDate.setFullYear(lookbackDate.getFullYear() - 1);
    
    const thresholdKey = parseInt(
      `${lookbackDate.getFullYear()}${String(lookbackDate.getMonth() + 1).padStart(2, "0")}${String(lookbackDate.getDate()).padStart(2, "0")}`,
      10
    );

    // 2. Fire independent analytical lookups in parallel for maximum execution speed
    const [
      totalProblemsCount,
      totalNotesCount,
      difficultySplits,
      recentProblems,
      recentNotes,
      activities
    ] = await Promise.all([
      // Total Problems Counters
      Problem.countDocuments({ user: userId }),

      // Total Notes Counters
      Note.countDocuments({ user: userId }),

      // Aggregate Difficulty splits natively in MongoDB
      Problem.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$difficulty", count: { $sum: 1 } } }
      ]),

      // Recent Activity Stream: Problems
      Problem.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .select("title platform difficulty createdAt"),

      // Recent Activity Stream: Notes with populated problem contexts
      Note.find({ user: userId })
        .populate({
          path: "problem",
          select: "title",
        })
        .sort({ lastEditedAt: -1, updatedAt: -1 })
        .limit(3)
        .select("status lastEditedAt updatedAt optimalApproach bruteForce algorithm"),

      // Git-style Activity Grid records
      Activity.find({
        user: userId,
        dayKey: { $gte: thresholdKey }
      })
      .select("dayKey totalCount problemsAdded notesGenerated")
      .sort({ dayKey: 1 })
    ]);

    // 3. Format and clean Mongoose aggregation array back into an explicit dictionary shape
    const difficultyMap = { easy: 0, medium: 0, hard: 0 };
    difficultySplits.forEach(split => {
      if (split._id) {
        const key = split._id.toLowerCase();
        if (key in difficultyMap) difficultyMap[key] = split.count;
      }
    });

    // 4. Map row data array into our lightning-fast O(1) tracking dictionary map
    const activityMap = {};
    activities.forEach(act => {
      activityMap[act.dayKey] = {
        total: act.totalCount,
        problems: act.problemsAdded,
        notes: act.notesGenerated
      };
    });

    // 5. Build dynamic text previews for recent study blocks
    const formattedRecentNotes = recentNotes
      .filter(n => n.problem)
      .map(n => {
        const snippet = 
          n.optimalApproach?.find(b => b.text)?.text || 
          n.bruteForce?.find(b => b.text)?.text || 
          n.algorithm?.[0]?.description || 
          "Open Study Deck";

        return {
          _id: n._id,
          title: `${n.problem.title} Notes`,
          status: n.status,
          updated: n.lastEditedAt || n.updatedAt,
          desc: snippet.length > 60 ? `${snippet.substring(0, 60)}...` : snippet
        };
      });

    // 6. Return unified multi-system response structure
    res.status(200).json({
      success: true,
      data: {
        counters: {
          totalProblems: totalProblemsCount,
          totalNotes: totalNotesCount,
          difficulty: difficultyMap
        },
        recentActivity: {
          problems: recentProblems,
          notes: formattedRecentNotes
        },
        activityGrid: activityMap
      }
    });
  } catch (error) {
    next(error);
  }
};