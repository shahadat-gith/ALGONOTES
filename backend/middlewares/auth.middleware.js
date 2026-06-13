import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if token header exists and follows Bearer schema
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Unauthorized. Token missing or malformed.");
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token (if it fails/expires, it throws directly to the catch block)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Exclude password AND sensitive internal verification fields from tracking payloads
    const user = await User.findById(decoded.userId).select(
      "-password -verificationOptions.otp -verificationOptions.otpExpiry -forgotPasswordOptions",
    );

    if (!user) {
      const error = new Error("Unauthorized. User account not found.");
      error.statusCode = 401;
      return next(error);
    }

    // 4. Attach user payload to the request object for downstream controllers
    req.user = user;
    next();
  } catch (error) {
    // If it's a JWT library error, your error middleware handles the message format.
    // Otherwise, ensure it defaults to a 401 Unauthorized status code.
    if (!error.statusCode) {
      error.statusCode = 401;
    }
    next(error);
  }
};
