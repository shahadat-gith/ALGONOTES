import User from '../models/user.model.js';
import Note from '../models/note.model.js';
import Theory from '../models/theory.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.js';
import { buildAnalyticsStats } from '../services/analytics.js';
import { serializeUser } from '../utils/serializeUser.js';
import { AppException } from '../utils/appException.js';

export const getCurrentUserDetails = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: serializeUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, username } = req.body;
    const currentUser = req.user;

    if (username) {
      const cleanUsername = username.trim().toLowerCase();

      const existingUser = await User.findOne({
        username: cleanUsername,
        _id: { $ne: currentUser._id },
      });

      if (existingUser) {
        throw new AppException('Username already taken.', 409);
      }

      currentUser.username = cleanUsername;
    }

    if (name) {
      currentUser.name = name.trim();
    }

    if (req.file) {
      if (currentUser.avatar && currentUser.avatar.public_id) {
        await deleteFromCloudinary(currentUser.avatar.public_id);
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer, 'algonotes/users');

      currentUser.avatar = {
        url: uploadResult.secure_url || '',
        public_id: uploadResult.public_id || '',
      };
    }

    await currentUser.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: serializeUser(currentUser),
    });
  } catch (error) {
    next(error);
  }
};


export const getDashboardData = async (req, res, next) => {
  try {
    const publishedStatuses = ['draft', 'final'];

    const [
      totalCodingNotes,
      totalTheoryNotes,
      pendingNoteDrafts,
      pendingTheoryDrafts,
      recentNotes,
      recentTheories,
      platformStats,
    ] = await Promise.all([
      Note.countDocuments({
        user_id: req.user._id,
        status: { $in: publishedStatuses },
      }),
      Theory.countDocuments({
        user_id: req.user._id,
        status: { $in: publishedStatuses },
      }),
      Note.countDocuments({
        user_id: req.user._id,
        status: 'draft',
      }),
      Theory.countDocuments({
        user_id: req.user._id,
        status: 'draft',
      }),
      Note.find({
        user_id: req.user._id,
        status: { $in: publishedStatuses },
      })
        .sort({ updatedAt: -1 })
        .limit(5),
      Theory.find({
        user_id: req.user._id,
        status: { $in: publishedStatuses },
      })
        .sort({ updatedAt: -1 })
        .limit(5),
      buildAnalyticsStats(),
    ]);

    const noteActivity = recentNotes.map((note) => ({
      id: note._id.toString(),
      type: 'DSA',
      title: note.problem?.title || 'Untitled coding note',
      info: [note.problem?.platform, note.language].filter(Boolean).join(' • ') || 'Coding note',
      status: note.status,
      href: `/notes/${note._id}`,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));

    const theoryActivity = recentTheories.map((theory) => ({
      id: theory._id.toString(),
      type: 'Theory',
      title: theory.topic || 'Untitled theory note',
      info: 'Theory note',
      status: theory.status,
      href: `/theory/${theory._id}`,
      createdAt: theory.createdAt,
      updatedAt: theory.updatedAt,
    }));

    const recentActivity = [...noteActivity, ...theoryActivity]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 6);

    res.status(200).json({
      success: true,
      dashboard: {
        greetingName: req.user.name,
        stats: {
          totalCodingNotes,
          totalTheoryNotes,
          pendingDrafts: pendingNoteDrafts + pendingTheoryDrafts,
        },
        recentActivity,
        platformStats,
      },
    });
  } catch (error) {
    next(error);
  }
};