import { Application } from "../application/model.js";
import { Topic } from "./model.js";

import { enqueueTopicJob } from "../jobs/topic.queue.js";

export const getTopics = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.applicationId,
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
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    const application = await Application.findOne({
      _id: topic.application,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

export const generateDiscussion = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    const application = await Application.findOne({
      _id: topic.application,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (topic.discussionStatus === "ready") {
      return res.status(200).json({
        success: true,
        message: "Discussion already generated.",
      });
    }

    if (topic.discussionStatus === "processing") {
      return res.status(202).json({
        success: true,
        message: "Discussion is already being generated.",
      });
    }

    topic.discussionStatus = "processing";
    topic.discussionFailureReason = "";

    await topic.save();

    await enqueueTopicJob(topic._id);

    return res.status(202).json({
      success: true,
      message: "Discussion generation started.",
    });
  } catch (error) {
    next(error);
  }
};


export const getDiscussion = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id).select(
      "discussion discussionStatus discussionFailureReason"
    );

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    return res.status(200).json({
      success: true,
      status: topic.discussionStatus,
      failureReason: topic.discussionFailureReason,
      discussion: topic.discussion,
    });
  } catch (error) {
    next(error);
  }
};

export const completeTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    const application = await Application.findOne({
      _id: topic.application,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    topic.completed = true;
    topic.completedAt = new Date();

    await topic.save();

    return res.status(200).json({
      success: true,
      message: "Topic marked as completed.",
    });
  } catch (error) {
    next(error);
  }
};