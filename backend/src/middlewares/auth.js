import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    const userId = payload.userId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};