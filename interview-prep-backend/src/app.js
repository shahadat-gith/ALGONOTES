import express from "express";
import cors from "cors";

import applicationRoutes from "./application/routes.js";
import topicRoutes from "./topic/routes.js";
import chatRoutes from "./chat/routes.js";

import { errorHandler } from "./middlewares/error.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Preparation Service is running.",
  });
});

app.use("/api/applications", applicationRoutes);

app.use("/api/topics", topicRoutes);

app.use("/api/chat", chatRoutes);

app.use(errorHandler);

export default app;