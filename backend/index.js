import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import problemRouter from "./routes/problem.routes.js";
import noteRouter from "./routes/note.routes.js";

// 1. Initialize Environment Configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Connect to MongoDB Cluster
connectDB();

// 3. Global Middleware Configurations
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 4. API Endpoints Pipeline Mapping
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/notes", noteRouter);

// Base Health-Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ALGONOTES Backend Server API is operational.",
  });
});

// Fallback for non-existent route matching masks
// Fallback for non-existent route matching paths
app.use((req, res, next) => {
  const error = new Error(`Route URL path '${req.originalUrl}' not found.`);
  error.statusCode = 404;
  next(error);
});

// 5. Centralized Error Handler (CRITICAL: Must be the absolute last app.use middleware)
app.use(errorMiddleware);

// 6. Launch Http Server Threads
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});