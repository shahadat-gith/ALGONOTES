import { generateContent } from "../../llm/response.js";
import { parseJson } from "../../utils/helpers.js";
import { SYSTEM_PROMPT, buildPrompt } from "../../prompts/application.js";
import { Application } from "../../application/model.js";
import { Topic } from "../../topic/topic.model.js";

export const processApplicationJob = async (applicationId) => {
  try {
    const application = await Application.findById(applicationId);

    if (!application) {
      throw new Error("Application not found.");
    }

    const { company, role, processingData } = application;

    if (!processingData?.resumeText || !processingData?.jobDescriptionText) {
      throw new Error("Application processing data is missing.");
    }

    const response = await generateContent({
      system: SYSTEM_PROMPT,
      prompt: buildPrompt({
        company,
        role,
        resumeText: processingData.resumeText,
        jobDescriptionText: processingData.jobDescriptionText,
      }),
      json: true,
    });

    const result = parseJson(response);

    application.analysis = result.analysis;
    application.status = "completed";
    application.processingData = undefined;

    await application.save();

    const topics = result.topics || [];

    if (topics.length) {
      await Topic.insertMany(
        topics.map((topic, index) => ({
          application: application._id,
          order: topic.order ?? index + 1,
          title: topic.title,
          priority: topic.priority,
          reason: topic.reason,
        })),
      );
    }

    console.log(`✅ Application ${applicationId} processed.`);
  } catch (error) {
    await Application.findByIdAndUpdate(applicationId, {
      status: "failed",
      failureReason: error.message,
    });

    console.error(`❌ Application ${applicationId} failed:`, error);

    throw error;
  }
};
