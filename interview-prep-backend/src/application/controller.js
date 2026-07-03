import { Application } from "./model.js";
import { Topic } from "../topic/topic.model.js";
import { Explanation } from "../topic/explanation.model.js";
import { Chat } from "../chat/model.js";

import { enqueueApplicationJob } from "./application.queue.js";
import { parseResume } from "../utils/helpers.js";

export const createApplication = async (req, res, next) => {
  try {
    const { company, role, jobDescription } = req.body;

    if (!company || !role || !jobDescription || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Company, role, job description and resume are required.",
      });
    }

    const resumeText = await parseResume(req.file.buffer);

    const application = await Application.create({
      user: req.user._id,
      company: company.trim(),
      role: role.trim(),
      processingData: {
        resumeText,
        jobDescriptionText: jobDescription.trim(),
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
      .sort({ createdAt: -1 })
      .lean();

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
    })
      .select("status failureReason")
      .lean();

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
    const [application, topics] = await Promise.all([
      Application.findOne({
        _id: req.params.id,
        user: req.user._id,
      })
        .select("-processingData")
        .lean(),

      Topic.find({
        application: req.params.id,
      })
        .sort({ order: 1 })
        .lean(),
    ]);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        application,
        topics,
      },
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

    await Promise.all([
      Explanation.deleteMany({
        topic: { $in: topicIds },
      }),

      Chat.deleteMany({
        topic: { $in: topicIds },
      }),

      Topic.deleteMany({
        application: application._id,
      }),

      application.deleteOne(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};