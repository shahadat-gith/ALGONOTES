import { Router } from "express";

import {
  createApplication,
  getApplications,
  getApplication,
  getApplicationStatus,
  deleteApplication,
} from "./controller.js";

import { authenticate } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.use(authenticate);

router.post("/", upload.single("resume"), createApplication);

router.get("/", getApplications);

router.get("/:id", getApplication);

router.get("/:id/status", getApplicationStatus);

router.delete("/:id", deleteApplication);

export default router;
