import { Application } from "./model.js";
import { Topic } from "../topic/model.js";

import { extractResume, extractJobDescription } from "./extractor.js";

import { analyzeApplication } from "./analyzer.js";

export const processApplication = async (applicationId) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    throw new Error("Application not found.");
  }

  const { company, role, processingData } = application;

  const resume = await extractResume(processingData.resumeText);

  const jd = await extractJobDescription(processingData.jobDescriptionText);

  const { analysis, topics } = await analyzeApplication({
    company,
    role,
    resume,
    jd,
  });

  application.resume = resume;
  application.jd = jd;
  application.analysis = analysis;
  application.status = "ready";
  application.processingData = undefined;

  await application.save();

  await Topic.insertMany(
    topics.map((topic) => ({
      application: application._id,
      ...topic,
    })),
  );

  return application;
};
