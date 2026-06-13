import express from "express";
import { 
  getCurrentUser, 
  updateProfile, 
  deleteAccount, 
  searchWorkspace,
  getDashboardMetrics
} from "../controllers/user.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const userRouter = express.Router();

// Apply auth protection globally across all profile management operations
userRouter.use(authMiddleware);

userRouter.get("/me", getCurrentUser);
userRouter.get("/search", searchWorkspace);

userRouter.get("/dashboard", getDashboardMetrics);

userRouter.delete("/account", deleteAccount);

// Put routing wrapper structure around the file handler to process memory strings seamlessly
userRouter.put("/profile", (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) return next(err); // Hands off limit errors to error middleware
    updateProfile(req, res, next);
  });
});

export default userRouter;