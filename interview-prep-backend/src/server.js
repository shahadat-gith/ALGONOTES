import app from "./app.js";
import { env } from "./config/env.js";
import { connectWithDatabase } from "./config/db.js";

import "./application/application.worker.js";
import "./topic/explanation.worker.js";

const start = async () => {
  await connectWithDatabase();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

start();