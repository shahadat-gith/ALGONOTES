import { processApplicationJob } from "./application.worker.js";
import { processExplanationJob } from "./explanation.worker.js";

const workers = {
  "process-application": ({ applicationId }) =>
    processApplicationJob(applicationId),

  "generate-explanation": ({ topicId, codeLanguage }) =>
    processExplanationJob({ topicId, codeLanguage }),
};

export const processSQSRecord = async (record) => {
  const body = JSON.parse(record.body);

  const worker = workers[body.jobType];

  if (!worker) {
    throw new Error(`Unknown job type: ${body.jobType}`);
  }

  return worker(body);
};
