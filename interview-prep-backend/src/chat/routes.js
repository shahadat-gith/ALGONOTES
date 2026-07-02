import { Router } from "express";

import { authenticate } from "../middlewares/auth.js";

import { getChat, sendMessage } from "./controller.js";

const router = Router();

router.use(authenticate);

router.get("/:topicId", getChat);

router.post("/:topicId", sendMessage);

export default router;
