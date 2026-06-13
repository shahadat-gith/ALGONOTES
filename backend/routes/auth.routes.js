import express from "express";
import { register, verifyUser, login, forgotPassword } from "../controllers/auth.controller.js";

const authRouter = express.Router();

// Auth Pipelines
authRouter.post("/register", register);
authRouter.post("/verify", verifyUser);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword); 

export default authRouter;