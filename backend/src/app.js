import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import noteRouter from './routes/note.routes.js';
import theoryRouter from './routes/theory.routes.js';
import promptRouter from './routes/prompt.routes.js';
import { errorHandler } from './middlewares/error.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://algonotes.onrender.com",
  "https://www.algonotes.in",
  "https://algonotes.in"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notes', noteRouter);
app.use('/api/v1/theory', theoryRouter);
app.use('/api/v1/prompt', promptRouter);

app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    environment: process.env.NODE_ENV || 'development' 
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    status: 'OK', 
    service: 'algonotes-backend' 
  });
});

app.use(errorHandler);

export default app;