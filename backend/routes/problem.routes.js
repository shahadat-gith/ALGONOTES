import express from "express";

import { 
  createProblem, 
  deleteProblem, 
  getAllProblems, 
  getProblemById, 
  updateProblem,
  getProblemStats 
} from "../controllers/problem.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const problemRouter = express.Router();

problemRouter.use(authMiddleware); // Protect all routes in this file

problemRouter.get("/", getAllProblems);

problemRouter.post("/", createProblem);

//CRITICAL POSITIONING: Must be placed before /:id route
problemRouter.get("/stats", getProblemStats);

problemRouter.get("/:id", getProblemById);

problemRouter.put("/:id", updateProblem);

problemRouter.delete("/:id", deleteProblem);

export default problemRouter;