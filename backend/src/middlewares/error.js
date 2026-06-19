import { AppException } from '../utils/appException.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error.';

  // 1. Handle Custom Manual Application Errors
  if (err instanceof AppException) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // 2. Handle Mongoose Resource Missing (CastError / Valid ObjectId mismatch)
  else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Requested resource not found in the database.';
  }

  // 3. Handle MongoDB Unique Index Constraint Violations (DuplicateKeyError / Code 11000)
  else if (err.code === 11000) {
    statusCode = 400;
    const errorField = Object.keys(err.keyValue || {})[0] || '';
    
    if (errorField === 'email') {
      message = 'An account with this email already exists.';
    } else if (errorField === 'username') {
      message = 'Username is already taken by another profile.';
    } else {
      message = 'A record with these unique details already exists.';
    }
  }

  // 4 & 5. Handle Invalid & Expired Session JWTs
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Json Web Token is invalid, try again.';
  } 
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Json Web Token has expired, please log in again.';
  }

  // 6. Handle Zod/Validation Mismatches (Catches malformed body payloads)
  else if (err.name === 'ZodError' || err.isJoi || err.name === 'ValidationError') {
    statusCode = 422;
    if (err.issues && err.issues.length > 0) {
      // Formats path fields matching Zod's error formatting array
      message = `Field '${err.issues[0].path.join('.')}': ${err.issues[0].message}`;
    } else {
      message = err.message || 'Invalid request payload.';
    }
  }

  // 7. Final Global Fallback Guard (Catches unexpected server errors)
  else {
    if (statusCode === 500) {
      console.error(`💥 CRITICAL GLOBAL SYSTEM FAILURE: ${err.stack || err}`);
      message = 'Internal Server Error.';
    }
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};