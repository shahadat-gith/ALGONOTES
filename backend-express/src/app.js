import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

import { connectDB } from './database/db.js';
import authRouter from './routes/auth.routes.js';
import analyticsRouter from './routes/analytics.routes.js';
import userRouter from './routes/user.routes.js';
import noteRouter from './routes/note.routes.js';
import theoryRouter from './routes/theory.routes.js';
import promptRouter from './routes/prompt.routes.js';
import searchRouter from './routes/search.routes.js';
import Analytics from './models/analytics.model.js';
import { GLOBAL_ANALYTICS_KEY } from './services/analytics.js';
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

app.use(async (req, res, next) => {
  if (req.method === 'OPTIONS' || !req.originalUrl.startsWith('/api/v1')) {
    next();
    return;
  }

  try {
    await Analytics.updateOne(
      { key: GLOBAL_ANALYTICS_KEY },
      {
        $inc: { totalApiRequests: 1 },
        $set: { updatedAt: new Date() },
        $setOnInsert: {
          key: GLOBAL_ANALYTICS_KEY,
          totalPageVisits: 0,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Failed to update API request metrics: ${error.message}`);
  }

  next();
});

// Routing Middleware Modules
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notes', noteRouter);
app.use('/api/v1/theory', theoryRouter);
app.use('/api/v1/prompt', promptRouter);
app.use('/api/v1/search', searchRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use(errorHandler);



const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();

  return await serverlessHandler(event, context);
};


export default app;