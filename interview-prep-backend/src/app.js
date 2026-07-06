import express from "express";
import cors from "cors";

import { env } from "./config/env.js";

import applicationRoutes from "./application/routes.js";
import topicRoutes from "./topic/routes.js";
import chatRoutes from "./chat/routes.js";

import { errorHandler } from "./middlewares/error.js";

const app = express();

const allowedOrigins = [
  "https://algonotes.in",
  "https://www.algonotes.in",
  "http://localhost:3000"
]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Interview-prep-backend Service is running.",
  });
});

app.use("/api/applications", applicationRoutes);

app.use("/api/topics", topicRoutes);

app.use("/api/chat", chatRoutes);

app.use(errorHandler);

export default app;