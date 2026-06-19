import serverless from 'serverless-http';
import app from './src/app.js';
import { connectDB } from './src/database/db.js';

const serverlessHandler = serverless(app);


export const handler = async (event, context) => {
  await connectDB();
  return await serverlessHandler(event, context);
};