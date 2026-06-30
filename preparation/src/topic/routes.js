import { Router } from "express";

import {
  getTopics,
  getTopic,
  generateDiscussion,
  getDiscussion,
  completeTopic,
} from "./controller.js";

import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.get("/application/:applicationId", getTopics);

router.get("/:id", getTopic);

router.post("/:id/generate", generateDiscussion);

router.get("/:id/discussion", getDiscussion);

router.patch("/:id/complete", completeTopic);

export default router;
