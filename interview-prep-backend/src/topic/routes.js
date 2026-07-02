import { Router } from "express";

import {getTopic, generateExplanation, getExplanation, checkExplanationStatus, deleteExplanation} from "./controller.js";

import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);


router.get("/topic/:topicId", getTopic);

router.post("/explanation/:topicId", generateExplanation);

router.get("/explanation/:topicId", getExplanation);

router.get("/explanation/status/:topicId", checkExplanationStatus);

router.delete("/explanation/:topicId", deleteExplanation);


export default router;
