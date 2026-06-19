import app from './app.js';
import { connectDB } from './database/db.js';

const PORT = process.env.PORT || 8000;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

const startLocalServer = async () => {
  try {
    console.log(`Starting local application server in ${ENVIRONMENT} mode...`);
    
    // Connect to MongoDB locally before opening the port listener
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`[Express] Application startup completed. Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Fatal system crash during development server startup: ${error.message}`);
    process.exit(1);
  }
};

startLocalServer();