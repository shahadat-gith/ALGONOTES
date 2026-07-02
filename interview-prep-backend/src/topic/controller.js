import { Topic } from "./topic.model.js";
import { Explanation } from "./explanation.model.js";
import { enqueueExplanationJob } from "./explanation.queue.js";


export const getTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    const [topic, explanation] = await Promise.all([
      Topic.findById(topicId),
      Explanation.findOne({ topic: topicId }),
    ]);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        topic,
        explanation
      },
    });
  } catch (error) {
    next(error);
  }
};


export const generateExplanation = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    let explanation = await Explanation.findOne({ topic: topicId });

    if (explanation?.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Explanation already generated.",
      });
    }

    if (explanation?.status === "processing") {
      return res.status(202).json({
        success: true,
        message: "Explanation is already being generated.",
      });
    }

    // Atomically find and upsert the explanation record into a processing state
    explanation = await Explanation.findOneAndUpdate(
      { topic: topicId },
      {
        topic: topicId,
        status: "processing",
        failureReason: "",
      },
      { upsert: true, new: true },
    );

    const job = await enqueueExplanationJob(topic._id);

    return res.status(202).json({
      success: true,
      message: "Explanation generation started.",
      jobId: job.id,
    });
  } catch (error) {
    next(error);
  }
};


export const getExplanation = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    
    const topicExists = await Topic.exists({ _id: topicId });
    if (!topicExists) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    const explanation = await Explanation.findOne({ topic: topicId });

    if (!explanation) {
      return res.status(200).json({
        success: true,
        data: {
          status: "unrequested",
          failureReason: "",
          tableOfContents: [],
          sections: [],
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        status: explanation.status,
        failureReason: explanation.failureReason,
        tableOfContents: explanation.tableOfContents,
        sections: explanation.sections,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const checkExplanationStatus = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    const topicExists = await Topic.exists({ _id: topicId });
    if (!topicExists) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }


    const explanation = await Explanation.findOne({ topic: topicId })
      .select("status failureReason");

    if (!explanation) {
      return res.status(200).json({
        success: false,
        message:"Explanation data not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        status: explanation.status,
        failureReason: explanation.failureReason
      }
    });
  } catch (error) {
    next(error);
  }
};


export const deleteExplanation = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    const deletedExplanation = await Explanation.findOneAndDelete({ topic: topicId });

    if (!deletedExplanation) {
      return res.status(404).json({
        success: false,
        message: "No explanation document found to delete.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Explanation deleted successfully. ",
    });
  } catch (error) {
    next(error);
  }
};