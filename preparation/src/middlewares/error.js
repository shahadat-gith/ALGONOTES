import { env } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};