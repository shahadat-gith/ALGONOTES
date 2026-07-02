import { Worker } from "bullmq";
import { generateContent } from "../llm/response.js";
import { parseJson } from "../utils/helpers.js";

import { redis } from "../config/redis.js";
import { env } from "../config/env.js";

import { RESUME_SYSTEM_PROMPT, buildResumePrompt } from "../prompts/resume.js";
import { ANALYSIS_SYSTEM_PROMPT, buildAnalyzerPrompt } from "../prompts/analyzer.js";
import { JD_SYSTEM_PROMPT, buildJDPrompt } from "../prompts/jd.js";

import { Application } from "./model.js";
import { Topic } from "../topic/topic.model.js";

export const applicationWorker = new Worker("application", async (job) => {
    const { applicationId } = job.data;
    let application = null;

    try {
      application = await Application.findById(applicationId);
      if (!application) {
        throw new Error("Application context record not found in data layer.");
      }

      if (
        !application.processingData ||
        !application.processingData.resumeText
      ) {
        console.warn(
          `⚠️ Application ${applicationId} is missing raw processing text data. Skipping structural parsing.`,
        );
        return;
      }

      const { company, role, processingData } = application;

      // 1. Parse Resume
      const resumeResponse = await generateContent({
        system: RESUME_SYSTEM_PROMPT,
        prompt: buildResumePrompt(processingData.resumeText),
        json: true,
      });

      const resume = parseJson(resumeResponse);

      // 2. Parse Job Description
      const jdResponse = await generateContent({
        system: JD_SYSTEM_PROMPT,
        prompt: buildJDPrompt(processingData.jobDescriptionText),
        json: true,
      });

      const jd = parseJson(jdResponse);

      // 3. Generate Analysis & Interview Roadmap
      const analysisResponse = await generateContent({
        system: ANALYSIS_SYSTEM_PROMPT,
        prompt: buildAnalyzerPrompt({
          company,
          role,
          resume,
          jd,
        }),
        json: true,
      });
      
      const parsedAnalysis = parseJson(analysisResponse);
      const analysis = parsedAnalysis?.analysis;
      const rawTopics = parsedAnalysis?.topics || [];

      // 3. Mutate Application Profile Fields on Core Document
      application.resume = resume;
      application.jd = jd;
      application.analysis = analysis;
      application.status = "completed";
      application.processingData = undefined;

      await application.save();

      // 4. Provision Generated Roadmap Topics
      if (rawTopics.length > 0) {
        const topicDocs = rawTopics.map((topic) => ({
          application: application._id,
          order: topic.order,
          title: topic.title,
          priority: topic.priority,
          reason: topic.reason,
        }));

        await Topic.insertMany(topicDocs);
      }
    } catch (error) {
      await Application.findByIdAndUpdate(applicationId, {
        status: "failed",
        failureReason: error.message,
      });

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

applicationWorker.on("completed", (job) => {
  console.log(`✅ Application ${job.data.applicationId} processed.`);
});

applicationWorker.on("failed", (job, error) => {
  console.error(
    `❌ Application ${job?.data?.applicationId} failed:`,
    error.message,
  );
});
