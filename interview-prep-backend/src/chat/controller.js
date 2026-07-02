import { Chat } from "./model.js";
import { Topic } from "../topic/topic.model.js";
import { Application } from "../application/model.js";

import { generateContent } from "../llm/response.js";

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

    const chat = await Chat.findOne({
      topic: topic._id,
    });

    return res.status(200).json({
      success: true,
      data: chat ? chat.messages : [],
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

    // Get or create the Chat document for this topic
    let chat = await Chat.findOne({ topic: topic._id });

    if (!chat) {
      chat = await Chat.create({ topic: topic._id, messages: [] });
    }

    // Build history context for the AI
    const history = chat.messages || [];

    const answer = await generateContent({
      system: CHAT_SYSTEM_PROMPT,
      prompt: buildChatPrompt({
        company: application.company,
        role: application.role,
        topic: topic.title,
        discussion: topic.discussion?.content || "",
        history,
        question: message,
      }),
    });

    // Append user message and assistant response
    chat.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: answer },
    );

    await chat.save();

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    next(error);
  }
};
