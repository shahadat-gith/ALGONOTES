const errorMiddleware = (err, req, res, next) => {
  // If a custom status code was attached to the error object, use it; otherwise default to 500
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 1. Handle Wrong MongoDB Id error (CastError)
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  // 2. Handle Mongoose duplicate key error (e.g., email already exists)
  if (err.code === 11000) {
    message = `${Object.keys(err.keyValue)} already exists`;
    statusCode = 400;
  }

  // 3. Handle Invalid JWT error
  if (err.name === "JsonWebTokenError") {
    message = "Json Web Token is invalid, try again";
    statusCode = 401;
  }

  // 4. Handle JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    message = "Json Web Token is expired, try again";
    statusCode = 401;
  }

  // Final structured response sent back to client
  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;