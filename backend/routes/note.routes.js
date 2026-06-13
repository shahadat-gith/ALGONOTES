import express from "express";
import { 
  generateAiNote, 
  saveNote, 
  getNoteByProblem,
  regenerateAiNote,
  getAllNotesByUser
} from "../controllers/note.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const noteRouter = express.Router();

noteRouter.use(authMiddleware);

noteRouter.post("/generate/:problemId", generateAiNote);     
noteRouter.post("/regenerate/:problemId", regenerateAiNote); 
noteRouter.post("/save", saveNote);                          
noteRouter.get("/user", getAllNotesByUser);             
noteRouter.get("/:problemId", getNoteByProblem);             

export default noteRouter;