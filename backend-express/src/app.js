import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

import { connectDB } from './database/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import noteRouter from './routes/note.routes.js';
import theoryRouter from './routes/theory.routes.js';
import promptRouter from './routes/prompt.routes.js';
import { errorHandler } from './middlewares/error.js';

dotenv.config();
const app = express();

// Base Setup Configuration
app.use(cors({
  origin: ["http://localhost:3000", "https://algonotes.onrender.com", "https://algonotes.in", "https://www.algonotes.in"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing Middleware Modules
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notes', noteRouter);
app.use('/api/v1/theory', theoryRouter);
app.use('/api/v1/prompt', promptRouter);



const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();

  return await serverlessHandler(event, context);
};


export default app;