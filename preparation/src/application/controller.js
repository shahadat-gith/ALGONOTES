import { Application } from "./model.js";
import { Topic } from "../topic/model.js";
import { Chat } from "../chat/model.js";

import { enqueueApplicationJob } from "../jobs/application.queue.js";
import { extractResumeText } from "../utils/helpers.js";

export const createApplication = async (req, res, next) => {
  try {
    const { company, role, jobDescription } = req.body;

    const resumeText = await extractResumeText(req.file.buffer);

    const application = await Application.create({
      user: req.user._id,
      company,
      role,
      processingData: {
        resumeText,
        jobDescriptionText: jobDescription,
      },
    });

    await enqueueApplicationJob(application._id);

    return res.status(202).json({
      success: true,
      message: "Application submitted successfully.",
      applicationId: application._id,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      user: req.user._id,
    })
      .select("-processingData")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationStatus = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select("status failureReason");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select("-processingData");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const topics = await Topic.find({
      application: application._id,
    }).select("_id");

    const topicIds = topics.map((topic) => topic._id);

    await Chat.deleteMany({
      topic: {
        $in: topicIds,
      },
    });

    await Topic.deleteMany({
      application: application._id,
    });

    await application.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
