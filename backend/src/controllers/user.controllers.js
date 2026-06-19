import User from '../models/user.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.js';
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