import { Chat } from "./model.js";
import { Topic } from "../topic/model.js";
import { Application } from "../application/model.js";

import { generateContent } from "../utils/llm.js";

import { CHAT_SYSTEM_PROMPT, buildChatPrompt } from "../prompts/chat.js";

export const getChat = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topicId);

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

    const messages = await Chat.find({
      topic: topic._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    const topic = await Topic.findById(req.params.topicId);

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

    const history = await Chat.find({
      topic: topic._id,
    }).sort({ createdAt: 1 });

    const answer = await generateContent({
      system: CHAT_SYSTEM_PROMPT,
      prompt: buildChatPrompt({
        topic: topic.title,
        discussion: topic.discussion.content,
        history,
        question: message,
      }),
    });

    await Chat.create([
      {
        topic: topic._id,
        role: "user",
        message,
      },
      {
        topic: topic._id,
        role: "assistant",
        message: answer,
      },
    ]);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    next(error);
  }
};
