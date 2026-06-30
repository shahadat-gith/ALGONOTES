import app from "./app.js";
import { env } from "./config/env.js";
import { connectWithDatabase } from "./config/db.js";

import "./jobs/application.worker.js";
import "./jobs/topic.worker.js";

const start = async () => {
  await connectWithDatabase();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

start();